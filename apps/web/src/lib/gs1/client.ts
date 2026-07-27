import "server-only";
import type { Gs1VerificationResult } from "./types";

/**
 * GS1 UK GTIN Check API client.
 * https://gtincheck.gs1uk.org (see GTIN_Check_API_Developers_guide v5.0, March 2024)
 *
 * Configured via env:
 *   GS1_API_KEY      - the "Bearer" auth key GS1 UK issues per member
 *   GS1_API_BASE_URL - defaults to the documented endpoint below if unset
 *
 * If GS1_API_KEY is missing we return `{ ok: false, reason: "not_configured" }`
 * rather than throwing, so GTIN entry always degrades gracefully to the local
 * check-digit-only tier ("Valid GTIN format") when the key isn't set. Never
 * call this from client components - it reads GS1_API_KEY, which must never
 * reach the browser bundle.
 */

const DEFAULT_BASE_URL = "https://gtincheck.gs1uk.org";
const REQUEST_TIMEOUT_MS = 10_000;

const apiKey = process.env.GS1_API_KEY;
const baseUrl = process.env.GS1_API_BASE_URL || DEFAULT_BASE_URL;

/** One element of the API's `GTINTestResults` array (fields we actually use - the real
 * response includes a few more, e.g. IntegrityCheck/IntegrityCode/LinkSet, that we don't need). */
interface GtinTestResult {
  GTIN: string;
  /** 0 = failed integrity check; 1 = integrity OK, no matching GCP owner;
   * 2 = GCP owner found, no product record; 3 = full product match. */
  CertaintyValue: 0 | 1 | 2 | 3;
  GCPCode?: string;
  /** e.g. "ACTIVE" | "INACTIVE" - a full product match (CertaintyValue 3) can
   * still be an inactive/discontinued registration. */
  Status?: string;
  GCPOwner?: string;
  GS1Territory?: string;
  GPCCategoryCode?: string;
  GPCCategoryName?: string;
  BrandName?: string;
  ProductDescription?: string;
  ProductImageUrl?: string;
  NetContent?: string;
  CountryOfSaleCode?: string;
}

interface GtinCheckApiResponse {
  GTINTestResults?: GtinTestResult[];
  APIMessage?: { StatusCode?: number; Message?: string };
}

/** Curated, human-friendly subset of a GTINTestResult - only fields worth
 * showing a merchant. Empty/missing values are filtered out by the caller
 * (see promption-table.tsx's formatGtinValue), not here. */
function pickAvailableGtinFields(result: GtinTestResult): Record<string, unknown> {
  return {
    Status: result.Status,
    BrandName: result.BrandName,
    ProductDescription: result.ProductDescription,
    NetContent: result.NetContent,
    CountryOfSaleCode: result.CountryOfSaleCode,
    GPCCategoryName: result.GPCCategoryName,
    GPCCategoryCode: result.GPCCategoryCode,
    GCPOwner: result.GCPOwner,
    GS1Territory: result.GS1Territory,
    ProductImageUrl: result.ProductImageUrl,
  };
}

export async function verifyGtin(canonical14: string): Promise<Gs1VerificationResult> {
  if (!apiKey) {
    return { ok: false, reason: "not_configured" };
  }

  try {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ gtins: [canonical14] }),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error("[gs1] GTIN Check API request failed", res.status, canonical14);
      return { ok: false, reason: "network_error" };
    }

    const payload = (await res.json()) as GtinCheckApiResponse;

    if (payload.APIMessage?.StatusCode !== 200) {
      console.error("[gs1] GTIN Check API returned a non-success APIMessage", payload.APIMessage, canonical14);
      return { ok: false, reason: "network_error" };
    }

    const result =
      payload.GTINTestResults?.find((r) => r.GTIN === canonical14) ?? payload.GTINTestResults?.[0];

    // CertaintyValue <= 1: either failed integrity (shouldn't happen - we only
    // ever send locally check-digit-valid GTINs) or no matching GS1 company
    // prefix on record at all. Nothing meaningful to show.
    if (!result || result.CertaintyValue <= 1) {
      return { ok: true, verified: false, reason: "not_found" };
    }

    // A real, licensed GS1 company prefix was found (CertaintyValue 2 or 3).
    // Only CertaintyValue 3 with an ACTIVE registration counts as a genuine
    // "GTIN Verified" match - an inactive/discontinued product (see the GS1
    // doc's own example GTIN 05420071702255: CertaintyValue 3, Status
    // "INACTIVE") shouldn't earn the same trust badge as a live one, even
    // though we still surface whatever fields came back either way.
    const data = pickAvailableGtinFields(result);
    if (result.CertaintyValue === 3 && result.Status === "ACTIVE") {
      return { ok: true, verified: true, data };
    }
    return { ok: true, verified: false, reason: "not_found", data };
  } catch (error) {
    console.error("[gs1] verifyGtin threw", error);
    return { ok: false, reason: "network_error" };
  }
}
