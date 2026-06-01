/* ─────────────────────────────────────────────
 * Media Store - Cloud R2 + server-side registry
 *
 * Primary storage: Cloudflare R2 (via API routes)
 * Source of truth for the library: the server media
 * registry (/api/media/list), scoped per-user and
 * optionally per-product.
 *
 * Uploads are recorded against the uploading user (and
 * the active product), so the editor's media library
 * only ever shows a user's own files - never another
 * account's. This replaces the previous per-browser
 * IndexedDB cache, which leaked uploads between users
 * sharing a browser and mixed every product together.
 *
 * On publish/save, element props store the R2 URL
 * directly - no blob: or data: URLs in persisted data.
 * ──────────────────────────────────────────── */

/* ─── Allowed Types ─────────────────────────── */

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/aac",
  "audio/webm",
  "audio/mp4",
];

const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_AUDIO_TYPES];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10 MB
const MAX_AUDIO_SIZE = 25 * 1024 * 1024;  // 25 MB
const THUMBNAIL_SIZE = 200; // px

/* ─── Types ─────────────────────────────────── */

export type MediaType = "image" | "audio" | "document";

/** Which set of media to list. "product" = only the active product's uploads. */
export type MediaScope = "product" | "user";

export interface MediaItem {
  id: string;
  /** Original filename */
  name: string;
  size: number;
  type: string;
  /** "image", "audio" or "document" */
  mediaType: MediaType;
  width: number;
  height: number;
  /** Duration in seconds (audio only) */
  duration: number;
  createdAt: string;
  /** Public R2 URL - the canonical reference for element props */
  url: string;
  /** R2 object key - for deletion */
  r2Key: string;
  /** Local thumbnail blob (images only, generated on upload for instant preview) */
  thumbnailBlob: Blob | null;
}

/** Lightweight reference (without blobs) for listings */
export interface MediaItemMeta {
  id: string;
  name: string;
  size: number;
  type: string;
  mediaType: MediaType;
  width: number;
  height: number;
  duration: number;
  createdAt: string;
  /** Public R2 URL */
  url: string;
  /** R2 object key */
  r2Key: string;
}

export interface MediaValidationError {
  code: "TOO_LARGE" | "INVALID_TYPE";
  message: string;
}

/* ─── Active product context ────────────────── */

/**
 * The product (ProductProfile id) currently being edited. Uploads are tagged
 * with this so the library can be scoped per-product. Set by <MediaProvider>.
 * Module-level because some element components upload via a direct import of
 * addMedia() rather than through React context.
 */
let activeProfileId: string | null = null;

export function setActiveMediaProfile(profileId: string | null): void {
  activeProfileId = profileId ?? null;
}

export function getActiveMediaProfile(): string | null {
  return activeProfileId;
}

/* ─── Image Utilities ───────────────────────── */

function loadImageDimensions(
  blob: Blob
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function generateThumbnail(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(blob); // fallback
        return;
      }

      const ratio = Math.min(
        THUMBNAIL_SIZE / img.naturalWidth,
        THUMBNAIL_SIZE / img.naturalHeight,
        1 // Never upscale
      );
      canvas.width = Math.round(img.naturalWidth * ratio);
      canvas.height = Math.round(img.naturalHeight * ratio);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (thumbBlob) => {
          resolve(thumbBlob || blob);
        },
        "image/jpeg",
        0.7
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to generate thumbnail"));
    };
    img.src = url;
  });
}

function isImageType(type: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(type);
}

function isAudioType(type: string): boolean {
  return ALLOWED_AUDIO_TYPES.includes(type);
}

/* ─── Validation ────────────────────────────── */

export function validateFile(
  file: File
): MediaValidationError | null {
  const isImage = isImageType(file.type);
  const isAudio = isAudioType(file.type);

  if (!isImage && !isAudio) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        code: "INVALID_TYPE",
        message: `Unsupported file type "${file.type}". Use JPG, PNG, GIF, WebP, SVG for images or MP3, WAV, OGG, AAC for audio.`,
      };
    }
  }

  const maxSize = isAudio ? MAX_AUDIO_SIZE : MAX_IMAGE_SIZE;
  const label = isAudio ? "25MB" : "10MB";

  if (file.size > maxSize) {
    return {
      code: "TOO_LARGE",
      message: `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum for ${isAudio ? "audio" : "images"} is ${label}.`,
    };
  }
  return null;
}

/* ─── R2 Upload (via API route) ─────────────── */

export interface R2UploadResponse {
  id: string | null;
  url: string;
  key: string;
  name: string;
  size: number;
  type: string;
  mediaType: MediaType;
  createdAt: string;
}

/**
 * Upload a file to Cloudflare R2 via the /api/media/upload endpoint.
 * Records the asset against the current user + active product.
 */
async function uploadToR2(file: File): Promise<R2UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (activeProfileId) formData.append("profileId", activeProfileId);

  const response = await fetch("/api/media/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err.error || `Upload failed (${response.status})`);
  }

  return response.json();
}

/**
 * Delete a file from R2 (and the server registry) via /api/media/delete.
 */
async function deleteFromR2(key: string): Promise<void> {
  const response = await fetch("/api/media/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Delete failed" }));
    throw new Error(err.error || `Delete failed (${response.status})`);
  }
}

/* ─── Public API ────────────────────────────── */

/**
 * Upload a file to R2 and record it in the server registry (scoped to the
 * current user + active product). Returns the full MediaItem with the public
 * R2 URL and a locally-generated thumbnail for instant preview.
 */
export async function addMedia(file: File): Promise<MediaItem> {
  const validationError = validateFile(file);
  if (validationError) {
    throw new Error(validationError.message);
  }

  const isImage = isImageType(file.type);
  const blob = new Blob([await file.arrayBuffer()], { type: file.type });

  // ── Upload to R2 + record on the server ──
  const r2Result = await uploadToR2(file);

  // ── Get image dimensions + thumbnail (images only) for instant preview ──
  let width = 0;
  let height = 0;
  let thumbnailBlob: Blob | null = null;

  if (isImage) {
    try {
      const [dims, thumb] = await Promise.all([
        loadImageDimensions(blob),
        generateThumbnail(blob),
      ]);
      width = dims.width;
      height = dims.height;
      thumbnailBlob = thumb;
    } catch {
      // Non-fatal - continue without dimensions/thumbnail
    }
  }

  return {
    id: r2Result.id || r2Result.key,
    name: file.name,
    size: file.size,
    type: file.type,
    mediaType: isImage ? "image" : "audio",
    width,
    height,
    duration: 0,
    createdAt: r2Result.createdAt,
    url: r2Result.url,
    r2Key: r2Result.key,
    thumbnailBlob,
  };
}

export interface ListMediaOptions {
  scope?: MediaScope;
  type?: MediaType;
}

/**
 * List the current user's media from the server registry. When a product is
 * active and scope is "product" (the default in that case), only that product's
 * uploads are returned. Never returns other users' files.
 */
export async function listMedia(
  opts: ListMediaOptions = {}
): Promise<MediaItem[]> {
  const params = new URLSearchParams();
  if (activeProfileId) params.set("profileId", activeProfileId);
  if (opts.scope) params.set("scope", opts.scope);
  if (opts.type) params.set("type", opts.type);

  const response = await fetch(`/api/media/list?${params.toString()}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`Failed to load media (${response.status})`);
  }

  const data = (await response.json()) as { items: Array<Omit<MediaItem, "thumbnailBlob">> };
  return (data.items || []).map((item) => ({
    ...item,
    thumbnailBlob: null,
  }));
}

/**
 * Delete a media item from both R2 and the server registry. The server verifies
 * the asset belongs to the current user before removing it.
 */
export async function deleteMedia(r2Key: string): Promise<void> {
  if (!r2Key) return;
  await deleteFromR2(r2Key);
}

/**
 * Get a renderable URL for a media item (the public R2 URL).
 */
export function createMediaUrl(item: MediaItem): string {
  return item.url || "";
}

/**
 * @deprecated Use createMediaUrl(item) instead.
 * Kept for backward compatibility with existing consumers.
 */
export function createMediaObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/** Check if a URL is a legacy media store reference (old IndexedDB ID). */
export function isMediaId(value: string): boolean {
  return value.startsWith("media_");
}

/** Check if a URL is a cloud R2 URL */
export function isR2Url(value: string): boolean {
  return value.includes(".r2.") || value.includes("/images/") || value.includes("/audio/");
}
