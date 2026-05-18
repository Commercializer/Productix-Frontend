/* ─────────────────────────────────────────────
 * GET /api/media/svg-recolor?url=...&color=...
 *
 * Server-side SVG color override. Fetches the SVG
 * from R2 (or accepts a data URL), rewrites every
 * non-`none` fill/stroke to the requested color,
 * and returns the modified SVG with permissive
 * caching. Avoids the browser CORS issues that
 * block client-side fetch / mask-image on R2 URLs.
 * ──────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { isR2Url } from "@/lib/r2";

const HEX_COLOR_RE = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function recolorSvg(svg: string, color: string): string {
  // Attribute form: fill="..." / stroke="..." (also single-quoted)
  let out = svg.replace(
    /\b(fill|stroke)\s*=\s*("([^"]*)"|'([^']*)')/gi,
    (match, prop: string, _full: string, dq?: string, sq?: string) => {
      const value = (dq ?? sq ?? "").trim().toLowerCase();
      if (value === "none" || value === "transparent" || value === "" || value.startsWith("url(")) {
        return match;
      }
      return `${prop}="${color}"`;
    }
  );

  // Inline-style form: style="fill: rgb(255, 0, 0); stroke: red"
  out = out.replace(
    /\b(fill|stroke)\s*:\s*([^;}"']+)/gi,
    (match, prop: string, value: string) => {
      const trimmed = value.trim().toLowerCase();
      if (trimmed === "none" || trimmed === "transparent" || trimmed.startsWith("url(")) {
        return match;
      }
      return `${prop}: ${color}`;
    }
  );

  // Ensure the root <svg> carries a fill so elements with no fill attribute
  // (which inherit) also pick up the color.
  if (!/<svg\b[^>]*\bfill\s*=/.test(out)) {
    out = out.replace(/<svg\b/i, `<svg fill="${color}"`);
  }

  return out;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const color = request.nextUrl.searchParams.get("color");

  if (!url || !color) {
    return NextResponse.json({ error: "missing url or color" }, { status: 400 });
  }
  if (!HEX_COLOR_RE.test(color)) {
    return NextResponse.json({ error: "invalid color" }, { status: 400 });
  }

  // SSRF guard: only allow our R2 bucket or inline data: SVGs.
  const isAllowed = isR2Url(url) || url.startsWith("data:image/svg+xml");
  if (!isAllowed) {
    return NextResponse.json({ error: "url not allowed" }, { status: 400 });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "fetch failed" }, { status: 502 });
    }
    const text = await res.text();
    const recolored = recolorSvg(text, color);

    return new NextResponse(recolored, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (err) {
    console.error("[media/svg-recolor] failed:", err);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
