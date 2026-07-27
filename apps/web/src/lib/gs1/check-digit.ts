/* ─────────────────────────────────────────────
 * GS1 GTIN check-digit validation
 *
 * Pure, local, no network call - works immediately with no API key. This is
 * the "Valid GTIN format" tier; a genuine "GTIN Verified" claim additionally
 * requires a successful call through ./client.ts.
 *
 * Algorithm per GS1 General Specifications §7.9 (mod-10, weight 3/1
 * alternating from the rightmost digit of the payload). Hand-verified
 * against the well-known EAN-13 test number 4006381333931.
 * ──────────────────────────────────────────── */

import type { GtinFormatResult, GtinLength } from "./types";

const GTIN_LENGTHS: GtinLength[] = [8, 12, 13, 14];

/**
 * Computes the GS1 mod-10 check digit for a payload (the GTIN's digits
 * excluding the check digit itself, of any length).
 */
export function computeGtinCheckDigit(payload: string): number {
  let sum = 0;
  for (let i = 0; i < payload.length; i++) {
    const digit = Number(payload[payload.length - 1 - i]);
    const weight = i % 2 === 0 ? 3 : 1;
    sum += digit * weight;
  }
  return (10 - (sum % 10)) % 10;
}

/**
 * Strips whitespace/dashes and left-pads a raw 8/12/13/14-digit GTIN string
 * to its canonical 14-digit form. Returns null if the input isn't a
 * plausible GTIN-shaped string (non-numeric, or an unsupported length).
 * Padding is check-digit-invariant (leading zeros contribute 0 regardless of
 * weight), so downstream validation works identically for any input length.
 */
export function normalizeGtin(raw: string): { digits: string; length: GtinLength } | null {
  const stripped = raw.trim().replace(/[\s-]/g, "");
  if (!stripped || !/^\d+$/.test(stripped)) return null;
  if (!GTIN_LENGTHS.includes(stripped.length as GtinLength)) return null;
  return { digits: stripped, length: stripped.length as GtinLength };
}

/**
 * Validates a raw GTIN string locally: shape, length, and GS1 check digit.
 * Never throws, never calls the network.
 */
export function validateGtinFormat(raw: string): GtinFormatResult {
  const stripped = raw.trim().replace(/[\s-]/g, "");

  if (!stripped) {
    return { valid: false, canonical14: null, length: null, reason: "wrong_length" };
  }
  if (!/^\d+$/.test(stripped)) {
    return { valid: false, canonical14: null, length: null, reason: "non_numeric" };
  }
  if (!GTIN_LENGTHS.includes(stripped.length as GtinLength)) {
    return { valid: false, canonical14: null, length: null, reason: "wrong_length" };
  }

  const length = stripped.length as GtinLength;
  const canonical14 = stripped.padStart(14, "0");
  const payload = canonical14.slice(0, 13);
  const providedCheckDigit = Number(canonical14[13]);
  const expectedCheckDigit = computeGtinCheckDigit(payload);

  if (providedCheckDigit !== expectedCheckDigit) {
    return { valid: false, canonical14, length, reason: "bad_check_digit" };
  }

  return { valid: true, canonical14, length };
}
