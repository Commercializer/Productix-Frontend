// ─────────────────────────────────────────────────────────────
// Public page-view tracking - server-side, dedup-by-DB, no Redis.
//
// One row per (page, visitor, UTC day). A "visitor" is sha256 of
// ip + user-agent + secret salt + day, so the same person refreshing
// can never inflate counts and no raw IP is persisted. Different
// people behind the same NAT collide (acceptable tradeoff for not
// setting a tracking cookie).
//
// IP + geo are read from edge-injected headers (Vercel / Cloudflare).
// Never trust an x-forwarded-for that doesn't come through your proxy.
//
// Two-phase API:
//   1. `readViewContext()` runs inside the request - `headers()` is request-
//      scoped so it MUST be called before the response is sent.
//   2. `trackPageView(...)` runs inside `after()` - does the hashing and
//      DB insert. Cannot touch `headers()` because the request is gone.
// ─────────────────────────────────────────────────────────────

import { headers } from "next/headers";
import { createHash } from "crypto";
import { prisma } from "@productix/db";
import type { DeviceType, QrScanType } from "@productix/db";

const HASH_SALT =
  process.env.ANALYTICS_HASH_SALT ?? "productix-default-salt-change-in-env";

export interface ViewContext {
  ip: string;
  userAgent: string;
  referrer: string | null;
  language: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
}

/**
 * MUST be called inside the request handler (before `after()`). Extracts the
 * request-scoped header data into a plain object that's safe to pass into
 * `after()` callbacks.
 */
export async function readViewContext(): Promise<ViewContext> {
  const h = await headers();
  const rawCity = h.get("x-vercel-ip-city") ?? h.get("cf-ipcity");
  return {
    ip: pickIp(h),
    userAgent: h.get("user-agent") ?? "",
    referrer: truncate(h.get("referer"), 500),
    language: h.get("accept-language")?.split(",")[0]?.trim().slice(0, 10) ?? null,
    country: h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry") ?? null,
    region: h.get("x-vercel-ip-country-region") ?? h.get("cf-region-code") ?? null,
    city: rawCity ? safeDecode(rawCity) : null,
  };
}

interface TrackArgs {
  productProfileId: string;
  productId: string;
  companyId: string;
  context: ViewContext;
  qrScanType?: QrScanType;
}

export async function trackPageView({
  productProfileId,
  productId,
  companyId,
  context,
  qrScanType,
}: TrackArgs): Promise<void> {
  try {
    const { ip, userAgent, referrer, language, country, region, city } = context;

    // Skip obvious bots - they shouldn't count as views.
    if (isLikelyBot(userAgent)) return;

    const dayBucket = new Date();
    dayBucket.setUTCHours(0, 0, 0, 0);
    const dayKey = dayBucket.toISOString().slice(0, 10);

    const visitorHash = createHash("sha256")
      .update(`${ip}|${userAgent}|${HASH_SALT}|${dayKey}`)
      .digest("hex");

    const { deviceType, browser, os } = parseUserAgent(userAgent);

    // createMany + skipDuplicates compiles to INSERT ... ON CONFLICT DO NOTHING,
    // so the dedup unique constraint silently absorbs refresh-spam without an
    // exception round-trip. Cleaner than raw SQL and avoids null-enum cast bugs.
    await prisma.pageView.createMany({
      data: [
        {
          productProfileId,
          productId,
          companyId,
          visitorHash,
          dayBucket,
          country,
          region,
          city,
          deviceType,
          browser,
          os,
          referrer,
          language,
          qrScanType,
        },
      ],
      skipDuplicates: true,
    });
  } catch (err) {
    // Analytics must never break the page render.
    console.error("[trackPageView] failed", err);
  }
}

// ─────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────

function pickIp(h: Headers): string {
  // Trust the first hop only - your edge sets this. Anything further left
  // in x-forwarded-for is attacker-controllable.
  const fwd = h.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return h.get("x-real-ip") ?? "0.0.0.0";
}

function safeDecode(value: string): string | null {
  try {
    return decodeURIComponent(value).slice(0, 100);
  } catch {
    return value.slice(0, 100);
  }
}

function truncate(value: string | null | undefined, max: number): string | null {
  if (!value) return null;
  return value.length > max ? value.slice(0, max) : value;
}

function isLikelyBot(ua: string): boolean {
  if (!ua) return true;
  return /bot|crawl|spider|slurp|facebookexternalhit|preview|fetcher|monitor|curl|wget|axios|python-requests/i.test(
    ua,
  );
}

interface UaResult {
  deviceType: DeviceType | null;
  browser: string | null;
  os: string | null;
}

// Minimal UA parser - covers the buckets we actually store. Skip ua-parser-js
// to avoid the dependency; if we ever need fine-grained UA data, swap this out.
function parseUserAgent(ua: string): UaResult {
  if (!ua) return { deviceType: null, browser: null, os: null };
  const lower = ua.toLowerCase();

  const deviceType: DeviceType | null = /ipad|tablet|playbook|silk/.test(lower)
    ? "TABLET"
    : /mobi|iphone|android.*mobile|phone|ipod/.test(lower)
      ? "MOBILE"
      : /windows|mac os x|linux|x11|cros/.test(lower)
        ? "DESKTOP"
        : null;

  const browser = /edg\//.test(lower)
    ? "Edge"
    : /opr\/|opera/.test(lower)
      ? "Opera"
      : /chrome\//.test(lower) && !/chromium/.test(lower)
        ? "Chrome"
        : /firefox\//.test(lower)
          ? "Firefox"
          : /safari\//.test(lower)
            ? "Safari"
            : null;

  const os = /windows nt/.test(lower)
    ? "Windows"
    : /android/.test(lower)
      ? "Android"
      : /iphone|ipad|ipod/.test(lower)
        ? "iOS"
        : /mac os x/.test(lower)
          ? "macOS"
          : /cros/.test(lower)
            ? "ChromeOS"
            : /linux/.test(lower)
              ? "Linux"
              : null;

  return { deviceType, browser, os };
}
