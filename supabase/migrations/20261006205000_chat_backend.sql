-- MYBLIF Chat backend: persisted text + photo/video attachments.
-- One migration, scoped only to chat.

create table if not exists public.message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  request_id uuid not null references public.requests(id) on delete cascade,
  uploader_id uuid not null references auth.users(id),
  kind text not null check (kind in ('photo','video')),
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  created_at timestamptz not null default now(),
  constraint message_attachments_message_request_fkey
    foreign key (message_id, request_id)
    references public.messages(id, request_id)
    on delete cascade
);

alter table public.message_attachments enable row level security;

revoke all on public.messages from anon, authenticated;
grant select, insert on public.messages to authenticated;

revoke all on public.message_attachments from anon, authenticated;
grant select, insert on public.message_attachments to authenticated;

drop policy if exists message_attachments_select_authorized on public.message_attachments;
create policy message_attachments_select_authorized
on public.message_attachments
for select to authenticated
using (private.can_access_request(request_id));

drop policy if exists message_attachments_insert_authorized on public.message_attachments;
create policy message_attachments_insert_authorized
on public.message_attachments
for insert to authenticated
with check (
  uploader_id = auth.uid()
  and private.can_access_request(request_id)
  and exists (
    select 1 from public.messages m
    where m.id = message_id
      and m.request_id = message_attachments.request_id
      and m.sender_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chat-media',
  'chat-media',
  false,
  104857600,
  array['image/jpeg','image/png','image/webp','image/heic','image/heif','video/mp4','video/quicktime','video/webm']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists chat_media_select_authorized on storage.objects;
create policy chat_media_select_authorized
on storage.objects
for select to authenticated
using (
  bucket_id = 'chat-media'
  and exists (
    select 1
    from public.message_attachments a
    where a.storage_path = name
      and private.can_access_request(a.request_id)
  )
);

drop policy if exists chat_media_insert_authorized on storage.objects;
create policy chat_media_insert_authorized
on storage.objects
for insert to authenticated
with check (
  bucket_id = 'chat-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists chat_media_delete_own on storage.objects;
create policy chat_media_delete_own
on storage.objects
for delete to authenticated
using (
  bucket_id = 'chat-media'
  and owner_id = auth.uid()::text
);
