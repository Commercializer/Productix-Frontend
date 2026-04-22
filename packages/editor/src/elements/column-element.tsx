/* ─────────────────────────────────────────────
 * Column Element — Flex item for use within Rows
 *
 * A responsive column that:
 * - Takes a configurable width (%, auto)
 * - Stacks full-width on mobile screens
 * - Supports min-width for wrapping control
 * - Can hold content with optional background
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { Columns3 } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";

/* ─── Component ─────────────────────────────── */

function ColumnElementComponent({ props, scaleFactor = 1 }: ElementRenderProps) {
  const widthPercent = (props.widthPercent as number) ?? 50;
  const minWidth = (props.minWidth as number) ?? 200;
  const bgColor = (props.bgColor as string) || "transparent";
  const padding = (props.padding as number) ?? 16;
  const borderRadius = (props.borderRadius as number) ?? 0;
  const borderColor = (props.borderColor as string) || "transparent";
  const borderWidth = (props.borderWidth as number) || 0;
  const minHeight = (props.minHeight as number) ?? 60;

  const s = scaleFactor;

  return (
    <div
      style={{
        width: "100%",
        minWidth: Math.round(minWidth * s),
        minHeight: Math.round(minHeight * s),
        background: bgColor,
        padding: Math.round(padding * s),
        borderRadius,
        border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
      }}
    >
      {/* Visual placeholder */}
      <div
        style={{
          width: "100%",
          minHeight: Math.round(30 * s),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px dashed #d1d5db",
          borderRadius: 4,
          color: "#9ca3af",
          fontSize: Math.round(11 * s),
          fontWeight: 500,
          opacity: 0.5,
        }}
      >
        ↕ Col — {widthPercent}%
      </div>
    </div>
  );
}

/* ─── Property Panel ────────────────────────── */

function ColumnPropertyPanel({ props, onChange }: PropertyPanelProps) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Width (%)</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.widthPercent as number) ?? 50}
          onChange={(e) => onChange({ widthPercent: Number(e.target.value) })}
          min={5}
          max={100}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Min Width (px)</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.minWidth as number) ?? 200}
          onChange={(e) => onChange({ minWidth: Number(e.target.value) })}
          min={0}
          max={1440}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Padding (px)</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.padding as number) ?? 16}
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
          value={(props.minHeight as number) ?? 60}
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
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border</span>
        <div className="mt-1 flex gap-2 items-center">
          <input
            type="color"
            className="h-8 w-8 cursor-pointer rounded border border-gray-200"
            value={(props.borderColor as string) || "#e5e7eb"}
            onChange={(e) => onChange({ borderColor: e.target.value })}
          />
          <input
            type="number"
            className="w-16 rounded-md border border-gray-200 bg-white px-2 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={(props.borderWidth as number) || 0}
            onChange={(e) => onChange({ borderWidth: Number(e.target.value) })}
            min={0}
            max={10}
          />
          <span className="text-xs text-gray-400">px</span>
        </div>
      </label>
    </div>
  );
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "column",
  label: "Column",
  icon: <Columns3 size={16} />,
  category: "layout",
  defaultProps: {
    widthPercent: 50,
    minWidth: 140,
    bgColor: "transparent",
    padding: 16,
    minHeight: 60,
    borderRadius: 0,
    borderColor: "transparent",
    borderWidth: 0,
  },
  defaultTransform: { width: 343, height: 200 },
  component: ColumnElementComponent,
  propertyPanel: ColumnPropertyPanel,
});
