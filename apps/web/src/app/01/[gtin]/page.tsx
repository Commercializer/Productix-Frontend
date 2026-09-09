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
import {
  getPublicPageByGtinAction,
  getPublicDppByGtinAction,
  getPublicDppDisplayModeAction,
  getPublicDppVersionsAction,
  getPublicDppVersionContentAction,
} from "@/lib/dashboard/actions";
import {
  buildPublicMetadataFromPage,
  renderResolvedPage,
  resolveThemeColor,
  serializeSearch,
  NotFoundView,
} from "../../p/[slug]/page";
import { parseGtinPathSegment } from "@/lib/gs1/digital-link";
import { normalizeDppLang } from "@/lib/dpp/i18n/languages";
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

const getDppVersionsByGtin = cache(async (rawGtin: string) => {
  const gtin = parseGtinPathSegment(rawGtin);
  if (!gtin) return { visible: false, versions: [] };
  return getPublicDppVersionsAction(gtin);
});

// Gallery photos come straight off R2 at whatever resolution the user
// uploaded (often several MB) - link-preview crawlers like WhatsApp's are
// far stricter than a browser about og:image size and silently drop the
// preview if fetching/decoding it is too slow. Route it through Next's own
// image optimizer (capped to a default deviceSize, see next.config.ts) so
// the crawler fetches a compressed copy instead of the original.
function resolveOgImageUrl(rawUrl: string): string {
  const base = (process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
  return `${base}/_next/image?url=${encodeURIComponent(rawUrl)}&w=1200&q=75`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gtin } = await params;
  const page = await getPageByGtin(gtin);
  if (page) return buildPublicMetadataFromPage(page, "01", gtin);

  // No published showcase - fall back to the DPP's own identity so a
  // DPP-only product (see the default export below) still gets a real title
  // instead of "Page Not Found".
  const dpp = await getDppByGtin(gtin);
  if (dpp) {
    const title = `${dpp.productName} | ${dpp.company.name}`;
    const description = `Digital Product Passport for ${dpp.productName} by ${dpp.company.name}.`;
    // First gallery photo (image-only, see getPublicDppByGtinAction) makes
    // the best share preview; fall back to the resolved brand/company logo
    // so a share link still gets *an* image even before photos are uploaded.
    const rawOgImage = dpp.gallery[0]?.url || dpp.logoUrl || undefined;
    const ogImage = rawOgImage ? resolveOgImageUrl(rawOgImage) : undefined;

    return {
      title,
      description,
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",
        title: dpp.productName,
        description,
        siteName: dpp.company.name,
        // No fixed width/height here - the optimizer preserves the source's
        // aspect ratio at w=1200, so a declared 630 height would often be
        // wrong and some crawlers treat a mismatch as a signal to skip the
        // image rather than just resample it.
        ...(ogImage && { images: [{ url: ogImage }] }),
      },
      twitter: {
        card: ogImage ? "summary_large_image" : "summary",
        title: dpp.productName,
        description,
        ...(ogImage && { images: [ogImage] }),
      },
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
  // Selected UI language for the DPP passport's fixed copy (labels, titles) -
  // see DppLanguagePicker/translateDpp. Falls back to English for anything
  // not in DPP_LANGUAGES. Never affects the actual product/answer data.
  const lang = normalizeDppLang(typeof sp.lang === "string" ? sp.lang : undefined);

  const [page, dpp, mode, dppVersions] = await Promise.all([
    getPageByGtin(rawGtin),
    getDppByGtin(rawGtin),
    getDisplayModeByGtin(rawGtin),
    getDppVersionsByGtin(rawGtin),
  ]);

  // The saved per-product setting (see DppDisplayMode) - GS1/DPP are hard
  // restrictions to that one side even if the other side has content; BOTH
  // (the default) degrades gracefully to whichever side actually exists.
  const wantGs1 = mode !== "DPP";
  const wantDpp = mode !== "GS1";
  const showGs1 = wantGs1 && !!page;
  const showDpp = wantDpp && !!dpp;

  if (!showGs1 && !showDpp) return <NotFoundView />;

  // "?version=N" - view a historical DPP snapshot in place, per the public
  // version-history requirement. Falls back to the live data if the version
  // doesn't exist or the company has version history turned off.
  const versionParam = typeof sp.version === "string" ? Number(sp.version) : null;
  const viewingVersion =
    showDpp && versionParam && Number.isInteger(versionParam) && dppVersions.visible ? versionParam : null;
  const dppData =
    viewingVersion != null ? (await getPublicDppVersionContentAction(rawGtin, viewingVersion)) ?? dpp : dpp;
  const dppVersionsList = dppVersions.visible ? dppVersions.versions : undefined;

  if (showDpp && !showGs1) {
    return <DppPassportView data={dppData!} batch={batch} versions={dppVersionsList} viewingVersion={viewingVersion} lang={lang} />;
  }

  const gs1Content = await renderResolvedPage(page, "GS1", "01", channel, serializeSearch(sp), true);
  if (!showDpp) return gs1Content;

  return (
    <GtinModeSwitcher
      gs1={gs1Content}
      dpp={<DppPassportView data={dppData!} batch={batch} versions={dppVersionsList} viewingVersion={viewingVersion} lang={lang} />}
      defaultMode="gs1"
    />
  );
}
