/* ─────────────────────────────────────────────
 * Badge Element — Chip / tag / label
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";

function BadgeElementComponent({ props, scaleFactor = 1 }: ElementRenderProps) {
  const text = (props.text as string) || "Badge";
  const bgColor = (props.bgColor as string) || "#dbeafe";
  const textColor = (props.textColor as string) || "#1d4ed8";
  const borderRadius = (props.borderRadius as number) || 999;
  const fontSize = (props.fontSize as number) || 13;
  const fontWeight = (props.fontWeight as string) || "600";
  const icon = (props.icon as string) || "";

  const scaledFontSize = Math.round(fontSize * scaleFactor);
  const scaledGap = Math.round(6 * scaleFactor);
  const scaledPadH = Math.round(12 * scaleFactor);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: scaledGap,
        backgroundColor: bgColor,
        color: textColor,
        borderRadius,
        fontSize: scaledFontSize,
        fontWeight,
        padding: `0 ${scaledPadH}px`,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {icon && <span>{icon}</span>}
      {text}
    </div>
  );
}

function BadgePropertyPanel({ props, onChange }: PropertyPanelProps) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Text</span>
        <input type="text" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.text as string) || ""} onChange={(e) => onChange({ text: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Icon (emoji)</span>
        <input type="text" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.icon as string) || ""} onChange={(e) => onChange({ icon: e.target.value })} placeholder="⭐" />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Background</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.bgColor as string) || "#dbeafe"} onChange={(e) => onChange({ bgColor: e.target.value })} />
          <input type="text" className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.bgColor as string) || "#dbeafe"} onChange={(e) => onChange({ bgColor: e.target.value })} />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Text Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.textColor as string) || "#1d4ed8"} onChange={(e) => onChange({ textColor: e.target.value })} />
          <input type="text" className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.textColor as string) || "#1d4ed8"} onChange={(e) => onChange({ textColor: e.target.value })} />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Font Size</span>
        <input type="number" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.fontSize as number) || 13} onChange={(e) => onChange({ fontSize: Number(e.target.value) })} min={8} max={48} />
      </label>
    </div>
  );
}

registerElement({
  type: "badge",
  label: "Badge",
  icon: "🏷️",
  category: "content",
  defaultProps: { text: "New", icon: "✨", bgColor: "#dbeafe", textColor: "#1d4ed8", borderRadius: 999, fontSize: 13, fontWeight: "600" },
  defaultTransform: { width: 100, height: 32 },
  component: BadgeElementComponent,
  propertyPanel: BadgePropertyPanel,
});
