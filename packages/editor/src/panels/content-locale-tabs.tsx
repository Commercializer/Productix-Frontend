/* ─────────────────────────────────────────────
 * Content Language Tabs — Switch between EN / SI / TA
 * content editing in the editor toolbar.
 *
 * This controls which language's text content is
 * being authored. Separate from the UI language.
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { Globe, Check } from "lucide-react";
import { useCanvasStore } from "../engine/canvas-store";
import { CONTENT_LOCALES, CONTENT_LOCALE_META, type ContentLocale } from "@productix/types";

export function ContentLocaleTabs() {
  const contentLocale = useCanvasStore((s) => s.contentLocale);
  const setContentLocale = useCanvasStore((s) => s.setContentLocale);
  const availableLocales = useCanvasStore((s) => s.document.availableLocales);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <Globe size={13} style={{ color: "#9ca3af", marginRight: 2, flexShrink: 0 }} />
      <div style={{
        display: "flex",
        background: "#f3f4f6",
        borderRadius: 8,
        padding: 2,
        gap: 1,
      }}>
        {CONTENT_LOCALES.map((locale) => {
          const meta = CONTENT_LOCALE_META[locale];
          const isActive = locale === contentLocale;
          const hasContent = locale === "en" || (availableLocales?.includes(locale) ?? false);
          return (
            <button
              key={locale}
              type="button"
              onClick={() => setContentLocale(locale)}
              title={`Edit ${meta.label} content${!hasContent ? " (not yet translated)" : ""}`}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                borderRadius: 6,
                border: "none",
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
                background: isActive
                  ? locale === "en"
                    ? "#fff"
                    : locale === "si"
                      ? "#fef3c7"
                      : "#dbeafe"
                  : "transparent",
                color: isActive
                  ? locale === "en"
                    ? "#1e1e2e"
                    : locale === "si"
                      ? "#92400e"
                      : "#1d4ed8"
                  : "#6b7280",
                boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "#e5e7eb";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: 12 }}>{meta.flag}</span>
              <span>{locale.toUpperCase()}</span>
              {/* Indicator dot for locales with content */}
              {hasContent && locale !== "en" && (
                <span style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#22c55e",
                }} />
              )}
            </button>
          );
        })}
      </div>
      {contentLocale !== "en" && (
        <span style={{
          fontSize: 9,
          fontWeight: 600,
          color: contentLocale === "si" ? "#92400e" : "#1d4ed8",
          background: contentLocale === "si" ? "#fef3c7" : "#dbeafe",
          padding: "2px 6px",
          borderRadius: 4,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          whiteSpace: "nowrap",
        }}>
          Editing {CONTENT_LOCALE_META[contentLocale].label}
        </span>
      )}
    </div>
  );
}
