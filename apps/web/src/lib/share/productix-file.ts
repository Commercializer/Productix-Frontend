/* ─────────────────────────────────────────────
 * .productix File Encryption
 *
 * AES-256-GCM envelope for exported page documents.
 * The encryption key is derived from PROJECT_SHARE_HASH_SALT,
 * so only this deployment can decrypt files it produced.
 * Server-only — never import from a client component.
 * ──────────────────────────────────────────── */

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

const FILE_VERSION = 1;
const FILE_KIND = "productix-page";
const ALGO = "aes-256-gcm";
const IV_LEN = 12;

function getKey(): Buffer {
  const salt = process.env.PROJECT_SHARE_HASH_SALT;
  if (!salt || salt.length < 16) {
    throw new Error(
      "PROJECT_SHARE_HASH_SALT is not configured. Set it in your environment (32+ random hex chars).",
    );
  }
  return createHash("sha256").update(salt, "utf8").digest();
}

export interface ProductixFileEnvelope {
  v: number;
  kind: string;
  iv: string;
  data: string;
  meta?: {
    productName?: string;
    slug?: string;
    exportedAt?: string;
  };
}

export function encryptProductixFile(
  payload: unknown,
  meta?: ProductixFileEnvelope["meta"],
): string {
  const key = getKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);

  const plaintext = Buffer.from(JSON.stringify(payload), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  const combined = Buffer.concat([ciphertext, tag]);

  const envelope: ProductixFileEnvelope = {
    v: FILE_VERSION,
    kind: FILE_KIND,
    iv: iv.toString("base64"),
    data: combined.toString("base64"),
    meta,
  };

  return JSON.stringify(envelope);
}

export function decryptProductixFile<T = unknown>(fileContent: string): T {
  let envelope: ProductixFileEnvelope;
  try {
    envelope = JSON.parse(fileContent);
  } catch {
    throw new Error("File is not a valid .productix envelope (invalid JSON).");
  }

  if (!envelope || envelope.kind !== FILE_KIND) {
    throw new Error("File is not a .productix project file.");
  }
  if (envelope.v !== FILE_VERSION) {
    throw new Error(`Unsupported .productix file version: ${envelope.v}`);
  }
  if (typeof envelope.iv !== "string" || typeof envelope.data !== "string") {
    throw new Error("Corrupted .productix file (missing iv/data).");
  }

  const key = getKey();
  const iv = Buffer.from(envelope.iv, "base64");
  const combined = Buffer.from(envelope.data, "base64");
  if (combined.length < 16) throw new Error("Corrupted .productix file (payload too short).");

  const tag = combined.subarray(combined.length - 16);
  const ciphertext = combined.subarray(0, combined.length - 16);

  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);

  let plaintext: Buffer;
  try {
    plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  } catch {
    throw new Error(
      "Could not decrypt .productix file. It was either tampered with or exported from a different site.",
    );
  }

  try {
    return JSON.parse(plaintext.toString("utf8")) as T;
  } catch {
    throw new Error("Decrypted payload is not valid JSON.");
  }
}
