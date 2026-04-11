/* ─────────────────────────────────────────────
 * Divider Element — Line / shape separator
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";

function DividerElementComponent({ props }: ElementRenderProps) {
  const color = (props.color as string) || "#e5e7eb";
  const thickness = (props.thickness as number) || 2;
  const style = (props.lineStyle as string) || "solid";
  const orientation = (props.orientation as string) || "horizontal";

  if (orientation === "vertical") {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "stretch", justifyContent: "center" }}>
        <div style={{ width: thickness, height: "100%", borderLeft: `${thickness}px ${style} ${color}` }} />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center" }}>
      <div style={{ width: "100%", height: 0, borderTop: `${thickness}px ${style} ${color}` }} />
    </div>
  );
}

function DividerPropertyPanel({ props, onChange }: PropertyPanelProps) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.color as string) || "#e5e7eb"} onChange={(e) => onChange({ color: e.target.value })} />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Thickness</span>
        <input type="number" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.thickness as number) || 2} onChange={(e) => onChange({ thickness: Number(e.target.value) })} min={1} max={20} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Style</span>
        <select className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.lineStyle as string) || "solid"} onChange={(e) => onChange({ lineStyle: e.target.value })}>
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Orientation</span>
        <select className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.orientation as string) || "horizontal"} onChange={(e) => onChange({ orientation: e.target.value })}>
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </label>
    </div>
  );
}

registerElement({
  type: "divider",
  label: "Divider",
  icon: "➖",
  category: "layout",
  defaultProps: { color: "#e5e7eb", thickness: 2, lineStyle: "solid", orientation: "horizontal" },
  defaultTransform: { width: 400, height: 20 },
  component: DividerElementComponent,
  propertyPanel: DividerPropertyPanel,
});
