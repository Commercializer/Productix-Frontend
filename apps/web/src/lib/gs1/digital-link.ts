/* ─────────────────────────────────────────────
 * GS1 Digital Link URL builder / parser
 *
 * Builds a non-reference GS1 Digital Link URI (GS1 Digital Link Standard
 * §5.10 customURIstem) on this app's own domain: the GTIN is the primary
 * identification key in the path (§5.2/§5.6, AI 01), and channel/branch
 * attribution live in the query string as extension parameters (§5.9.1
 * explicitly permits non-numeric, non-reserved key=value pairs for exactly
 * this - "a specific role, action, activity or type of service to be
 * accessed"). Reserved words per the spec (lot, exp, expdt, linkType,
 * context) are avoided.
 * ──────────────────────────────────────────── */

const GTIN_PATH_RE = /^\d{14}$/;

export interface BuildGs1DigitalLinkUrlOptions {
  /** Hostname (with or without protocol), e.g. "productix.app" or
   * "https://brand.example.com". No trailing slash/path expected. */
  domain: string;
  /** Canonical 14-digit GTIN. */
  gtin: string;
  /** Branch/location attribution code, reusing the existing ?b= param already
   * parsed by resolveBranchIdFromSearch regardless of path shape. */
  branchCode?: string | number | null;
  /** Marketing-channel / traffic-source label (e.g. "onpack", "social",
   * "link", or a company-custom label), stored in the existing
   * qr_scan_prefix column exactly like CUSTOM link types reuse it today. */
  channel?: string | null;
}

/** Builds `https://{domain}/01/{gtin}?ch=..&b=..`. */
export function buildGs1DigitalLinkUrl(opts: BuildGs1DigitalLinkUrlOptions): string {
  const trimmed = opts.domain.replace(/\/+$/, "");
  const base = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  const params = new URLSearchParams();
  if (opts.channel) params.set("ch", opts.channel);
  if (opts.branchCode !== null && opts.branchCode !== undefined && opts.branchCode !== "") {
    params.set("b", String(opts.branchCode));
  }
  const qs = params.toString();

  return `${base}/01/${opts.gtin}${qs ? `?${qs}` : ""}`;
}

/** Validates a `/01/{segment}` path value is a plausible 14-digit GTIN. */
export function parseGtinPathSegment(segment: string): string | null {
  return GTIN_PATH_RE.test(segment) ? segment : null;
}
