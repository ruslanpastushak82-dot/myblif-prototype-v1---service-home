-- Rollback for 20261006205000_chat_backend.sql v2.2.
-- DESTRUCTIVE for message_attachments. Storage objects/buckets are intentionally retained.

drop function if exists public.list_orphan_chat_media(interval,int);
drop function if exists public.send_chat_message(uuid,text,uuid,jsonb);

drop policy if exists chat_files_insert_authorized on storage.objects;
drop policy if exists chat_files_select_authorized on storage.objects;
drop function if exists private.chat_replay_matches(uuid,uuid,text,text[]);
drop function if exists private.chat_upload_allowed(text,text);
drop function if exists private.chat_request_writable(uuid);

drop table if exists public.message_attachments;
drop index if exists public.messages_sender_client_message_id_key;
alter table public.messages drop constraint if exists messages_id_request_id_key;
alter table public.messages drop column if exists client_message_id;

revoke all on public.messages from anon,authenticated;
drop policy if exists messages_insert_authorized on public.messages;
create policy messages_insert_authorized on public.messages
for insert to authenticated
with check (
  sender_id=auth.uid()
  and private.can_access_message_scope(request_id,offer_id)
);

-- chat-photos/chat-videos are left in place because they may contain Storage objects.
