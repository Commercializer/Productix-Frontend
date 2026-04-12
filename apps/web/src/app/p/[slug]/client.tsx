"use client";

import React from "react";
import type { CanvasDocument } from "@productix/types";
import { PublicRenderer } from "@productix/editor";

interface PublicPageData {
  id: string;
  slug: string;
  productName: string;
  tagline: string | null;
  description: string;
  logoUrl: string | null;
  themeColor: string;
  content: unknown;
  metaDescription: string | null;
  ogImageUrl: string | null;
  publishedAt: string | null;
  company: {
    name: string;
    logoUrl: string | null;
    businessUsername: string;
  };
  brand: {
    name: string;
    logoUrl: string | null;
    themeColor: string | null;
  } | null;
}

interface PublicPageClientProps {
  page: PublicPageData;
}

export function PublicPageClient({ page }: PublicPageClientProps) {
  const doc = page.content as unknown as CanvasDocument;

  // Check if we have valid canvas content
  const hasCanvasContent = doc && doc.version && doc.artboards && doc.artboards.length > 0;

  if (!hasCanvasContent) {
    return <FallbackView page={page} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Rendered page content */}
      <PublicRenderer document={doc} />

      {/* Powered-by footer badge */}
      <footer
        style={{
          padding: "16px 0 24px",
          textAlign: "center",
          borderTop: "1px solid #f1f5f9",
          background: "#fafbfc",
        }}
      >
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "#94a3b8",
            textDecoration: "none",
            fontFamily: "'Inter', -apple-system, sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 16,
              height: 16,
              borderRadius: 4,
              background: "#0284c7",
              color: "white",
              fontSize: 8,
              fontWeight: 700,
            }}
          >
            PX
          </span>
          Powered by Productix
        </a>
      </footer>
    </div>
  );
}

/**
 * Fallback view when no canvas content is available.
 * Shows basic product info from the database fields.
 */
function FallbackView({ page }: { page: PublicPageData }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(180deg, ${page.themeColor}08 0%, ${page.themeColor}03 100%)`,
        fontFamily: "'Inter', -apple-system, sans-serif",
        padding: "2rem",
      }}
    >
      {page.logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={page.logoUrl}
          alt={page.productName}
          style={{
            width: 120,
            height: 120,
            objectFit: "contain",
            borderRadius: 20,
            marginBottom: 24,
          }}
        />
      )}
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#0f172a",
          margin: "0 0 8px",
          textAlign: "center",
        }}
      >
        {page.productName}
      </h1>
      {page.tagline && (
        <p
          style={{
            fontSize: 16,
            color: "#64748b",
            margin: "0 0 16px",
            textAlign: "center",
          }}
        >
          {page.tagline}
        </p>
      )}
      <p
        style={{
          fontSize: 14,
          color: "#94a3b8",
          margin: 0,
          textAlign: "center",
          maxWidth: 500,
          lineHeight: 1.6,
        }}
      >
        {page.description}
      </p>
      <div
        style={{
          marginTop: 32,
          fontSize: 12,
          color: "#cbd5e1",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        by {page.company.name}
      </div>
    </div>
  );
}
