/* ─────────────────────────────────────────────
 * GTIN Verification Badge - A small pill fixed to
 * the bottom-right of the live page. Clicking it
 * opens a popup with the product's real GS1 barcode
 * verification status - who owns the manufacturer's
 * GS1 company prefix, territory, etc.
 *
 * The badge's status is never editable in the property
 * panel - it always reflects Product.gtinStatus /
 * gtinData from the database (threaded down via
 * PublicPageContext), so it stays an honest signal.
 * ──────────────────────────────────────────── */

"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ShieldCheck, BadgeCheck, ScanBarcode, X } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { usePublicPage } from "../renderer/public-page-context";

function isInsideEditor(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !!(window as unknown as Record<string, unknown>).__productixEditor;
  } catch {
    return false;
  }
}

/* ─── Local GS1 data formatting ─────────────────
 * Self-contained twin of apps/web/src/lib/gs1/format.ts - packages/editor
 * can't import from the app, so the small pure helpers are duplicated here. */

function humanizeGtinKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

/** GS1 sometimes appends a stray language tag after the real URL, e.g.
 * ".../Product.png%20(en-GB)" or ".../Product.png (en-GB)" - either a literal
 * space or an already-percent-encoded one. Keep only the URL portion, or the
 * image request 404s on the trailing junk. */
function stripTrailingUrlJunk(url: string): string {
  return url.split(/\s|%20/i)[0]!;
}

function formatGtinValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return /^https?:\/\//i.test(trimmed) ? stripTrailingUrlJunk(trimmed) : trimmed;
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

function gtinDetailEntries(data: Record<string, unknown> | null | undefined): Array<[string, string]> {
  if (!data) return [];
  return Object.entries(data)
    .map(([key, value]) => [humanizeGtinKey(key), formatGtinValue(value)] as const)
    .filter((entry): entry is [string, string] => entry[1] !== null);
}

/** True when GS1 found a real, licensed manufacturer (GCP) for this GTIN but no
 * full product-level record for the exact GTIN. See apps/web/src/lib/gs1/client.ts. */
function hasManufacturerOnlyMatch(data: Record<string, unknown> | null | undefined): boolean {
  return Boolean(data && typeof data === "object" && (data as Record<string, unknown>).GCPOwner);
}

type Tone = "verified" | "manufacturer" | "neutral";

const TONE_COLORS: Record<Tone, { bg: string; bgDark: string; text: string; border: string }> = {
  verified: { bg: "#ecfdf5", bgDark: "#052e1f", text: "#047857", border: "#a7f3d0" },
  manufacturer: { bg: "#fffbeb", bgDark: "#3a2a06", text: "#b45309", border: "#fde68a" },
  neutral: { bg: "#f8fafc", bgDark: "#1e293b", text: "#475569", border: "#e2e8f0" },
};

interface StatusInfo {
  label: string;
  tone: Tone;
  Icon: typeof ShieldCheck;
}

function statusInfo(status: string | null | undefined, data: Record<string, unknown> | null | undefined): StatusInfo {
  if (status === "GS1_VERIFIED") return { label: "GTIN Verified", tone: "verified", Icon: ShieldCheck };
  if (status === "GS1_NOT_FOUND" && hasManufacturerOnlyMatch(data)) {
    return { label: "Manufacturer Verified", tone: "manufacturer", Icon: BadgeCheck };
  }
  if (status === "VALID_FORMAT") return { label: "Valid Barcode Format", tone: "neutral", Icon: ScanBarcode };
  if (status === "GS1_NOT_FOUND") return { label: "Not in GS1 Registry", tone: "neutral", Icon: ScanBarcode };
  return { label: "Not Verified", tone: "neutral", Icon: ScanBarcode };
}

const FONT_STACK = "var(--font-sans), system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

function GtinVerificationBadgeComponent({ props, isEditing }: ElementRenderProps) {
  const theme = (props.theme as string) === "dark" ? "dark" : "light";
  const { gtin, gtinStatus, gtinVerifiedAt, gtinData, portalRoot } = usePublicPage();
  const [open, setOpen] = useState(false);
  // The live-page badge is portaled to document.body, which the server can never
  // render - gate it behind a post-mount flip so the first client render still
  // matches the server's (both render nothing) and React doesn't have to discard
  // and regenerate the subtree on hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const editing = isEditing || isInsideEditor();

  // Nothing to verify on the live page - render nothing rather than a hollow badge.
  if (!editing && !gtin) return null;
  if (!editing && !mounted) return null;

  const info: StatusInfo = editing && !gtin
    ? { label: "GTIN Verified", tone: "verified", Icon: ShieldCheck }
    : statusInfo(gtinStatus, gtinData);

  const colors = TONE_COLORS[info.tone];
  const bg = theme === "dark" ? colors.bgDark : colors.bg;
  const textColor = theme === "dark" ? "#ffffff" : colors.text;
  const Icon = info.Icon;

  const pill = (
    <button
      type="button"
      onClick={editing ? undefined : () => setOpen(true)}
      draggable={false}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "9px 14px",
        borderRadius: 999,
        border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.15)" : colors.border}`,
        background: bg,
        color: textColor,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.01em",
        boxShadow: "0 6px 20px rgba(15, 23, 42, 0.14)",
        cursor: editing ? "default" : "pointer",
        whiteSpace: "nowrap",
        fontFamily: FONT_STACK,
      }}
    >
      <Icon size={15} />
      {info.label}
    </button>
  );

  // Canvas edit mode - render inline like every other element so it can be
  // selected, dragged and resized. The real fixed-position + portal behavior
  // only applies to the live page (see below).
  if (editing) {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {pill}
      </div>
    );
  }

  if (typeof window === "undefined") return null;

  const contained = !!portalRoot;

  return createPortal(
    <>
      <div style={{ position: contained ? "absolute" : "fixed", right: 16, bottom: 16, zIndex: 999998 }}>
        {pill}
      </div>
      {open && (
        <GtinDetailsPopup
          onClose={() => setOpen(false)}
          gtin={gtin}
          gtinVerifiedAt={gtinVerifiedAt}
          info={info}
          data={gtinData}
          contained={contained}
        />
      )}
    </>,
    portalRoot ?? document.body,
  );
}

function GtinDetailsPopup({
  onClose,
  gtin,
  gtinVerifiedAt,
  info,
  data,
  contained,
}: {
  onClose: () => void;
  gtin?: string | null;
  gtinVerifiedAt?: string | null;
  info: StatusInfo;
  data?: Record<string, unknown> | null;
  contained: boolean;
}) {
  useEffect(() => {
    if (contained) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [contained]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const entries = gtinDetailEntries(data);
  const colors = TONE_COLORS[info.tone];
  const Icon = info.Icon;

  return (
    <div
      style={{
        position: contained ? "absolute" : "fixed",
        inset: 0,
        zIndex: 999999,
        fontFamily: FONT_STACK,
      }}
    >
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(15, 23, 42, 0.25)" }} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="GTIN verification details"
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
          width: "min(320px, calc(100vw - 32px))",
          maxHeight: "min(420px, calc(100vh - 32px))",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.25)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "14px 14px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: colors.bg,
                color: colors.text,
                flexShrink: 0,
              }}
            >
              <Icon size={15} />
            </span>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{info.label}</div>
              {gtin && <div style={{ fontSize: 11.5, color: "#94a3b8", fontFamily: "monospace", marginTop: 1 }}>{gtin}</div>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              flexShrink: 0,
              width: 26,
              height: 26,
              borderRadius: 8,
              border: "none",
              background: "#f1f5f9",
              color: "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: "0 14px 14px" }}>
          {gtinVerifiedAt && (
            <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 10 }}>
              Checked {new Date(gtinVerifiedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
            </div>
          )}

          {entries.length > 0 ? (
            <div>
              <p style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "#94a3b8", margin: "0 0 6px" }}>
                From the GS1 registry
              </p>
              <div style={{ borderRadius: 10, border: "1px solid #e2e8f0" }}>
                {entries.map(([label, value], idx) => (
                  <div
                    key={label}
                    style={{
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 10,
                      borderTop: idx === 0 ? "none" : "1px solid #e2e8f0",
                    }}
                  >
                    <span style={{ fontSize: 11.5, color: "#64748b", flexShrink: 0 }}>{label}</span>
                    <span style={{ fontSize: 12.5, color: "#0f172a", textAlign: "right", wordBreak: "break-word" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>No additional details available from GS1 for this barcode yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Property Panel ────────────────────────── */

function GtinBadgePropertyPanel({ props, onChange }: PropertyPanelProps) {
  const theme = (props.theme as string) || "light";
  return (
    <div className="space-y-3">
      <div
        style={{
          padding: "10px 12px",
          borderRadius: 8,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          fontSize: 11.5,
          color: "#64748b",
          lineHeight: 1.5,
        }}
      >
        Shows automatically at the bottom-right of the live page whenever this product has a GTIN. Its status
        reflects the product&apos;s real GS1 verification and can&apos;t be edited here — only its appearance can.
      </div>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Style</span>
        <select
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={theme}
          onChange={(e) => onChange({ theme: e.target.value })}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </div>
  );
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "gtin-badge",
  label: "GTIN Verification",
  icon: <ShieldCheck size={16} />,
  category: "interactive",
  defaultProps: { theme: "light" },
  defaultTransform: { width: 220, height: 48 },
  component: GtinVerificationBadgeComponent,
  propertyPanel: GtinBadgePropertyPanel,
});
