/* ─────────────────────────────────────────────
 * Raffle Element — A simple block showing a raffle draw
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { Ticket } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";

function RaffleComponent({ props, scaleFactor = 1 }: ElementRenderProps) {
  const title = (props.title as string) || "Join the Raffle";
  const subtitle = (props.subtitle as string) || "Win exciting prizes!";
  const ctaText = (props.ctaText as string) || "Enter Draw";
  const bgColor = (props.bgColor as string) || "#f59e0b";
  const textColor = (props.textColor as string) || "#ffffff";
  const borderRadius = (props.borderRadius as number) || 16;
  const s = scaleFactor;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius,
        backgroundColor: bgColor,
        color: textColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: Math.round(20 * s),
        textAlign: "center",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div style={{ position: "absolute", top: -20, left: -20, opacity: 0.1, transform: "rotate(-15deg)" }}>
        <Ticket size={120 * s} />
      </div>
      <Ticket size={48 * s} style={{ marginBottom: Math.round(12 * s) }} />
      <h3 style={{ fontSize: Math.round(24 * s), fontWeight: 800, marginBottom: Math.round(8 * s), lineHeight: 1.2 }}>{title}</h3>
      <p style={{ fontSize: Math.round(16 * s), opacity: 0.9, marginBottom: Math.round(20 * s) }}>{subtitle}</p>
      
      <button
        style={{
          backgroundColor: textColor,
          color: bgColor,
          border: "none",
          padding: `${Math.round(12 * s)}px ${Math.round(24 * s)}px`,
          borderRadius: Math.round(30 * s),
          fontSize: Math.round(16 * s),
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        {ctaText}
      </button>
    </div>
  );
}

function RafflePropertyPanel({ props, onChange }: PropertyPanelProps) {
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
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Background Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.bgColor as string) || "#f59e0b"} onChange={(e) => onChange({ bgColor: e.target.value })} />
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
        <input type="number" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.borderRadius as number) || 16} onChange={(e) => onChange({ borderRadius: Number(e.target.value) })} min={0} max={50} />
      </label>
    </div>
  );
}

registerElement({
  type: "raffle",
  label: "Raffle Draw",
  icon: <Ticket size={16} />,
  category: "gaming",
  defaultProps: {
    title: "Join the Raffle",
    subtitle: "Win exciting prizes!",
    ctaText: "Enter Draw",
    bgColor: "#f59e0b",
    textColor: "#ffffff",
    borderRadius: 16,
  },
  defaultTransform: { width: 320, height: 260 },
  component: RaffleComponent,
  propertyPanel: RafflePropertyPanel,
});
