import type { Metadata } from "next";
import { getPublicPageBySlugAction } from "@/lib/dashboard/actions";
import { PublicPageClient } from "./client";

// ═══════════════════════════════════════════════════════════════
// Dynamic SEO Metadata — unique per product page
// ═══════════════════════════════════════════════════════════════

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublicPageBySlugAction(slug);

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

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title: page.productName,
      description,
      siteName: page.company.name,
      ...(page.ogImageUrl && { images: [{ url: page.ogImageUrl, width: 1200, height: 630 }] }),
      url: `/p/${page.slug}`,
    },
    twitter: {
      card: page.ogImageUrl ? "summary_large_image" : "summary",
      title: page.productName,
      description,
      ...(page.ogImageUrl && { images: [page.ogImageUrl] }),
    },
    alternates: {
      canonical: `/p/${page.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "theme-color": page.themeColor || "#000000",
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// Page Component (Server Component)
// ═══════════════════════════════════════════════════════════════

export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPublicPageBySlugAction(slug);

  if (!page) {
    return <NotFoundView />;
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
        fontFamily: "'Inter', -apple-system, sans-serif",
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
