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

export type ChatDraft = {
  requestId: string;
  clientMessageId: string;
  text: string;
  items: Array<{
    file: File;
    kind: MediaKind;
    path: string;
    fileName: string;
    uploaded: boolean;
  }>;
};

const BUCKET = { photo: "chat-photos", video: "chat-videos" } as const;

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

export const createChatDraft = async (
  requestId: string,
  text: string,
  files: Array<{ file: File; kind: MediaKind }>,
): Promise<ChatDraft> => {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error("Authentication required.");

  return {
    requestId,
    clientMessageId: crypto.randomUUID(),
    text: text.trim(),
    items: files.map(({ file, kind }) => ({
      file,
      kind,
      path: `${user.id}/${requestId}/${crypto.randomUUID()}-${safeName(file.name)}`,
      fileName: file.name,
      uploaded: false,
    })),
  };
};

const isAlreadyExists = (error: unknown): boolean => {
  const value = error as { statusCode?: string | number; message?: string };
  return String(value?.statusCode) === "409" || /already exists/i.test(value?.message ?? "");
};

export const sendChatDraft = async (draft: ChatDraft): Promise<void> => {
  if (!draft.text && draft.items.length === 0) return;

  for (const item of draft.items) {
    if (item.uploaded) continue;
    const { error } = await supabase.storage
      .from(BUCKET[item.kind])
      .upload(item.path, item.file, { contentType: item.file.type, upsert: false });
    if (error && !isAlreadyExists(error)) throw error;
    item.uploaded = true;
  }

  const { error } = await supabase.rpc("send_chat_message", {
    p_request_id: draft.requestId,
    p_text: draft.text,
    p_client_message_id: draft.clientMessageId,
    p_attachments: draft.items.map((item) => ({
      kind: item.kind,
      storage_path: item.path,
      file_name: item.fileName,
    })),
  });
  if (error) throw error;
};

export const openChatAttachment = async (
  kind: MediaKind,
  storagePath: string,
): Promise<void> => {
  const { data, error } = await supabase.storage
    .from(BUCKET[kind])
    .createSignedUrl(storagePath, 60);
  if (error || !data?.signedUrl) throw error ?? new Error("Attachment is unavailable.");
  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
};
