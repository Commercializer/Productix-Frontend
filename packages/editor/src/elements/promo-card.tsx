/* ─────────────────────────────────────────────
 * Promo Card Element — Featured promotional card
 * with background image upload support.
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { Megaphone } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { ImageUploadWidget } from "../media/image-upload-widget";
import { HexColorPopover } from "./hex-color-popover";

function PromoCardComponent({ props, scaleFactor = 1 }: ElementRenderProps) {
  const title = (props.title as string) || "Special Offer";
  const subtitle = (props.subtitle as string) || "Limited time only";
  const ctaText = (props.ctaText as string) || "Learn More";
  const bgImage = (props.bgImage as string) || "";
  const bgColor = (props.bgColor as string) || "#0f172a";
  const gradientFrom = (props.gradientFrom as string) || "#1e40af";
  const gradientTo = (props.gradientTo as string) || "#7c3aed";
  const textColor = (props.textColor as string) || "#ffffff";
  const borderRadius = (props.borderRadius as number) || 20;
  const overlayOpacity = (props.overlayOpacity as number) || 0.5;

  const s = scaleFactor;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius,
        overflow: "hidden",
        position: "relative",
        background: bgImage ? bgColor : `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        color: textColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: Math.round(24 * s),
      }}
    >
      {bgImage && (
        <>
          <img
            src={bgImage}
            alt=""
            draggable={false}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${overlayOpacity})` }} />
        </>
      )}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h3 style={{ fontSize: Math.round(22 * s), fontWeight: 700, marginBottom: Math.round(6 * s), lineHeight: 1.2 }}>{title}</h3>
        <p style={{ fontSize: Math.round(14 * s), opacity: 0.85, marginBottom: Math.round(16 * s), lineHeight: 1.5 }}>{subtitle}</p>
        {ctaText && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: `${Math.round(8 * s)}px ${Math.round(20 * s)}px`,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              borderRadius: Math.round(8 * s),
              fontSize: Math.round(13 * s),
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {ctaText}
          </span>
        )}
      </div>
    </div>
  );
}

function PromoCardPropertyPanel({ props, onChange }: PropertyPanelProps) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</span>
        <input type="text" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.title as string) || ""} onChange={(e) => onChange({ title: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subtitle</span>
        <textarea className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" rows={2} value={(props.subtitle as string) || ""} onChange={(e) => onChange({ subtitle: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">CTA Text</span>
        <input type="text" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.ctaText as string) || ""} onChange={(e) => onChange({ ctaText: e.target.value })} />
      </label>

      {/* ── Background Image Upload ── */}
      <ImageUploadWidget
        value={(props.bgImage as string) || ""}
        onChange={(url) => onChange({ bgImage: url })}
        label="Background Image"
        compact
      />

      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gradient Start</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover value={(props.gradientFrom as string) || ""} onChange={(hex) => onChange({ gradientFrom: hex })} fallback="#1e40af" />
          <HexColorPopover value={(props.gradientTo as string) || ""} onChange={(hex) => onChange({ gradientTo: hex })} fallback="#7c3aed" />
          <span className="text-xs text-gray-400">From / To</span>
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Text Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover value={(props.textColor as string) || ""} onChange={(hex) => onChange({ textColor: hex })} fallback="#ffffff" />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border Radius</span>
        <input type="number" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.borderRadius as number) || 20} onChange={(e) => onChange({ borderRadius: Number(e.target.value) })} min={0} max={50} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Overlay Opacity</span>
        <input type="range" className="mt-1 w-full" value={((props.overlayOpacity as number) || 0.5) * 100} onChange={(e) => onChange({ overlayOpacity: Number(e.target.value) / 100 })} min={0} max={100} />
        <span className="text-xs text-gray-400">{Math.round(((props.overlayOpacity as number) || 0.5) * 100)}%</span>
      </label>
    </div>
  );
}

registerElement({
  type: "promo-card",
  label: "Promo Card",
  icon: <Megaphone size={16} />,
  category: "promotional",
  defaultProps: {
    title: "Special Offer",
    subtitle: "Get 50% off your first month. Limited time only.",
    ctaText: "Claim Offer",
    bgImage: "",
    bgColor: "#0f172a",
    gradientFrom: "#1e40af",
    gradientTo: "#7c3aed",
    textColor: "#ffffff",
    borderRadius: 20,
    overlayOpacity: 0.5,
  },
  defaultTransform: { width: 360, height: 280 },
  component: PromoCardComponent,
  propertyPanel: PromoCardPropertyPanel,
});
