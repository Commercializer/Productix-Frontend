/* ─────────────────────────────────────────────
 * Cloudflare R2 Client - S3-compatible object storage
 *
 * Uses the AWS SDK v3 S3 client with R2-specific
 * configuration. All media (images + audio) flows
 * through this singleton.
 * ──────────────────────────────────────────── */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

/* ─── Environment ───────────────────────────── */

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!; // e.g. https://media.productix.lk

/* ─── Client Singleton ──────────────────────── */

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (!_client) {
    _client = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return _client;
}

/* ─── Allowed MIME Types ────────────────────── */

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
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

export const ALLOWED_MEDIA_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_AUDIO_TYPES];

/** Max 10 MB for images, 25 MB for audio */
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_AUDIO_SIZE = 25 * 1024 * 1024;

/* ─── Upload ────────────────────────────────── */

export interface R2UploadResult {
  /** Public URL of the uploaded file */
  url: string;
  /** R2 object key for later deletion */
  key: string;
}

/**
 * Upload a file buffer to R2.
 *
 * @param buffer  - File data as a Buffer
 * @param filename - Original filename (used for key generation)
 * @param contentType - MIME type
 * @param folder - Optional subfolder (default: "media")
 */
export async function uploadToR2(
  buffer: Buffer,
  filename: string,
  contentType: string,
  folder: string = "media"
): Promise<R2UploadResult> {
  const client = getClient();

  // Sanitize filename and generate unique key
  const sanitized = filename
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
  const ext = sanitized.split(".").pop() || "bin";
  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const key = `${folder}/${uniqueId}.${ext}`;

  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  const url = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  return { url, key };
}

/* ─── Delete ────────────────────────────────── */

/**
 * Delete an object from R2 by key.
 */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getClient();
  await client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })
  );
}

/* ─── Helpers ───────────────────────────────── */

/** Check if a MIME type is an allowed image type */
export function isAllowedImage(type: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(type);
}

/** Check if a MIME type is an allowed audio type */
export function isAllowedAudio(type: string): boolean {
  return ALLOWED_AUDIO_TYPES.includes(type);
}

/** Check if a URL points to our R2 bucket */
export function isR2Url(url: string): boolean {
  return url.startsWith(R2_PUBLIC_URL);
}

/** Extract the R2 key from a public URL */
export function getR2KeyFromUrl(url: string): string | null {
  if (!isR2Url(url)) return null;
  const base = R2_PUBLIC_URL.replace(/\/$/, "");
  return url.slice(base.length + 1); // +1 for the slash
}
