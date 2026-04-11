/* ─────────────────────────────────────────────
 * Media Store — IndexedDB-backed image storage
 *
 * Phase 1: local browser storage via IndexedDB.
 * The API surface is designed so a future cloud
 * storage adapter (S3, R2, etc.) can be swapped
 * in without changing consumer code.
 * ──────────────────────────────────────────── */

const DB_NAME = "productix-media";
const DB_VERSION = 1;
const STORE_NAME = "media";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const THUMBNAIL_SIZE = 200; // px

/* ─── Types ─────────────────────────────────── */

export interface MediaItem {
  id: string;
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  createdAt: string;
  blob: Blob;
  thumbnailBlob: Blob;
}

/** Lightweight reference (without blobs) for listings */
export interface MediaItemMeta {
  id: string;
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  createdAt: string;
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

/* ─── Validation ────────────────────────────── */

export function validateFile(
  file: File
): MediaValidationError | null {
  if (file.size > MAX_FILE_SIZE) {
    return {
      code: "TOO_LARGE",
      message: `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 10MB.`,
    };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      code: "INVALID_TYPE",
      message: `Unsupported file type "${file.type}". Use JPG, PNG, GIF, WebP, or SVG.`,
    };
  }
  return null;
}

/* ─── Public API ────────────────────────────── */

/** Upload a new image file to the store */
export async function addMedia(file: File): Promise<MediaItem> {
  const validationError = validateFile(file);
  if (validationError) {
    throw new Error(validationError.message);
  }

  const id = generateId();
  const blob = new Blob([await file.arrayBuffer()], { type: file.type });
  const [dimensions, thumbnailBlob] = await Promise.all([
    loadImageDimensions(blob),
    generateThumbnail(blob),
  ]);

  const item: MediaItem = {
    id,
    name: file.name,
    size: file.size,
    type: file.type,
    width: dimensions.width,
    height: dimensions.height,
    createdAt: new Date().toISOString(),
    blob,
    thumbnailBlob,
  };

  const db = await openDB();
  await req(txStore(db, "readwrite").put(item));
  db.close();

  return item;
}

/** Get a single media item by ID */
export async function getMedia(
  id: string
): Promise<MediaItem | null> {
  const db = await openDB();
  const result = await req(txStore(db, "readonly").get(id));
  db.close();
  return result || null;
}

/** Get all media items (sorted newest first) */
export async function getAllMedia(): Promise<MediaItem[]> {
  const db = await openDB();
  const items: MediaItem[] = await req(txStore(db, "readonly").getAll());
  db.close();
  return items.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Delete a media item by ID */
export async function deleteMedia(id: string): Promise<void> {
  const db = await openDB();
  await req(txStore(db, "readwrite").delete(id));
  db.close();
}

/**
 * Get a renderable object URL for a media item.
 * Caller is responsible for revoking via URL.revokeObjectURL
 * when no longer needed, or use the MediaContext which caches these.
 */
export function createMediaObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/** Check if a URL is a media store reference */
export function isMediaId(value: string): boolean {
  return value.startsWith("media_");
}
