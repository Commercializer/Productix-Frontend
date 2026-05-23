/* ─────────────────────────────────────────────
 * GET /api/feedback/download — Authenticated
 * download proxy for feedback image attachments.
 *
 * Browsers ignore the `download` attribute on cross-
 * origin links, so the dashboard hits this endpoint
 * which fetches the R2 object server-side and returns
 * it with a forced Content-Disposition: attachment
 * header carrying a friendly filename.
 *
 * Only R2 public URLs are accepted, so the route
 * cannot be used as an open proxy.
 * ──────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isR2Url } from "@/lib/r2";

function sanitizeFilename(name: string): string {
  // Strip path separators and characters that browsers/OS dislike in filenames,
  // collapse whitespace, and trim. Keep dots so the extension survives.
  return name
    .replace(/[\\/]/g, "-")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200) || "download";
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = request.nextUrl.searchParams.get("url");
  const filenameParam = request.nextUrl.searchParams.get("filename");
  if (!url || !isR2Url(url)) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(url);
  } catch {
    return NextResponse.json({ error: "Failed to fetch upstream" }, { status: 502 });
  }
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Upstream returned an error" }, { status: 502 });
  }

  // Derive an extension from the upstream URL so the filename keeps the right suffix
  // even when the caller omits one.
  const extMatch = url.match(/\.([a-zA-Z0-9]{1,5})(?:\?.*)?$/);
  const ext = extMatch?.[1]?.toLowerCase() ?? "bin";
  const base = sanitizeFilename(filenameParam || "feedback-image");
  const filename = /\.[a-zA-Z0-9]{1,5}$/.test(base) ? base : `${base}.${ext}`;

  const headers = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) headers.set("Content-Type", upstreamType);
  const upstreamLength = upstream.headers.get("content-length");
  if (upstreamLength) headers.set("Content-Length", upstreamLength);
  headers.set("Cache-Control", "private, max-age=0, no-store");
  headers.set(
    "Content-Disposition",
    `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
  );

  return new NextResponse(upstream.body, { status: 200, headers });
}
