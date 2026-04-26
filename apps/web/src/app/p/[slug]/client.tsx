"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { CanvasDocument, ContentLocale } from "@productix/types";
import { CONTENT_LOCALE_META, CONTENT_LOCALES } from "@productix/types";
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
  const searchParams = useSearchParams();
  const doc = page.content as unknown as CanvasDocument;

  // Read ?lang= from URL
  const langParam = searchParams.get("lang");
  const initialLocale: ContentLocale = (langParam === "si" || langParam === "ta") ? langParam : "en";
  const [contentLocale, setContentLocale] = useState<ContentLocale>(initialLocale);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Always show the language switcher with all supported locales
  const showLanguageSwitcher = true;

  // Check if we have valid canvas content
  const hasCanvasContent = doc && doc.version && doc.artboards && doc.artboards.length > 0;

  // Close dropdown on outside click
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
      setLangDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (langDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [langDropdownOpen, handleOutsideClick]);

  const currentMeta = CONTENT_LOCALE_META[contentLocale];

  if (!hasCanvasContent) {
    return <FallbackView page={page} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff", position: "relative" }}>
      {/* Language dropdown — top right floating */}
      {showLanguageSwitcher && (
        <div
          ref={langDropdownRef}
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 9999,
          }}
        >
          {/* Trigger button */}
          <button
            type="button"
            onClick={() => setLangDropdownOpen((prev) => !prev)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 12,
              border: "none",
              background: "#fff",
              color: "#374151",
              fontSize: 15,
              fontWeight: 500,
              fontFamily: "'Inter', -apple-system, sans-serif",
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 15 }}>{currentMeta.label}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: "transform 0.2s ease",
                transform: langDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                color: "#9ca3af",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {langDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
                padding: "6px 0",
                minWidth: 180,
                animation: "langDropdownIn 0.15s ease-out",
              }}
            >
              {CONTENT_LOCALES.map((loc) => {
                const meta = CONTENT_LOCALE_META[loc];
                const isActive = loc === contentLocale;
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setContentLocale(loc);
                      setLangDropdownOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "10px 16px",
                      border: "none",
                      background: isActive ? "#f0f9ff" : "transparent",
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                      fontSize: 14,
                      fontFamily: "'Inter', -apple-system, sans-serif",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{meta.flag}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? "#0369a1" : "#374151",
                        }}
                      >
                        {meta.nativeLabel}
                      </div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
                        {meta.label}
                      </div>
                    </div>
                    {isActive && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Inject dropdown animation keyframes */}
      {showLanguageSwitcher && (
        <style>{`
          @keyframes langDropdownIn {
            from { opacity: 0; transform: translateY(-6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      )}

      {/* Rendered page content */}
      <PublicRenderer document={doc} contentLocale={contentLocale} />

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
