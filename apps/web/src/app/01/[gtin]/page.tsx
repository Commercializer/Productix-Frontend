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
import { getPublicPageByGtinAction, getPublicDppByGtinAction, getPublicDppDisplayModeAction } from "@/lib/dashboard/actions";
import {
  buildPublicMetadataFromPage,
  renderResolvedPage,
  resolveThemeColor,
  serializeSearch,
  NotFoundView,
} from "../../p/[slug]/page";
import { parseGtinPathSegment } from "@/lib/gs1/digital-link";
import { DppPassportView } from "./dpp-view";
import { GtinModeSwitcher } from "./gtin-mode-switcher";

interface PageProps {
  params: Promise<{ gtin: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Dedupe the DB calls across generateMetadata, generateViewport, and the page.
const getPageByGtin = cache(async (rawGtin: string) => {
  const gtin = parseGtinPathSegment(rawGtin);
  if (!gtin) return null;
  return getPublicPageByGtinAction(gtin);
});

const getDppByGtin = cache(async (rawGtin: string) => {
  const gtin = parseGtinPathSegment(rawGtin);
  if (!gtin) return null;
  return getPublicDppByGtinAction(gtin);
});

const getDisplayModeByGtin = cache(async (rawGtin: string) => {
  const gtin = parseGtinPathSegment(rawGtin);
  if (!gtin) return null;
  return getPublicDppDisplayModeAction(gtin);
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gtin } = await params;
  const page = await getPageByGtin(gtin);
  if (page) return buildPublicMetadataFromPage(page, "01", gtin);

  // No published showcase - fall back to the DPP's own identity so a
  // DPP-only product (see the default export below) still gets a real title
  // instead of "Page Not Found".
  const dpp = await getDppByGtin(gtin);
  if (dpp) {
    return {
      title: `${dpp.productName} | ${dpp.company.name}`,
      description: `Digital Product Passport for ${dpp.productName} by ${dpp.company.name}.`,
      robots: { index: true, follow: true },
    };
  }

  return buildPublicMetadataFromPage(null, "01", gtin);
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
  // GS1 Digital Link AI 10 (batch/lot), passed straight through for display -
  // it isn't a stored field, just context the passport shows back to the scanner.
  const batch = typeof sp.batch === "string" ? sp.batch : null;

  const [page, dpp, mode] = await Promise.all([
    getPageByGtin(rawGtin),
    getDppByGtin(rawGtin),
    getDisplayModeByGtin(rawGtin),
  ]);

  // The saved per-product setting (see DppDisplayMode) - GS1/DPP are hard
  // restrictions to that one side even if the other side has content; BOTH
  // (the default) degrades gracefully to whichever side actually exists.
  const wantGs1 = mode !== "DPP";
  const wantDpp = mode !== "GS1";
  const showGs1 = wantGs1 && !!page;
  const showDpp = wantDpp && !!dpp;

  if (!showGs1 && !showDpp) return <NotFoundView />;

  if (showDpp && !showGs1) return <DppPassportView data={dpp!} batch={batch} />;

  const gs1Content = await renderResolvedPage(page, "GS1", "01", channel, serializeSearch(sp), true);
  if (!showDpp) return gs1Content;

  return <GtinModeSwitcher gs1={gs1Content} dpp={<DppPassportView data={dpp!} batch={batch} />} defaultMode="gs1" />;
}
