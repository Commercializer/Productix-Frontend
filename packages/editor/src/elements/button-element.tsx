/* ─────────────────────────────────────────────
 * Button Element — CTA button with styling
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";

/* ─── Component ─────────────────────────────── */

function ButtonElementComponent({ props, isEditing }: ElementRenderProps) {
  const text = (props.text as string) || "Click Me";
  const bgColor = (props.bgColor as string) || "#3b82f6";
  const textColor = (props.textColor as string) || "#ffffff";
  const borderRadius = (props.borderRadius as number) || 8;
  const fontSize = (props.fontSize as number) || 15;
  const fontWeight = (props.fontWeight as string) || "600";
  const variant = (props.variant as string) || "filled";
  const url = (props.url as string) || "#";

  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius,
    fontSize,
    fontWeight,
    cursor: isEditing ? "default" : "pointer",
    transition: "all 0.15s ease",
    textDecoration: "none",
    letterSpacing: "0.01em",
    padding: "0 16px",
    ...(variant === "filled"
      ? { background: bgColor, color: textColor, border: "none" }
      : variant === "outline"
        ? { background: "transparent", color: bgColor, border: `2px solid ${bgColor}` }
        : { background: "transparent", color: bgColor, border: "none", textDecoration: "underline" }),
  };

  return <div style={style}>{text}</div>;
}

/* ─── Property Panel ────────────────────────── */

function ButtonPropertyPanel({ props, onChange }: PropertyPanelProps) {
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
          <input
            type="color"
            className="h-8 w-8 cursor-pointer rounded border border-gray-200"
            value={(props.bgColor as string) || "#3b82f6"}
            onChange={(e) => onChange({ bgColor: e.target.value })}
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
          <input
            type="color"
            className="h-8 w-8 cursor-pointer rounded border border-gray-200"
            value={(props.textColor as string) || "#ffffff"}
            onChange={(e) => onChange({ textColor: e.target.value })}
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
    </div>
  );
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "button",
  label: "Button",
  icon: "🔘",
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
  },
  defaultTransform: { width: 180, height: 48 },
  component: ButtonElementComponent,
  propertyPanel: ButtonPropertyPanel,
});
