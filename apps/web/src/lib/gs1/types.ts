/* ─────────────────────────────────────────────
 * GS1 GTIN types
 * ──────────────────────────────────────────── */

export type GtinLength = 8 | 12 | 13 | 14;

/** Result of local (no network) check-digit format validation. */
export interface GtinFormatResult {
  valid: boolean;
  /** Canonical 14-digit, zero-padded form. Populated even on a bad check
   * digit (so the caller can still show what was parsed), null only when the
   * input couldn't be parsed as a GTIN-shaped string at all. */
  canonical14: string | null;
  length: GtinLength | null;
  reason?: "wrong_length" | "non_numeric" | "bad_check_digit";
}

/**
 * Result of calling the external GS1 UK GTIN Check API. Distinct from
 * GtinFormatResult: format validity is necessary but not sufficient for
 * `verified: true` - only a genuine GS1 API confirmation (CertaintyValue 3 +
 * an ACTIVE registration) unlocks the "GTIN Verified" badge. `data` may be
 * present on the `verified: false` branch too (e.g. CertaintyValue 2 - a
 * real GS1 company prefix was found, just no full product match) so the
 * details view still has something to show beyond a bare status.
 */
export type Gs1VerificationResult =
  | { ok: true; verified: true; data?: Record<string, unknown> }
  | { ok: true; verified: false; reason: "not_found"; data?: Record<string, unknown> }
  | { ok: false; reason: "not_configured" | "network_error" | "invalid_response" };
