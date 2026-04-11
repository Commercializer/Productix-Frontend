/* ─────────────────────────────────────────────
 * Promo Card Element — Featured promotional card
 * with background image upload support.
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { ImageUploadWidget } from "../media/image-upload-widget";

function PromoCardComponent({ props }: ElementRenderProps) {
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
        padding: 24,
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
        <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, lineHeight: 1.2 }}>{title}</h3>
        <p style={{ fontSize: 14, opacity: 0.85, marginBottom: 16, lineHeight: 1.5 }}>{subtitle}</p>
        {ctaText && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 20px",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              borderRadius: 8,
              fontSize: 13,
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
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.gradientFrom as string) || "#1e40af"} onChange={(e) => onChange({ gradientFrom: e.target.value })} />
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.gradientTo as string) || "#7c3aed"} onChange={(e) => onChange({ gradientTo: e.target.value })} />
          <span className="text-xs text-gray-400">From / To</span>
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Text Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.textColor as string) || "#ffffff"} onChange={(e) => onChange({ textColor: e.target.value })} />
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
  icon: "🎯",
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
