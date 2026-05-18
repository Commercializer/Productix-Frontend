import { cache } from "react";
import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { getPublicPageByHandleAction } from "@/lib/dashboard/actions";
import { PublicPageClient } from "./client";

// ═══════════════════════════════════════════════════════════════
// Dynamic SEO Metadata — unique per product page
// ═══════════════════════════════════════════════════════════════

interface PageProps {
  // [slug] is the route segment but accepts either a slug or an 8-char shortCode.
  params: Promise<{ slug: string }>;
}

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

  const title = `${page.productName}${page.tagline ? ` — ${page.tagline}` : ""} | ${page.company.name}`;
  const description =
    page.metaDescription ||
    page.description ||
    `${page.productName} by ${page.company.name}`;

  const iconUrl = page.logoUrl || page.brand?.logoUrl || page.company.logoUrl || undefined;
  // Canonical/og URL follows the same rule as the route: slug when visible, shortCode otherwise.
  const canonicalPath = `/p/${page.slugVisible ? page.slug : page.shortCode}`;

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

export default async function PublicPage({ params }: PageProps) {
  const { slug: handle } = await params;
  const page = await getPage(handle);

  if (!page) {
    return <NotFoundView />;
  }

  // If the visitor arrived via the 8-char short code and the product opted to
  // show pretty URLs, swap them to the slug. When slugVisible is off the
  // short-code URL is rendered in place so the visitor never sees the slug.
  if (page.slugVisible && handle === page.shortCode && page.slug !== handle) {
    redirect(`/p/${page.slug}`);
  }

  return <PublicPageClient page={page} />;
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
