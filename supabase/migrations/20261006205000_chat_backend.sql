-- MYBLIF Chat backend v2.2. NOT YET APPLIED TO PRODUCTION.
-- Private Storage -> send_chat_message() -> atomic messages + attachments -> SELECT-only clients.

alter table public.messages add column if not exists client_message_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid='public.messages'::regclass
      and conname='messages_id_request_id_key'
  ) then
    alter table public.messages
      add constraint messages_id_request_id_key unique (id, request_id);
  end if;
end $$;

create unique index if not exists messages_sender_client_message_id_key
  on public.messages(sender_id, client_message_id);

do $$
begin
  if to_regclass('public.message_attachments') is not null
     and not exists (
       select 1 from pg_constraint
       where conrelid=to_regclass('public.message_attachments')
         and conname='message_attachments_message_fk'
     ) then
    raise exception 'public.message_attachments already exists in an older shape (no composite FK). Drop it or reset the DB before applying this migration.';
  end if;
end $$;

create table if not exists public.message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null,
  request_id uuid not null,
  uploader_id uuid not null references auth.users(id),
  kind text not null check (kind in ('photo','video')),
  storage_path text not null unique,
  file_name text not null check (length(file_name) between 1 and 200),
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  created_at timestamptz not null default now(),
  constraint message_attachments_message_fk
    foreign key(message_id, request_id)
    references public.messages(id, request_id)
    on delete cascade
);
create index if not exists message_attachments_message_id_idx
  on public.message_attachments(message_id);
alter table public.message_attachments enable row level security;

drop policy if exists message_attachments_select_authorized on public.message_attachments;
create policy message_attachments_select_authorized
on public.message_attachments for select to authenticated
using (
  exists (
    select 1 from public.messages m
    where m.id=message_attachments.message_id
  )
);
drop policy if exists message_attachments_insert_authorized on public.message_attachments;

revoke all on public.messages from anon, authenticated;
grant select on public.messages to authenticated;
revoke all on public.message_attachments from anon, authenticated;
grant select on public.message_attachments to authenticated;
drop policy if exists messages_insert_authorized on public.messages;

create or replace function private.chat_request_writable(p_request_id uuid)
returns boolean
language sql stable security definer set search_path=''
as $$
  select private.can_access_message_scope(p_request_id,null)
     and exists (
       select 1 from public.requests r
       where r.id=p_request_id
         and r.status::text <> 'completed'
         and coalesce(r.professional_status::text,'') <> 'completed'
     );
$$;

create or replace function private.chat_upload_allowed(p_bucket text,p_name text)
returns boolean
language plpgsql stable security definer set search_path=''
as $$
declare
  v_uid uuid := auth.uid();
  v_parts text[] := string_to_array(p_name,'/');
begin
  if v_uid is null then return false; end if;
  if p_bucket is distinct from 'chat-photos' and p_bucket is distinct from 'chat-videos' then return false; end if;
  if array_length(v_parts,1) is distinct from 3 then return false; end if;
  if v_parts[1] is distinct from v_uid::text then return false; end if;
  if v_parts[2] !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then return false; end if;
  return private.chat_request_writable(v_parts[2]::uuid);
end;
$$;

revoke all on function private.chat_request_writable(uuid) from public,anon;
revoke all on function private.chat_upload_allowed(text,text) from public,anon;
grant execute on function private.chat_request_writable(uuid) to authenticated;
grant execute on function private.chat_upload_allowed(text,text) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values
 ('chat-photos','chat-photos',false,10485760,array['image/jpeg','image/png','image/webp','image/heic','image/heif']),
 ('chat-videos','chat-videos',false,104857600,array['video/mp4','video/quicktime','video/webm'])
on conflict(id) do update
set public=false,
    file_size_limit=excluded.file_size_limit,
    allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists chat_media_select_authorized on storage.objects;
drop policy if exists chat_media_insert_authorized on storage.objects;
drop policy if exists chat_media_delete_own on storage.objects;
drop policy if exists chat_files_insert_authorized on storage.objects;
create policy chat_files_insert_authorized
on storage.objects for insert to authenticated
with check (private.chat_upload_allowed(bucket_id,name));

drop policy if exists chat_files_select_authorized on storage.objects;
create policy chat_files_select_authorized
on storage.objects for select to authenticated
using (
  bucket_id in ('chat-photos','chat-videos')
  and (
    owner_id=auth.uid()::text
    or exists (
      select 1 from public.message_attachments a
      where a.storage_path=storage.objects.name
    )
  )
);

create or replace function private.chat_replay_matches(
  p_msg uuid,p_request uuid,p_text text,p_paths text[]
) returns boolean
language sql stable security definer set search_path=''
as $$
  select coalesce(
    exists (
      select 1 from public.messages m
      where m.id=p_msg and m.request_id=p_request and m.text=p_text
    )
    and coalesce(
      (select array_agg(a.storage_path order by a.storage_path)
       from public.message_attachments a where a.message_id=p_msg),
      '{}'::text[]
    )=p_paths,
    false
  );
$$;
revoke all on function private.chat_replay_matches(uuid,uuid,text,text[]) from public,anon,authenticated;

create or replace function public.send_chat_message(
  p_request_id uuid,
  p_text text,
  p_client_message_id uuid,
  p_attachments jsonb default '[]'::jsonb
)
returns uuid
language plpgsql security definer set search_path=''
as $$
declare
  v_uid uuid := auth.uid();
  v_text text := btrim(coalesce(p_text,''));
  v_attachments jsonb := coalesce(p_attachments,'[]'::jsonb);
  v_count int;
  v_paths text[];
  v_have_photos int;
  v_have_videos int;
  v_new_photos int;
  v_new_videos int;
  v_msg_id uuid;
  v_item jsonb;
  v_kind text;
  v_bucket text;
  v_path text;
  v_name text;
  v_obj record;
  v_size bigint;
  v_mime text;
begin
  if v_uid is null then raise exception 'Authentication required' using errcode='28000'; end if;
  if p_request_id is null or p_client_message_id is null then
    raise exception 'request_id and client_message_id are required' using errcode='22023';
  end if;
  if jsonb_typeof(v_attachments) <> 'array' then
    raise exception 'attachments must be an array' using errcode='22023';
  end if;

  v_count := jsonb_array_length(v_attachments);
  if v_count > 5 then raise exception 'Too many attachments (max 5)' using errcode='22023'; end if;
  if v_text='' and v_count=0 then raise exception 'Empty message' using errcode='22023'; end if;
  if length(v_text)>10000 then raise exception 'Message too long' using errcode='22023'; end if;

  v_paths := coalesce(
    (select array_agg(e.value->>'storage_path' order by e.value->>'storage_path')
     from jsonb_array_elements(v_attachments)e),
    '{}'::text[]
  );

  select m.id into v_msg_id
  from public.messages m
  where m.sender_id=v_uid and m.client_message_id=p_client_message_id;
  if found then
    if not private.chat_replay_matches(v_msg_id,p_request_id,v_text,v_paths) then
      raise exception 'client_message_id was already used for a different message' using errcode='23505';
    end if;
    return v_msg_id;
  end if;

  if not private.can_access_message_scope(p_request_id,null) then
    raise exception 'Access denied' using errcode='42501';
  end if;
  perform 1 from public.requests r where r.id=p_request_id for share;
  if not private.chat_request_writable(p_request_id) then
    raise exception 'Chat is read-only or unavailable' using errcode='42501';
  end if;

  if (select count(*) from public.messages m
      where m.sender_id=v_uid and m.created_at>now()-interval '1 minute') >= 20 then
    raise exception 'Too many messages, slow down' using errcode='PT429';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_request_id::text||':'||v_uid::text,0));
  select count(*) filter(where a.kind='photo'),
         count(*) filter(where a.kind='video')
    into v_have_photos,v_have_videos
  from public.message_attachments a
  where a.request_id=p_request_id and a.uploader_id=v_uid;

  select count(*) filter(where e.value->>'kind'='photo'),
         count(*) filter(where e.value->>'kind'='video')
    into v_new_photos,v_new_videos
  from jsonb_array_elements(v_attachments)e;

  if v_have_photos+v_new_photos>10 then
    raise exception 'Photo limit reached (max 10 per order)' using errcode='22023';
  end if;
  if v_have_videos+v_new_videos>3 then
    raise exception 'Video limit reached (max 3 per order)' using errcode='22023';
  end if;

  insert into public.messages(request_id,sender_id,text,client_message_id)
  values(p_request_id,v_uid,v_text,p_client_message_id)
  on conflict(sender_id,client_message_id) do nothing
  returning id into v_msg_id;

  if v_msg_id is null then
    select m.id into v_msg_id
    from public.messages m
    where m.sender_id=v_uid and m.client_message_id=p_client_message_id;
    if not private.chat_replay_matches(v_msg_id,p_request_id,v_text,v_paths) then
      raise exception 'client_message_id was already used for a different message' using errcode='23505';
    end if;
    return v_msg_id;
  end if;

  for v_item in select value from jsonb_array_elements(v_attachments) loop
    v_kind := v_item->>'kind';
    v_path := v_item->>'storage_path';
    v_name := left(regexp_replace(
      coalesce(nullif(btrim(v_item->>'file_name'),''),'file'),
      '[^A-Za-z0-9._ -]','_','g'
    ),200);

    if v_kind is null or v_kind not in ('photo','video') then
      raise exception 'Invalid attachment kind' using errcode='22023';
    end if;
    v_bucket := case v_kind when 'photo' then 'chat-photos' else 'chat-videos' end;

    if v_path is null
       or array_length(string_to_array(v_path,'/'),1) is distinct from 3
       or split_part(v_path,'/',1)<>v_uid::text
       or split_part(v_path,'/',2)<>p_request_id::text then
      raise exception 'Invalid attachment path' using errcode='42501';
    end if;

    select o.owner_id,o.metadata into v_obj
    from storage.objects o
    where o.bucket_id=v_bucket and o.name=v_path;
    if not found then raise exception 'Attachment file has not been uploaded' using errcode='22023'; end if;
    if v_obj.owner_id is distinct from v_uid::text then
      raise exception 'Attachment belongs to another user' using errcode='42501';
    end if;

    v_size := nullif(v_obj.metadata->>'size','')::bigint;
    v_mime := v_obj.metadata->>'mimetype';
    if v_size is null or v_size<=0 or v_mime is null then
      raise exception 'Attachment metadata is missing' using errcode='22023';
    end if;
    if v_kind='photo'
       and (v_mime<>all(array['image/jpeg','image/png','image/webp','image/heic','image/heif'])
            or v_size>10485760) then
      raise exception 'Photo must be JPEG/PNG/WebP/HEIC/HEIF up to 10 MB' using errcode='22023';
    end if;
    if v_kind='video'
       and (v_mime<>all(array['video/mp4','video/quicktime','video/webm'])
            or v_size>104857600) then
      raise exception 'Video must be MP4/MOV/WebM up to 100 MB' using errcode='22023';
    end if;

    insert into public.message_attachments
      (message_id,request_id,uploader_id,kind,storage_path,file_name,mime_type,size_bytes)
    values
      (v_msg_id,p_request_id,v_uid,v_kind,v_path,v_name,v_mime,v_size);
  end loop;

  return v_msg_id;
end;
$$;

revoke all on function public.send_chat_message(uuid,text,uuid,jsonb) from public,anon;
grant execute on function public.send_chat_message(uuid,text,uuid,jsonb) to authenticated;

create or replace function public.list_orphan_chat_media(
  p_older_than interval default interval '24 hours',
  p_limit int default 500
)
returns table(bucket_id text,name text)
language sql stable security definer set search_path=''
as $$
  select o.bucket_id,o.name
  from storage.objects o
  where o.bucket_id in ('chat-photos','chat-videos')
    and o.created_at<now()-p_older_than
    and not exists (
      select 1 from public.message_attachments a
      where a.storage_path=o.name
    )
  order by o.created_at
  limit least(greatest(p_limit,1),1000);
$$;

revoke all on function public.list_orphan_chat_media(interval,int) from public,anon,authenticated;
grant execute on function public.list_orphan_chat_media(interval,int) to service_role;

-- messages is already in supabase_realtime in production. Verify in local/branch tests.
