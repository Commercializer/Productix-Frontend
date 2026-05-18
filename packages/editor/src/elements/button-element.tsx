/* ─────────────────────────────────────────────
 * Button Element — CTA button with styling
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { MousePointerClick } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { HexColorPopover } from "./hex-color-popover";

/* ─── Component ─────────────────────────────── */

function ButtonElementComponent({ props, isEditing, scaleFactor = 1 }: ElementRenderProps) {
  const text = (props.text as string) || "Click Me";
  const bgColor = (props.bgColor as string) || "#3b82f6";
  const textColor = (props.textColor as string) || "#ffffff";
  const borderRadius = (props.borderRadius as number) || 8;
  const fontSize = (props.fontSize as number) || 15;
  const fontWeight = (props.fontWeight as string) || "600";
  const variant = (props.variant as string) || "filled";

  // Shadow props
  const shadowEnabled = !!props.shadowEnabled;
  const shadowColor = (props.shadowColor as string) || "rgba(0,0,0,0.25)";
  const shadowX = (props.shadowX as number) ?? 0;
  const shadowY = (props.shadowY as number) ?? 4;
  const shadowBlur = (props.shadowBlur as number) ?? 12;
  const shadowSpread = (props.shadowSpread as number) ?? 0;

  // Scale font size and padding proportionally
  const scaledFontSize = Math.round(fontSize * scaleFactor);
  const scaledPadH = Math.round(16 * scaleFactor);
  const scaledBorderRadius = Math.round(borderRadius * scaleFactor);

  // Build box-shadow (scale offsets/blur/spread too)
  const boxShadow = shadowEnabled
    ? `${Math.round(shadowX * scaleFactor)}px ${Math.round(shadowY * scaleFactor)}px ${Math.round(shadowBlur * scaleFactor)}px ${Math.round(shadowSpread * scaleFactor)}px ${shadowColor}`
    : undefined;

  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scaledBorderRadius,
    fontSize: scaledFontSize,
    fontWeight,
    cursor: isEditing ? "default" : "pointer",
    transition: "all 0.15s ease",
    textDecoration: "none",
    letterSpacing: "0.01em",
    padding: `0 ${scaledPadH}px`,
    boxShadow,
    ...(variant === "filled"
      ? { background: bgColor, color: textColor, border: "none" }
      : variant === "outline"
        ? { background: "transparent", color: bgColor, border: `2px solid ${bgColor}` }
        : { background: "transparent", color: bgColor, border: "none", textDecoration: "underline" }),
  };

  const url = props.url as string;

  if (!isEditing && url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" style={style}>
        {text}
      </a>
    );
  }

  return <div style={style}>{text}</div>;
}

/* ─── Property Panel ────────────────────────── */

/* ─── Shadow Presets ─────────────────────────── */

const SHADOW_PRESETS: { label: string; values: { shadowX: number; shadowY: number; shadowBlur: number; shadowSpread: number; shadowColor: string } }[] = [
  { label: "Subtle",  values: { shadowX: 0, shadowY: 2,  shadowBlur: 8,  shadowSpread: 0, shadowColor: "rgba(0,0,0,0.12)" } },
  { label: "Medium",  values: { shadowX: 0, shadowY: 4,  shadowBlur: 16, shadowSpread: 0, shadowColor: "rgba(0,0,0,0.20)" } },
  { label: "Strong",  values: { shadowX: 0, shadowY: 8,  shadowBlur: 30, shadowSpread: 0, shadowColor: "rgba(0,0,0,0.30)" } },
  { label: "Glow",    values: { shadowX: 0, shadowY: 0,  shadowBlur: 20, shadowSpread: 4, shadowColor: "rgba(59,130,246,0.50)" } },
];

/* ─── Property Panel ────────────────────────── */

function ButtonPropertyPanel({ props, onChange }: PropertyPanelProps) {
  const shadowEnabled = !!props.shadowEnabled;

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Label</span>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.text as string) || ""}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">URL</span>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          placeholder="https://..."
          value={(props.url as string) || ""}
          onChange={(e) => onChange({ url: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Variant</span>
        <select
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.variant as string) || "filled"}
          onChange={(e) => onChange({ variant: e.target.value })}
        >
          <option value="filled">Filled</option>
          <option value="outline">Outline</option>
          <option value="link">Link</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Background</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover
            value={(props.bgColor as string) || ""}
            onChange={(hex) => onChange({ bgColor: hex })}
            fallback="#3b82f6"
          />
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={(props.bgColor as string) || "#3b82f6"}
            onChange={(e) => onChange({ bgColor: e.target.value })}
          />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Text Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover
            value={(props.textColor as string) || ""}
            onChange={(hex) => onChange({ textColor: hex })}
            fallback="#ffffff"
          />
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={(props.textColor as string) || "#ffffff"}
            onChange={(e) => onChange({ textColor: e.target.value })}
          />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border Radius</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.borderRadius as number) || 8}
          onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          min={0}
          max={999}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Font Size</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.fontSize as number) || 15}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          min={8}
          max={72}
        />
      </label>

      {/* ─── Box Shadow Section ─── */}
      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Box Shadow</span>
          <button
            type="button"
            onClick={() => onChange({ shadowEnabled: !shadowEnabled })}
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              position: "relative",
              background: shadowEnabled ? "#3b82f6" : "#d1d5db",
              transition: "background 0.2s",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 2,
                left: shadowEnabled ? 18 : 2,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transition: "left 0.2s",
              }}
            />
          </button>
        </div>

        {shadowEnabled && (
          <div className="space-y-2" style={{ animation: "fadeIn 0.15s ease" }}>
            {/* Presets row */}
            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
              {SHADOW_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onChange({ ...preset.values, shadowEnabled: true })}
                  style={{
                    flex: 1,
                    padding: "5px 0",
                    fontSize: 10,
                    fontWeight: 600,
                    borderRadius: 6,
                    border: "1px solid #e5e7eb",
                    background: "#fafafa",
                    color: "#4b5563",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.borderColor = "#3b82f6"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Shadow Color */}
            <label className="block">
              <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>Shadow Color</span>
              <div className="mt-1 flex gap-2 items-center">
                <HexColorPopover
                  value={rgbaToHex((props.shadowColor as string) || "rgba(0,0,0,0.25)")}
                  onChange={(hex) => {
                    const opacity = extractOpacity((props.shadowColor as string) || "rgba(0,0,0,0.25)");
                    onChange({ shadowColor: hexToRgba(hex, opacity) });
                  }}
                  fallback="#000000"
                />
                <input
                  type="text"
                  className="flex-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs shadow-sm focus:border-blue-500 focus:outline-none"
                  value={(props.shadowColor as string) || "rgba(0,0,0,0.25)"}
                  onChange={(e) => onChange({ shadowColor: e.target.value })}
                />
              </div>
            </label>

            {/* Shadow Opacity */}
            <label className="block">
              <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>Shadow Opacity</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <input
                  type="range"
                  style={{ flex: 1, accentColor: "#3b82f6" }}
                  min={0}
                  max={100}
                  value={Math.round(extractOpacity((props.shadowColor as string) || "rgba(0,0,0,0.25)") * 100)}
                  onChange={(e) => {
                    const opacity = Number(e.target.value) / 100;
                    const hex = rgbaToHex((props.shadowColor as string) || "rgba(0,0,0,0.25)");
                    onChange({ shadowColor: hexToRgba(hex, opacity) });
                  }}
                />
                <span style={{ fontSize: 11, color: "#9ca3af", width: 32, textAlign: "right" }}>
                  {Math.round(extractOpacity((props.shadowColor as string) || "rgba(0,0,0,0.25)") * 100)}%
                </span>
              </div>
            </label>

            {/* Offset X / Y */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <label className="block">
                <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>Offset X</span>
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs shadow-sm focus:border-blue-500 focus:outline-none"
                  value={(props.shadowX as number) ?? 0}
                  onChange={(e) => onChange({ shadowX: Number(e.target.value) })}
                  min={-50}
                  max={50}
                />
              </label>
              <label className="block">
                <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>Offset Y</span>
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs shadow-sm focus:border-blue-500 focus:outline-none"
                  value={(props.shadowY as number) ?? 4}
                  onChange={(e) => onChange({ shadowY: Number(e.target.value) })}
                  min={-50}
                  max={50}
                />
              </label>
            </div>

            {/* Blur / Spread */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <label className="block">
                <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>Blur</span>
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs shadow-sm focus:border-blue-500 focus:outline-none"
                  value={(props.shadowBlur as number) ?? 12}
                  onChange={(e) => onChange({ shadowBlur: Number(e.target.value) })}
                  min={0}
                  max={100}
                />
              </label>
              <label className="block">
                <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>Spread</span>
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs shadow-sm focus:border-blue-500 focus:outline-none"
                  value={(props.shadowSpread as number) ?? 0}
                  onChange={(e) => onChange({ shadowSpread: Number(e.target.value) })}
                  min={-20}
                  max={50}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Shadow Color Helpers ────────────────── */

/** Extract hex color from an rgba() string (fallback: return input if already hex) */
function rgbaToHex(rgba: string): string {
  const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return rgba.startsWith("#") ? rgba : "#000000";
  const r = Number(m[1]).toString(16).padStart(2, "0");
  const g = Number(m[2]).toString(16).padStart(2, "0");
  const b = Number(m[3]).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

/** Extract opacity from an rgba() string */
function extractOpacity(rgba: string): number {
  const m = rgba.match(/rgba?\([^)]*,\s*([\d.]+)\s*\)/);
  return m && m[1] ? parseFloat(m[1]) : 1;
}

/** Convert hex + opacity to rgba() string */
function hexToRgba(hex: string, opacity: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r},${g},${b},${opacity.toFixed(2)})`;
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "button",
  label: "Button",
  icon: <MousePointerClick size={16} />,
  category: "interactive",
  defaultProps: {
    text: "Get Started",
    url: "#",
    variant: "filled",
    bgColor: "#3b82f6",
    textColor: "#ffffff",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: "600",
    shadowEnabled: false,
    shadowColor: "rgba(0,0,0,0.25)",
    shadowX: 0,
    shadowY: 4,
    shadowBlur: 12,
    shadowSpread: 0,
  },
  defaultTransform: { width: 180, height: 48 },
  component: ButtonElementComponent,
  propertyPanel: ButtonPropertyPanel,
});
