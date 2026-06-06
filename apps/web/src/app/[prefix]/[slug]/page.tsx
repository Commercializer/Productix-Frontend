// Custom QR link types resolve at the top level as /<prefix>/<code>, matching
// the built-in surfaces (/p, /l, /s). Company owners create prefixes in
// dashboard settings; reserved words (p, l, s, dashboard, admin, api, …) are
// blocked there so a custom prefix can never collide with a real route. Next.js
// resolves static routes before this dynamic one, so the built-ins still win.
// The page renders the same showcase as /p/<code> but is tagged in analytics as
// a CUSTOM scan carrying the <prefix>, so dashboards can split custom types out.
import type { Metadata } from "next";
import { buildPublicMetadata, renderPublicPage } from "../../p/[slug]/page";

// generateViewport only reads params.slug, so the built-in one works as-is here.
export { generateViewport } from "../../p/[slug]/page";

interface PageProps {
  params: Promise<{ prefix: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Serialize resolved searchParams back into a `?a=b` query string (or ""). */
function serializeSearch(sp: Record<string, string | string[] | undefined>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (Array.isArray(value)) value.forEach((v) => qs.append(key, v));
    else if (value != null) qs.set(key, value);
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { prefix, slug } = await params;
  return buildPublicMetadata(slug, prefix.toLowerCase());
}

export default async function PublicPageCustom({ params, searchParams }: PageProps) {
  const { prefix, slug } = await params;
  const normalizedPrefix = prefix.toLowerCase();
  return renderPublicPage(slug, "CUSTOM", normalizedPrefix, normalizedPrefix, serializeSearch(await searchParams));
}
