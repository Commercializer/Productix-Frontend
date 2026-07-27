// GS1 Digital Link resolver route - /01/{gtin} (AI 01 = GTIN, per the GS1
// Digital Link Standard's primary-identifier path syntax). Renders the same
// showcase as /p/<code>, but keyed on the product's GTIN instead of its
// shortCode, and tagged as a GS1 scan in analytics. The channel a scan came
// through (?ch=) is stored the same way a CUSTOM link type's prefix is.
//
// Unlike /p/<code>, this route never redirects to the pretty slug URL even
// when one exists (see renderResolvedPage's disableSlugRedirect) - the GTIN
// URL is meant to stay the stable, machine-addressable surface for GS1-aware
// consumers (retailer apps, future resolvers), not just a human landing page.
import { cache } from "react";
import type { Metadata, Viewport } from "next";
import { getPublicPageByGtinAction } from "@/lib/dashboard/actions";
import {
  buildPublicMetadataFromPage,
  renderResolvedPage,
  resolveThemeColor,
  serializeSearch,
  NotFoundView,
} from "../../p/[slug]/page";
import { parseGtinPathSegment } from "@/lib/gs1/digital-link";

interface PageProps {
  params: Promise<{ gtin: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Dedupe the DB call across generateMetadata, generateViewport, and the page.
const getPageByGtin = cache(async (rawGtin: string) => {
  const gtin = parseGtinPathSegment(rawGtin);
  if (!gtin) return null;
  return getPublicPageByGtinAction(gtin);
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gtin } = await params;
  const page = await getPageByGtin(gtin);
  return buildPublicMetadataFromPage(page, "01", gtin);
}

// Can't re-export generateViewport from p/[slug]/page.tsx unchanged (that one
// destructures params.slug) - this route's param key is `gtin`.
export async function generateViewport({ params }: PageProps): Promise<Viewport> {
  const { gtin } = await params;
  const page = await getPageByGtin(gtin);
  const themeColor = page ? resolveThemeColor(page) : "#0284c7";

  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: themeColor },
      { media: "(prefers-color-scheme: dark)", color: themeColor },
    ],
    colorScheme: "light",
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  };
}

export default async function GtinDigitalLinkPage({ params, searchParams }: PageProps) {
  const { gtin: rawGtin } = await params;
  const gtin = parseGtinPathSegment(rawGtin);
  if (!gtin) return <NotFoundView />;

  const sp = await searchParams;
  const channel = typeof sp.ch === "string" ? sp.ch : null;

  const page = await getPageByGtin(rawGtin);
  return renderResolvedPage(page, "GS1", "01", channel, serializeSearch(sp), true);
}
