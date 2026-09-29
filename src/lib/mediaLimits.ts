// Security hardening — client-side attachment limits (owner-approved,
// 2026-09-28): shared by every Customer upload entry point (Quick Request
// Take/Choose Photo & Take/Choose Video, and Customer MYBLIF Chat) so they
// never enforce different rules. This is a client-side UX / prototype
// guard only -- it does NOT replace future server-side upload validation
// (size/type re-checked server-side, virus/content scanning, etc.), which
// remains a BACKEND/PRODUCTION requirement per the pre-Stage-2C security
// audit.
import type { CustomerRequest, MediaKind } from "../state/CustomerRequestContext";

export const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB
export const MAX_PHOTOS_PER_ORDER = 10;
export const MAX_VIDEOS_PER_ORDER = 3;

export type MediaRejectionReason =
  | "photo-too-large"
  | "video-too-large"
  | "too-many-photos"
  | "too-many-videos"
  | "unsupported-type";

const MB = 1024 * 1024;

// Short, specific messages shown to the Customer -- one per rejection
// reason, per the approved spec (no generic "upload failed").
export const MEDIA_REJECTION_MESSAGES: Record<MediaRejectionReason, string> = {
  "photo-too-large": `Photo exceeds ${MAX_PHOTO_BYTES / MB} MB and was not added.`,
  "video-too-large": `Video exceeds ${MAX_VIDEO_BYTES / MB} MB and was not added.`,
  "too-many-photos": `Maximum ${MAX_PHOTOS_PER_ORDER} photos per order reached.`,
  "too-many-videos": `Maximum ${MAX_VIDEOS_PER_ORDER} videos per order reached.`,
  "unsupported-type": "Unsupported file type.",
};

export type MediaCounts = { photos: number; videos: number };

export const isSupportedMediaType = (file: File, kind: MediaKind): boolean =>
  kind === "photo"
    ? file.type.startsWith("image/")
    : file.type.startsWith("video/");

export type MediaValidationResult =
  | { ok: true }
  | { ok: false; reason: MediaRejectionReason };

// Pure validation -- call this BEFORE creating any object URL or touching
// state, so a rejected file never reaches addMedia/pendingAttachments.
// `counts` must reflect everything already committed to this order (see
// getMediaCounts) PLUS anything already queued locally but not yet sent
// (e.g. Chat's pendingAttachments) -- the caller is responsible for
// folding those together before calling this.
export const validateMediaFile = (
  file: File,
  kind: MediaKind,
  counts: MediaCounts,
): MediaValidationResult => {
  if (!isSupportedMediaType(file, kind)) {
    return { ok: false, reason: "unsupported-type" };
  }
  if (kind === "photo" && file.size > MAX_PHOTO_BYTES) {
    return { ok: false, reason: "photo-too-large" };
  }
  if (kind === "video" && file.size > MAX_VIDEO_BYTES) {
    return { ok: false, reason: "video-too-large" };
  }
  if (kind === "photo" && counts.photos >= MAX_PHOTOS_PER_ORDER) {
    return { ok: false, reason: "too-many-photos" };
  }
  if (kind === "video" && counts.videos >= MAX_VIDEOS_PER_ORDER) {
    return { ok: false, reason: "too-many-videos" };
  }
  return { ok: true };
};

// Total photo/video usage already committed to an order: its own
// submitted media (request.photos/videos, from Quick Request) plus every
// photo/video the Customer has already SENT via MYBLIF Chat for this same
// order. Professional-sent attachments never count against the Customer's
// limit. This is what makes the 10-photo / 3-video cap hold across BOTH
// upload entry points instead of resetting per screen. Works for the
// pre-submission draft too (its `messages` array is always empty), so the
// same helper covers Quick Request and Chat.
export const getMediaCounts = (
  request: CustomerRequest | null | undefined,
): MediaCounts => {
  if (!request) return { photos: 0, videos: 0 };
  let photos = request.photos.length;
  let videos = request.videos.length;
  for (const message of request.messages) {
    if (message.from !== "customer" || !message.attachments) continue;
    for (const attachment of message.attachments) {
      if (attachment.kind === "photo") photos += 1;
      else if (attachment.kind === "video") videos += 1;
    }
  }
  return { photos, videos };
};
