/* ─────────────────────────────────────────────
 * Shape Element - Unified Canva-style shape
 *
 * One element type, many variants (props.variant).
 * The blocks panel shows a single "Shape" block that
 * opens a picker; geometry lives in shapes-catalog.
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { Shapes } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { HexColorPopover } from "./hex-color-popover";
import { ShapeRender, getShapeDef, getShapeDefaultProps } from "./shapes-catalog";

function ShapeElementComponent({ props, scaleFactor = 1 }: ElementRenderProps) {
  const variant = (props.variant as string) || "rectangle";
  return (
    <ShapeRender
      variant={variant}
      fill={(props.fill as string) || "#8b5cf6"}
      stroke={(props.stroke as string) || "#1a1a2e"}
      strokeWidth={(props.strokeWidth as number) || 0}
      radius={(props.radius as number) || 0}
      lineStyle={(props.lineStyle as string) || "solid"}
      scaleFactor={scaleFactor}
    />
  );
}

function ShapePropertyPanel({ props, onChange }: PropertyPanelProps) {
  const variant = (props.variant as string) || "rectangle";
  const def = getShapeDef(variant);
  const isLine = def.kind === "line";
  const isRect = def.kind === "rect";

  if (isLine) {
    return (
      <div className="space-y-3">
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Color</span>
          <div className="mt-1 flex gap-2 items-center">
            <HexColorPopover value={(props.stroke as string) || ""} onChange={(hex) => onChange({ stroke: hex })} fallback="#1a1a2e" />
          </div>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Thickness</span>
          <input type="number" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.strokeWidth as number) || 3} onChange={(e) => onChange({ strokeWidth: Number(e.target.value) })} min={1} max={40} />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Style</span>
          <select className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.lineStyle as string) || "solid"} onChange={(e) => onChange({ lineStyle: e.target.value })}>
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fill</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover value={(props.fill as string) || ""} onChange={(hex) => onChange({ fill: hex })} fallback="#8b5cf6" />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover value={(props.stroke as string) || ""} onChange={(hex) => onChange({ stroke: hex })} fallback="#1a1a2e" />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border Width</span>
        <input type="number" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.strokeWidth as number) || 0} onChange={(e) => onChange({ strokeWidth: Number(e.target.value) })} min={0} max={40} />
      </label>
      {isRect && (
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Corner Radius</span>
          <input type="number" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.radius as number) || 0} onChange={(e) => onChange({ radius: Number(e.target.value) })} min={0} max={400} />
        </label>
      )}
    </div>
  );
}

registerElement({
  type: "shape",
  label: "Shape",
  icon: <Shapes size={16} />,
  category: "shape",
  defaultProps: { ...getShapeDefaultProps("rectangle") },
  defaultTransform: { width: 200, height: 140 },
  component: ShapeElementComponent,
  propertyPanel: ShapePropertyPanel,
});
