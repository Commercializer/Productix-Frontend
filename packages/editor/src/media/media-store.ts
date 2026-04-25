/* ─────────────────────────────────────────────
 * Media Store — Cloud R2 + IndexedDB cache
 *
 * Primary storage: Cloudflare R2 (via API routes)
 * Local cache: IndexedDB for thumbnails + metadata
 *
 * Upload flow:
 *   1. Upload file to /api/media/upload → R2
 *   2. Get back a permanent public URL
 *   3. Cache metadata + thumbnail locally in IndexedDB
 *
 * On publish/save, element props store the R2 URL
 * directly — no blob: or data: URLs in persisted data.
 * ──────────────────────────────────────────── */

const DB_NAME = "productix-media";
const DB_VERSION = 2; // Bumped for schema changes
const STORE_NAME = "media";

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

export type MediaType = "image" | "audio";

export interface MediaItem {
  id: string;
  /** Original filename */
  name: string;
  size: number;
  type: string;
  /** "image" or "audio" */
  mediaType: MediaType;
  width: number;
  height: number;
  /** Duration in seconds (audio only) */
  duration: number;
  createdAt: string;
  /** Public R2 URL — the canonical reference for element props */
  url: string;
  /** R2 object key — for deletion */
  r2Key: string;
  /** Local thumbnail blob (images only, for library UI) */
  thumbnailBlob: Blob | null;
  /**
   * @deprecated Legacy field — kept for backward compat with old items.
   * New items store the R2 url instead of a blob.
   */
  blob?: Blob;
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

/* ─── DB Helpers ────────────────────────────── */

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function txStore(
  db: IDBDatabase,
  mode: IDBTransactionMode
): IDBObjectStore {
  return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
}

function req<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
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

function generateId(): string {
  return `media_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
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
  url: string;
  key: string;
  name: string;
  size: number;
  type: string;
  mediaType: "image" | "audio";
}

/**
 * Upload a file to Cloudflare R2 via the /api/media/upload endpoint.
 * Returns the public URL, R2 key, and metadata.
 */
async function uploadToR2(file: File): Promise<R2UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

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
 * Delete a file from R2 via the /api/media/delete endpoint.
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
 * Upload a file to R2 and cache metadata in IndexedDB.
 * Returns the full MediaItem with the public R2 URL.
 */
export async function addMedia(file: File): Promise<MediaItem> {
  const validationError = validateFile(file);
  if (validationError) {
    throw new Error(validationError.message);
  }

  const id = generateId();
  const isImage = isImageType(file.type);
  const blob = new Blob([await file.arrayBuffer()], { type: file.type });

  // ── Upload to R2 ──
  const r2Result = await uploadToR2(file);

  // ── Get image dimensions + thumbnail (images only) ──
  let width = 0;
  let height = 0;
  let duration = 0;
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
      // Non-fatal — continue without dimensions/thumbnail
    }
  }

  const item: MediaItem = {
    id,
    name: file.name,
    size: file.size,
    type: file.type,
    mediaType: isImage ? "image" : "audio",
    width,
    height,
    duration,
    createdAt: new Date().toISOString(),
    url: r2Result.url,
    r2Key: r2Result.key,
    thumbnailBlob,
  };

  // ── Cache in IndexedDB (metadata + thumbnail only, no full blob) ──
  try {
    const db = await openDB();
    await req(txStore(db, "readwrite").put(item));
    db.close();
  } catch {
    // IndexedDB may not be available — R2 upload already succeeded
  }

  return item;
}

/** Get a single media item by ID (from IndexedDB cache) */
export async function getMedia(
  id: string
): Promise<MediaItem | null> {
  const db = await openDB();
  const result = await req(txStore(db, "readonly").get(id));
  db.close();
  return result || null;
}

/** Get all media items (sorted newest first, from IndexedDB cache) */
export async function getAllMedia(): Promise<MediaItem[]> {
  const db = await openDB();
  const items: MediaItem[] = await req(txStore(db, "readonly").getAll());
  db.close();
  return items.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Delete a media item from both R2 and IndexedDB */
export async function deleteMedia(id: string): Promise<void> {
  // Load the item to get the R2 key
  try {
    const item = await getMedia(id);
    if (item?.r2Key) {
      await deleteFromR2(item.r2Key);
    }
  } catch {
    // Continue with local deletion even if R2 delete fails
  }

  // Remove from IndexedDB
  const db = await openDB();
  await req(txStore(db, "readwrite").delete(id));
  db.close();
}

/**
 * Get a renderable URL for a media item.
 *
 * For R2-backed items, this returns the public R2 URL directly.
 * For legacy blob-backed items, creates an object URL.
 * Caller is responsible for revoking blob URLs.
 */
export function createMediaUrl(item: MediaItem): string {
  if (item.url) return item.url;
  // Legacy fallback for old IndexedDB-only items
  if (item.blob) return URL.createObjectURL(item.blob);
  return "";
}

/**
 * @deprecated Use createMediaUrl(item) instead.
 * Kept for backward compatibility with existing consumers.
 */
export function createMediaObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/** Check if a URL is a media store reference (legacy ID check) */
export function isMediaId(value: string): boolean {
  return value.startsWith("media_");
}

/** Check if a URL is a cloud R2 URL */
export function isR2Url(value: string): boolean {
  return value.includes(".r2.") || value.includes("/images/") || value.includes("/audio/");
}
