import { supabase } from "./supabase";
import type { MediaKind } from "../state/CustomerRequestContext";

export type StoredChatAttachment = {
  id: string;
  kind: MediaKind;
  file_name: string;
  storage_path: string;
};

export type StoredChatMessage = {
  id: string;
  text: string;
  sender_id: string;
  created_at: string;
  attachments: StoredChatAttachment[];
};

export const loadChatMessages = async (requestId: string): Promise<StoredChatMessage[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("id,text,sender_id,created_at,message_attachments(id,kind,file_name,storage_path)")
    .eq("request_id", requestId)
    .is("offer_id", null)
    .order("created_at");
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    id: row.id,
    text: row.text ?? "",
    sender_id: row.sender_id,
    created_at: row.created_at,
    attachments: row.message_attachments ?? [],
  }));
};

const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "_");

export const sendChatMessage = async (
  requestId: string,
  text: string,
  files: Array<{ file: File; kind: MediaKind }>,
): Promise<void> => {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error("Authentication required.");

  const trimmed = text.trim();
  if (!trimmed && files.length === 0) return;

  const { data: message, error: messageError } = await supabase
    .from("messages")
    .insert({ request_id: requestId, sender_id: user.id, text: trimmed })
    .select("id")
    .single();
  if (messageError || !message) throw messageError ?? new Error("Message was not created.");

  const uploaded: string[] = [];
  try {
    for (const item of files) {
      const path = `${user.id}/${requestId}/${message.id}/${crypto.randomUUID()}-${safeName(item.file.name)}`;
      const { error: uploadError } = await supabase.storage
        .from("chat-media")
        .upload(path, item.file, { contentType: item.file.type, upsert: false });
      if (uploadError) throw uploadError;
      uploaded.push(path);

      const { error: attachmentError } = await supabase
        .from("message_attachments")
        .insert({
          message_id: message.id,
          request_id: requestId,
          uploader_id: user.id,
          kind: item.kind,
          storage_path: path,
          file_name: item.file.name,
          mime_type: item.file.type,
          size_bytes: item.file.size,
        });
      if (attachmentError) throw attachmentError;
    }
  } catch (error) {
    if (uploaded.length > 0) {
      await supabase.storage.from("chat-media").remove(uploaded);
    }
    await supabase.from("messages").delete().eq("id", message.id);
    throw error;
  }
};

export const openChatAttachment = async (storagePath: string): Promise<void> => {
  const { data, error } = await supabase.storage
    .from("chat-media")
    .createSignedUrl(storagePath, 60);
  if (error || !data?.signedUrl) throw error ?? new Error("Attachment is unavailable.");
  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
};
