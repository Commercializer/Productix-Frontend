/* ─────────────────────────────────────────────
 * Row Element — Horizontal flex container
 *
 * A responsive row that:
 * - Displays children in a horizontal row on desktop
 * - Wraps children automatically when they don't fit
 * - Stacks children vertically on mobile by default
 * - Supports gap, justify, and align controls
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";

/* ─── Component ─────────────────────────────── */

function RowElementComponent({ props, scaleFactor = 1 }: ElementRenderProps) {
  const gap = (props.gap as number) ?? 16;
  const justify = (props.justifyContent as string) || "flex-start";
  const align = (props.alignItems as string) || "stretch";
  const wrap = (props.wrap as string) || "wrap";
  const bgColor = (props.bgColor as string) || "transparent";
  const padding = (props.padding as number) ?? 0;
  const borderRadius = (props.borderRadius as number) ?? 0;
  const minHeight = (props.minHeight as number) ?? 80;

  const s = scaleFactor;

  return (
    <div
      style={{
        width: "100%",
        minHeight: Math.round(minHeight * s),
        display: "flex",
        flexDirection: "row",
        flexWrap: wrap as React.CSSProperties["flexWrap"],
        justifyContent: justify,
        alignItems: align,
        gap: Math.round(gap * s),
        background: bgColor,
        padding: Math.round(padding * s),
        borderRadius,
        boxSizing: "border-box",
        transition: "all 0.2s ease",
      }}
    >
      {/* Visual placeholder for empty rows */}
      <div
        style={{
          width: "100%",
          minHeight: Math.round(40 * s),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed #d1d5db",
          borderRadius: 6,
          color: "#9ca3af",
          fontSize: Math.round(12 * s),
          fontWeight: 500,
          opacity: 0.6,
        }}
      >
        ↔ Row — {gap}px gap — {wrap}
      </div>
    </div>
  );
}

/* ─── Property Panel ────────────────────────── */

function RowPropertyPanel({ props, onChange }: PropertyPanelProps) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gap (px)</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.gap as number) ?? 16}
          onChange={(e) => onChange({ gap: Number(e.target.value) })}
          min={0}
          max={200}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Justify</span>
        <select
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.justifyContent as string) || "flex-start"}
          onChange={(e) => onChange({ justifyContent: e.target.value })}
        >
          <option value="flex-start">Start</option>
          <option value="center">Center</option>
          <option value="flex-end">End</option>
          <option value="space-between">Space Between</option>
          <option value="space-around">Space Around</option>
          <option value="space-evenly">Space Evenly</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Align Items</span>
        <select
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.alignItems as string) || "stretch"}
          onChange={(e) => onChange({ alignItems: e.target.value })}
        >
          <option value="flex-start">Top</option>
          <option value="center">Center</option>
          <option value="flex-end">Bottom</option>
          <option value="stretch">Stretch</option>
          <option value="baseline">Baseline</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Wrap</span>
        <select
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.wrap as string) || "wrap"}
          onChange={(e) => onChange({ wrap: e.target.value })}
        >
          <option value="wrap">Wrap</option>
          <option value="nowrap">No Wrap</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Padding (px)</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.padding as number) ?? 0}
          onChange={(e) => onChange({ padding: Number(e.target.value) })}
          min={0}
          max={200}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Min Height</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.minHeight as number) ?? 80}
          onChange={(e) => onChange({ minHeight: Number(e.target.value) })}
          min={0}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Background</span>
        <div className="mt-1 flex gap-2 items-center">
          <input
            type="color"
            className="h-8 w-8 cursor-pointer rounded border border-gray-200"
            value={(props.bgColor as string) || "#ffffff"}
            onChange={(e) => onChange({ bgColor: e.target.value })}
          />
          <button
            type="button"
            className="text-xs text-gray-500 hover:text-gray-700"
            onClick={() => onChange({ bgColor: "transparent" })}
          >
            Clear
          </button>
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border Radius</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.borderRadius as number) ?? 0}
          onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          min={0}
          max={999}
        />
      </label>
    </div>
  );
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "row",
  label: "Row",
  icon: "⬜",
  category: "layout",
  defaultProps: {
    gap: 16,
    justifyContent: "flex-start",
    alignItems: "stretch",
    wrap: "wrap",
    bgColor: "transparent",
    padding: 16,
    minHeight: 80,
    borderRadius: 0,
  },
  defaultTransform: { width: 800, height: 120 },
  component: RowElementComponent,
  propertyPanel: RowPropertyPanel,
});
