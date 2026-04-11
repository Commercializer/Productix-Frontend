/* ─────────────────────────────────────────────
 * Icon Element — Display Lucide/emoji icons
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";

const COMMON_ICONS = [
  "⭐", "🔥", "💎", "🚀", "⚡", "❤️", "✅", "🎯", "🏆", "💡",
  "📊", "📈", "🛡️", "🌍", "🎉", "📱", "💻", "🔐", "📦", "🎨",
  "✨", "🔔", "📧", "🏠", "⚙️", "👤", "📷", "🎵", "📅", "🔗",
];

function IconElementComponent({ props }: ElementRenderProps) {
  const icon = (props.icon as string) || "⭐";
  const color = (props.color as string) || "#3b82f6";
  const fontSize = (props.fontSize as number) || 48;
  const bgColor = (props.bgColor as string) || "transparent";
  const borderRadius = (props.borderRadius as number) || 12;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        color,
        backgroundColor: bgColor,
        borderRadius,
      }}
    >
      {icon}
    </div>
  );
}

function IconPropertyPanel({ props, onChange }: PropertyPanelProps) {
  return (
    <div className="space-y-3">
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Icon</span>
        <div className="mt-1 grid grid-cols-6 gap-1">
          {COMMON_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              className={`flex h-9 w-full items-center justify-center rounded-md text-lg transition-colors ${
                props.icon === icon ? "bg-blue-100 ring-2 ring-blue-500" : "bg-gray-50 hover:bg-gray-100"
              }`}
              onClick={() => onChange({ icon })}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Custom Icon/Emoji</span>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.icon as string) || ""}
          onChange={(e) => onChange({ icon: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Size</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.fontSize as number) || 48}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          min={12}
          max={200}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Background</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.bgColor as string) || "#ffffff"} onChange={(e) => onChange({ bgColor: e.target.value })} />
          <button type="button" className="text-xs text-gray-500 hover:text-gray-700" onClick={() => onChange({ bgColor: "transparent" })}>Clear</button>
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border Radius</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.borderRadius as number) || 12}
          onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          min={0}
          max={999}
        />
      </label>
    </div>
  );
}

registerElement({
  type: "icon",
  label: "Icon",
  icon: "⭐",
  category: "content",
  defaultProps: { icon: "⭐", color: "#3b82f6", fontSize: 48, bgColor: "transparent", borderRadius: 12 },
  defaultTransform: { width: 64, height: 64 },
  component: IconElementComponent,
  propertyPanel: IconPropertyPanel,
});
