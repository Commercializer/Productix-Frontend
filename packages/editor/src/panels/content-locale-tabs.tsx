/* ─────────────────────────────────────────────
 * Content Language Tabs — Multilingual authoring
 *
 * Shows the currently-active content locales as pill
 * tabs, with a "+" button that opens a searchable
 * popover to add any of ~110 world languages.
 *
 * Separate from the UI language (see language-switcher).
 * ──────────────────────────────────────────── */

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Globe, Plus, Search, X, Check } from "lucide-react";
import { useCanvasStore } from "../engine/canvas-store";
import {
  CONTENT_LOCALES,
  getContentLocaleMeta,
  type ContentLocale,
} from "@productix/types";

const MAX_VISIBLE_TABS = 4;

export function ContentLocaleTabs() {
  const contentLocale = useCanvasStore((s) => s.contentLocale);
  const setContentLocale = useCanvasStore((s) => s.setContentLocale);
  const addAvailableLocale = useCanvasStore((s) => s.addAvailableLocale);
  const removeAvailableLocale = useCanvasStore((s) => s.removeAvailableLocale);
  const availableLocales = useCanvasStore((s) => s.document.availableLocales);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [overflowOpen, setOverflowOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Build active list — always English first
  const active = useMemo<ContentLocale[]>(() => {
    const base: ContentLocale[] = ["en"];
    if (availableLocales) {
      for (const l of availableLocales) {
        if (l !== "en" && !base.includes(l)) base.push(l);
      }
    }
    return base;
  }, [availableLocales]);

  const visible = active.slice(0, MAX_VISIBLE_TABS);
  const hidden = active.slice(MAX_VISIBLE_TABS);

  // Searchable list of all world languages, excluding already-active ones
  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CONTENT_LOCALES.filter((code) => {
      if (active.includes(code)) return false;
      if (!q) return true;
      const meta = getContentLocaleMeta(code);
      return (
        code.toLowerCase().includes(q) ||
        meta.label.toLowerCase().includes(q) ||
        meta.nativeLabel.toLowerCase().includes(q)
      );
    });
  }, [query, active]);

  // Close popovers on outside click / escape
  useEffect(() => {
    if (!pickerOpen && !overflowOpen) return;
    const handle = (e: MouseEvent) => {
      if (pickerOpen && pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
      if (overflowOpen && overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setOverflowOpen(false);
      }
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPickerOpen(false);
        setOverflowOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", key);
    };
  }, [pickerOpen, overflowOpen]);

  useEffect(() => {
    if (pickerOpen) {
      setQuery("");
      setTimeout(() => searchRef.current?.focus(), 30);
    }
  }, [pickerOpen]);

  const handlePick = (code: ContentLocale) => {
    addAvailableLocale(code);
    setPickerOpen(false);
  };

  const handleRemove = (code: ContentLocale) => {
    if (code === "en") return;
    if (!window.confirm(`Remove ${getContentLocaleMeta(code).label} translations from this page?`)) return;
    removeAvailableLocale(code);
  };

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
      <Globe size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: 3,
          height: 36,
          background: "#f1f5f9",
          borderRadius: 11,
          border: "1px solid rgba(15,23,42,0.06)",
        }}
      >
        {visible.map((code) => (
          <LocaleTab
            key={code}
            code={code}
            active={code === contentLocale}
            onClick={() => setContentLocale(code)}
            onRemove={code !== "en" ? () => handleRemove(code) : undefined}
          />
        ))}

        {hidden.length > 0 && (
          <div ref={overflowRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setOverflowOpen((v) => !v)}
              title={`${hidden.length} more language${hidden.length > 1 ? "s" : ""}`}
              style={{
                height: 28,
                padding: "0 10px",
                borderRadius: 8,
                border: "none",
                background: overflowOpen ? "#ffffff" : "transparent",
                color: "#475569",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: "pointer",
                transition: "background 0.15s",
                boxShadow: overflowOpen ? "0 1px 3px rgba(15,23,42,0.08)" : "none",
              }}
            >
              +{hidden.length}
            </button>
            {overflowOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  minWidth: 200,
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid rgba(15,23,42,0.08)",
                  boxShadow: "0 14px 32px rgba(15,23,42,0.12), 0 1px 3px rgba(15,23,42,0.06)",
                  padding: 6,
                  zIndex: 9999,
                }}
              >
                {hidden.map((code) => {
                  const meta = getContentLocaleMeta(code);
                  const isActive = code === contentLocale;
                  return (
                    <div
                      key={code}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 8px",
                        borderRadius: 8,
                        background: isActive ? "#e0f2fe" : "transparent",
                        cursor: "pointer",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = "#f1f5f9";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = "transparent";
                      }}
                      onClick={() => {
                        setContentLocale(code);
                        setOverflowOpen(false);
                      }}
                    >
                      <span style={{ fontSize: 14 }}>{meta.flag}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: isActive ? "#0284c7" : "#0f172a",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {meta.nativeLabel}
                        </div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>
                          {meta.label} · {code.toUpperCase()}
                        </div>
                      </div>
                      {code !== "en" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(code);
                          }}
                          title="Remove"
                          style={{
                            width: 22,
                            height: 22,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "none",
                            background: "transparent",
                            color: "#94a3b8",
                            borderRadius: 6,
                            cursor: "pointer",
                          }}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div ref={pickerRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            title="Add language"
            style={{
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: "none",
              background: pickerOpen ? "linear-gradient(135deg,#f0f9ff,#e0f2fe)" : "transparent",
              color: pickerOpen ? "#0284c7" : "#64748b",
              cursor: "pointer",
              transition: "all 0.15s ease",
              boxShadow: pickerOpen ? "0 1px 3px rgba(2,132,199,0.12)" : "none",
            }}
            onMouseEnter={(e) => {
              if (!pickerOpen) e.currentTarget.style.background = "#ffffff";
            }}
            onMouseLeave={(e) => {
              if (!pickerOpen) e.currentTarget.style.background = "transparent";
            }}
          >
            <Plus size={14} strokeWidth={2.4} />
          </button>

          {pickerOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: "50%",
                transform: "translateX(-50%)",
                width: 320,
                maxWidth: "92vw",
                background: "#fff",
                borderRadius: 16,
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow: "0 18px 40px rgba(15,23,42,0.14), 0 2px 6px rgba(15,23,42,0.06)",
                zIndex: 9999,
                overflow: "hidden",
              }}
            >
              {/* Search header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  borderBottom: "1px solid rgba(15,23,42,0.06)",
                }}
              >
                <Search size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search 110+ languages…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 13,
                    color: "#0f172a",
                    fontFamily: "var(--font-sans)",
                  }}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#94a3b8",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Header pill */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 14px 4px",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#94a3b8",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  All languages
                </span>
                <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>
                  {candidates.length}
                </span>
              </div>

              {/* Language list */}
              <div style={{ maxHeight: 320, overflowY: "auto", padding: "0 6px 8px" }}>
                {candidates.length === 0 ? (
                  <div
                    style={{
                      padding: "24px 16px",
                      textAlign: "center",
                      fontSize: 12,
                      color: "#94a3b8",
                    }}
                  >
                    No languages match &quot;{query}&quot;
                  </div>
                ) : (
                  candidates.map((code) => {
                    const meta = getContentLocaleMeta(code);
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handlePick(code)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: 9,
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "background 0.12s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f1f5f9";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <span style={{ fontSize: 16, flexShrink: 0 }}>{meta.flag}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#0f172a",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {meta.nativeLabel}
                          </div>
                          <div style={{ fontSize: 10.5, color: "#94a3b8" }}>
                            {meta.label}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#94a3b8",
                            letterSpacing: "0.04em",
                            background: "#f1f5f9",
                            padding: "2px 6px",
                            borderRadius: 5,
                          }}
                        >
                          {code.toUpperCase()}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Active locale pill tab ────────────────── */

function LocaleTab({
  code,
  active,
  onClick,
  onRemove,
}: {
  code: ContentLocale;
  active: boolean;
  onClick: () => void;
  onRemove?: () => void;
}) {
  const meta = getContentLocaleMeta(code);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", display: "flex", alignItems: "center" }}
    >
      <button
        type="button"
        onClick={onClick}
        title={`${meta.label} (${code.toUpperCase()})${active ? " — editing" : ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          height: 28,
          padding: onRemove && hovered ? "0 22px 0 10px" : "0 10px",
          borderRadius: 8,
          border: "none",
          background: active ? "#ffffff" : "transparent",
          color: active ? "#0284c7" : "#475569",
          fontSize: 11.5,
          fontWeight: active ? 700 : 600,
          letterSpacing: "0.02em",
          cursor: "pointer",
          transition: "all 0.15s ease",
          boxShadow: active ? "0 1px 3px rgba(2,132,199,0.16), inset 0 1px 0 rgba(255,255,255,0.8)" : "none",
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.6)";
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = "transparent";
        }}
      >
        <span style={{ fontSize: 13 }}>{meta.flag}</span>
        <span>{code.toUpperCase()}</span>
        {active && (
          <Check size={11} strokeWidth={3} style={{ color: "#0284c7", marginLeft: -2 }} />
        )}
      </button>
      {onRemove && hovered && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title={`Remove ${meta.label}`}
          style={{
            position: "absolute",
            right: 4,
            top: "50%",
            transform: "translateY(-50%)",
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            border: "none",
            background: "rgba(15,23,42,0.08)",
            color: "#475569",
            cursor: "pointer",
          }}
        >
          <X size={10} strokeWidth={2.4} />
        </button>
      )}
    </div>
  );
}
