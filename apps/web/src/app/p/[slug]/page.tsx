import { cache } from "react";
import { after } from "next/server";
import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import type { QrScanType } from "@productix/db";
import { getPublicPageByHandleAction, isPagePinUnlockedAction } from "@/lib/dashboard/actions";
import { readViewContext, trackPageView } from "@/lib/analytics/track-page-view";
import { PublicPageClient } from "./client";
import { PinGate } from "./pin-gate";

// ═══════════════════════════════════════════════════════════════
// Dynamic SEO Metadata - unique per product page
// ═══════════════════════════════════════════════════════════════

interface PageProps {
  // [slug] is the route segment but accepts either a slug or an 8-char shortCode.
  params: Promise<{ slug: string }>;
}

// Profiles are seeded with a UUID slug until the user picks a pretty one; treat
// that placeholder as "no slug set" so we never redirect visitors to it.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isCustomSlug = (slug: string) => !UUID_RE.test(slug);

// Dedupe the DB call across generateMetadata, generateViewport, and the page.
const getPage = cache(async (handle: string) => {
  const result = await getPublicPageByHandleAction(handle);
  return result?.page ?? null;
});

/**
 * Resolve the browser chrome color for this page.
 *
 * Priority: first artboard's background → stored page themeColor → brand themeColor → default.
 * The artboard wins because that is what actually paints behind the rendered design,
 * and we want the browser address bar / status bar to visually merge with the page.
 */
function resolveThemeColor(page: {
  content?: unknown;
  themeColor?: string | null;
  brand?: { themeColor: string | null } | null;
}) {
  const artboardBg = (() => {
    const doc = page.content as { artboards?: Array<{ backgroundColor?: string | null }> } | null;
    return doc?.artboards?.[0]?.backgroundColor || null;
  })();
  return artboardBg || page.themeColor || page.brand?.themeColor || "#0284c7";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    return {
      title: "Page Not Found | Productix",
      description: "The requested product page could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${page.productName}${page.tagline ? ` - ${page.tagline}` : ""} | ${page.company.name}`;
  const description =
    page.metaDescription ||
    page.description ||
    `${page.productName} by ${page.company.name}`;

  const iconUrl = page.logoUrl || page.brand?.logoUrl || page.company.logoUrl || undefined;
  // Canonical/og URL follows the same rule as the route: slug when visible AND
  // the user has set a real slug; otherwise fall back to the shortCode so we
  // never canonicalize to the placeholder UUID.
  const canonicalPath = `/p/${page.slugVisible && isCustomSlug(page.slug) ? page.slug : page.shortCode}`;

  return {
    title,
    description,
    applicationName: page.company.name,
    authors: [{ name: page.company.name }],
    openGraph: {
      type: "website",
      title: page.productName,
      description,
      siteName: page.company.name,
      ...(page.ogImageUrl && { images: [{ url: page.ogImageUrl, width: 1200, height: 630 }] }),
      url: canonicalPath,
    },
    twitter: {
      card: page.ogImageUrl ? "summary_large_image" : "summary",
      title: page.productName,
      description,
      ...(page.ogImageUrl && { images: [page.ogImageUrl] }),
    },
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: iconUrl
      ? {
          icon: [{ url: iconUrl }],
          shortcut: [{ url: iconUrl }],
          apple: [{ url: iconUrl }],
        }
      : undefined,
    appleWebApp: {
      capable: true,
      title: page.productName,
      statusBarStyle: "black-translucent",
    },
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    other: {
      "msapplication-TileColor": resolveThemeColor(page),
      ...(iconUrl && { "msapplication-TileImage": iconUrl }),
    },
  };
}

export async function generateViewport({ params }: PageProps): Promise<Viewport> {
  const { slug } = await params;
  const page = await getPage(slug);
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

// ═══════════════════════════════════════════════════════════════
// Page Component (Server Component)
// ═══════════════════════════════════════════════════════════════

export async function renderPublicPage(handle: string, qrScanType: QrScanType, urlPrefix: "p" | "l" | "s") {
  const page = await getPage(handle);

  if (!page) {
    return <NotFoundView />;
  }

  // Record the view after the response is sent so we never delay render.
  // headers() must be read here (request scope); the after() callback only
  // touches the plain context object. Dedup is enforced by a unique
  // (page, visitor, day) constraint in the DB, so refresh-spam can't inflate.
  // Tracking is scheduled before any redirect so external-redirect scans
  // still show up in analytics.
  const viewContext = await readViewContext();
  after(() =>
    trackPageView({
      productProfileId: page.id,
      productId: page.productId,
      companyId: page.companyId,
      context: viewContext,
      qrScanType,
    }),
  );

  // External redirect takes precedence - when set, scans bypass the showcase.
  if (page.redirectEnabled && page.redirectUrl) {
    redirect(page.redirectUrl);
  }

  // PIN gate: when the page is locked and the visitor hasn't already entered
  // the PIN (no valid cookie), show the prompt instead of the showcase. The
  // page content is never sent to the client until this passes.
  if (page.pinEnabled) {
    const unlocked = await isPagePinUnlockedAction(page.id);
    if (!unlocked) {
      return (
        <PinGate
          profileId={page.id}
          productName={page.productName}
          companyName={page.company.name}
          logoUrl={page.logoUrl || page.brand?.logoUrl || page.company.logoUrl}
          themeColor={resolveThemeColor(page)}
        />
      );
    }
  }

  // If the visitor arrived via the 8-char short code and the product opted to
  // show pretty URLs, swap them to the slug. Skip when the slug is still the
  // placeholder UUID - that isn't a real URL, so we render the shortCode in
  // place instead of redirecting to /p/<uuid>.
  if (
    page.slugVisible &&
    handle === page.shortCode &&
    page.slug !== handle &&
    isCustomSlug(page.slug)
  ) {
    redirect(`/${urlPrefix}/${page.slug}`);
  }

  return <PublicPageClient page={page} />;
}

export default async function PublicPage({ params }: PageProps) {
  const { slug: handle } = await params;
  return renderPublicPage(handle, "ON_PACK", "p");
}

// ═══════════════════════════════════════════════════════════════
// 404 View
// ═══════════════════════════════════════════════════════════════

function NotFoundView() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
        fontFamily: "var(--font-sans)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: "linear-gradient(135deg, #e2e8f0, #cbd5e1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          marginBottom: 24,
        }}
      >
        📄
      </div>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#0f172a",
          margin: "0 0 8px 0",
        }}
      >
        Page Not Found
      </h1>
      <p
        style={{
          fontSize: 15,
          color: "#64748b",
          margin: 0,
          maxWidth: 400,
          lineHeight: 1.6,
        }}
      >
        This product page doesn&apos;t exist or hasn&apos;t been published yet.
        Check the URL and try again.
      </p>
      <a
        href="/"
        style={{
          marginTop: 32,
          padding: "10px 24px",
          borderRadius: 10,
          background: "#0f172a",
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          transition: "opacity 0.2s",
        }}
      >
        Go to Homepage
      </a>
    </div>
  );
}
