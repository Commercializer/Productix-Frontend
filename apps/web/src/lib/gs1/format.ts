/* ─────────────────────────────────────────────
 * Shared formatting for GS1-returned data, used by both the Add-Product
 * live-check panel and the products-table GTIN details modal, so "only show
 * available details" is enforced in exactly one place.
 * ──────────────────────────────────────────── */

/** Turns a raw GS1-response key like "GCPOwner" or "gpc_category" into "GCP Owner". */
export function humanizeGtinKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

/** GS1 sometimes appends a stray language tag after the real URL, e.g.
 * ".../Product.png%20(en-GB)" or ".../Product.png (en-GB)" - either a literal
 * space or an already-percent-encoded one. Keep only the URL portion, or the
 * image request 404s on the trailing junk. */
function stripTrailingUrlJunk(url: string): string {
  return url.split(/\s|%20/i)[0]!;
}

/** Renders a raw GS1-response value as display text, or null if there's nothing worth showing. */
export function formatGtinValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return /^https?:\/\//i.test(trimmed) ? stripTrailingUrlJunk(trimmed) : trimmed;
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    const joined = value.filter((v) => v !== null && v !== undefined && v !== "").join(", ");
    return joined || null;
  }
  if (typeof value === "object") {
    try {
      const json = JSON.stringify(value);
      return json === "{}" ? null : json;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Converts a raw GS1 API data blob into display-ready [label, value] pairs -
 * only entries that actually have a value. Never renders an empty/null row.
 */
export function availableGtinDetailEntries(
  data: Record<string, unknown> | null | undefined,
): Array<[string, string]> {
  if (!data) return [];
  return Object.entries(data)
    .map(([key, value]) => [humanizeGtinKey(key), formatGtinValue(value)] as const)
    .filter((entry): entry is [string, string] => entry[1] !== null);
}
