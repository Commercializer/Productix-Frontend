/* ─────────────────────────────────────────────
 * GTIN Verification Badge - A small pill fixed to
 * the bottom-right of the live page. Clicking it
 * opens a popup with the product's real GS1 barcode
 * verification status - who owns the manufacturer's
 * GS1 company prefix, territory, etc.
 *
 * Text and styling default to the product's real
 * Product.gtinStatus / gtinData (threaded down via
 * PublicPageContext) but are fully overridable from
 * the property panel, like any other block.
 * ──────────────────────────────────────────── */

"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ShieldCheck, BadgeCheck, ScanBarcode, X } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { usePublicPage } from "../renderer/public-page-context";
import { HexColorPopover } from "./hex-color-popover";

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

/** True when a formatted detail value is a direct link to an image, e.g. GS1's
 * "Product Image Url" - render it as a preview instead of a raw link string. */
function isLikelyImageUrl(value: string): boolean {
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    return /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(new URL(value).pathname);
  } catch {
    return /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(value);
  }
}

/** True when GS1 found a real, licensed manufacturer (GCP) for this GTIN but no
 * full product-level record for the exact GTIN. See apps/web/src/lib/gs1/client.ts. */
function hasManufacturerOnlyMatch(data: Record<string, unknown> | null | undefined): boolean {
  return Boolean(data && typeof data === "object" && (data as Record<string, unknown>).GCPOwner);
}

type Tone = "verified" | "neutral";

const TONE_COLORS: Record<Tone, { bg: string; bgDark: string; text: string; border: string }> = {
  verified: { bg: "#ecfdf5", bgDark: "#052e1f", text: "#047857", border: "#a7f3d0" },
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
    return { label: "Manufacturer Verified", tone: "verified", Icon: BadgeCheck };
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
  const defaultBg = theme === "dark" ? colors.bgDark : colors.bg;
  const defaultTextColor = theme === "dark" ? "#ffffff" : colors.text;

  // Everything below defaults to the live verification status/tone but can be
  // freely overridden per-instance from the property panel.
  const label = ((props.text as string) || "").trim() || info.label;
  const bg = (props.bgColor as string) || defaultBg;
  const textColor = (props.textColor as string) || defaultTextColor;
  const fontSize = (props.fontSize as number) || 13;
  const fontWeight = (props.fontWeight as string) || "600";
  const borderRadius = (props.borderRadius as number) ?? 999;
  const showIcon = props.showIcon !== false;
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
        borderRadius,
        border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.15)" : colors.border}`,
        background: bg,
        color: textColor,
        fontSize,
        fontWeight,
        letterSpacing: "0.01em",
        boxShadow: "0 6px 20px rgba(15, 23, 42, 0.14)",
        cursor: editing ? "default" : "pointer",
        whiteSpace: "nowrap",
        fontFamily: FONT_STACK,
      }}
    >
      {showIcon && <Icon size={15} />}
      {label}
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
          label={label}
          data={gtinData}
          contained={contained}
        />
      )}
    </>,
    portalRoot ?? document.body,
  );
}

function GtinDetailRow({ label, value, first }: Readonly<{ label: string; value: string; first: boolean }>) {
  const [imgError, setImgError] = useState(false);
  const showImage = isLikelyImageUrl(value) && !imgError;

  if (showImage) {
    return (
      <div style={{ padding: "10px", borderTop: first ? "none" : "1px solid #e2e8f0" }}>
        <span style={{ fontSize: 11.5, color: "#64748b", display: "block", marginBottom: 6 }}>{label}</span>
        <img
          src={value}
          alt={label}
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            maxHeight: 160,
            objectFit: "contain",
            borderRadius: 8,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            display: "block",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "8px 10px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 10,
        borderTop: first ? "none" : "1px solid #e2e8f0",
      }}
    >
      <span style={{ fontSize: 11.5, color: "#64748b", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12.5, color: "#0f172a", textAlign: "right", wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}

function GtinDetailsPopup({
  onClose,
  gtin,
  gtinVerifiedAt,
  info,
  label,
  data,
  contained,
}: {
  onClose: () => void;
  gtin?: string | null;
  gtinVerifiedAt?: string | null;
  info: StatusInfo;
  label: string;
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
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{label}</div>
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
              <div style={{ borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                {entries.map(([entryLabel, value], idx) => (
                  <GtinDetailRow key={entryLabel} label={entryLabel} value={value} first={idx === 0} />
                ))}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>No additional details available from GS1 for this barcode yet.</p>
          )}

          {gtin && (
            <a
              href={`https://www.gs1.org/services/verified-by-gs1?gtin=${encodeURIComponent(gtin)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                marginTop: 12,
                textAlign: "center",
                fontSize: 12,
                fontWeight: 600,
                color: "#047857",
                textDecoration: "none",
              }}
            >
              Check real data on GS1.org &rarr;
            </a>
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
        Shows automatically at the bottom-right of the live page whenever this product has a GTIN. Text and
        colors default to the product&apos;s real GS1 verification status, but can be fully overridden below.
      </div>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Text</span>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.text as string) || ""}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Auto (matches verification status)"
        />
      </label>
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
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Background Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover value={(props.bgColor as string) || ""} onChange={(hex) => onChange({ bgColor: hex })} fallback="#ecfdf5" />
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={(props.bgColor as string) || ""}
            placeholder="Auto"
            onChange={(e) => onChange({ bgColor: e.target.value })}
          />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Text Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover value={(props.textColor as string) || ""} onChange={(hex) => onChange({ textColor: hex })} fallback="#047857" />
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={(props.textColor as string) || ""}
            placeholder="Auto"
            onChange={(e) => onChange({ textColor: e.target.value })}
          />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Font Size</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.fontSize as number) || 13}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          min={8}
          max={48}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Font Weight</span>
        <select
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.fontWeight as string) || "600"}
          onChange={(e) => onChange({ fontWeight: e.target.value })}
        >
          <option value="400">Regular</option>
          <option value="500">Medium</option>
          <option value="600">Semibold</option>
          <option value="700">Bold</option>
          <option value="800">Extra Bold</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border Radius</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.borderRadius as number) ?? 999}
          onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          min={0}
          max={999}
        />
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={props.showIcon !== false}
          onChange={(e) => onChange({ showIcon: e.target.checked })}
        />
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Show Icon</span>
      </label>
    </div>
  );
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "gtin-badge",
  label: "GTIN Verification",
  icon: <ShieldCheck size={16} />,
  category: "verification",
  defaultProps: {
    theme: "light",
    text: "",
    bgColor: "",
    textColor: "",
    fontSize: 13,
    fontWeight: "600",
    borderRadius: 999,
    showIcon: true,
  },
  defaultTransform: { width: 220, height: 48 },
  component: GtinVerificationBadgeComponent,
  propertyPanel: GtinBadgePropertyPanel,
});
