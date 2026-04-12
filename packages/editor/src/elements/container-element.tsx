/* ─────────────────────────────────────────────
 * Container Element — Section / area / banner with
 * optional background image, gradient, and overlay.
 *
 * Ideal for banner regions, hero backgrounds, and
 * full-bleed image sections.
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { ImageUploadWidget } from "../media/image-upload-widget";

function ContainerElementComponent({ props, scaleFactor = 1 }: ElementRenderProps) {
  const bgColor = (props.bgColor as string) || "transparent";
  const borderRadius = (props.borderRadius as number) || 0;
  const borderColor = (props.borderColor as string) || "transparent";
  const borderWidth = (props.borderWidth as number) || 0;
  const padding = (props.padding as number) || 0;
  const bgGradientFrom = (props.bgGradientFrom as string) || "";
  const bgGradientTo = (props.bgGradientTo as string) || "";
  const bgImage = (props.bgImage as string) || "";
  const bgSize = (props.bgSize as string) || "cover";
  const bgPosition = (props.bgPosition as string) || "center";
  const overlayColor = (props.overlayColor as string) || "";
  const overlayOpacity = (props.overlayOpacity as number) ?? 0.5;

  const background = bgGradientFrom && bgGradientTo
    ? `linear-gradient(135deg, ${bgGradientFrom}, ${bgGradientTo})`
    : bgColor;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background,
        borderRadius,
        border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
        padding: Math.round(padding * scaleFactor),
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background image */}
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: bgSize as React.CSSProperties["objectFit"],
            objectPosition: bgPosition,
            borderRadius,
            zIndex: 0,
          }}
        />
      )}

      {/* Overlay */}
      {(overlayColor || bgImage) && overlayColor && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: overlayColor,
            opacity: overlayOpacity,
            borderRadius,
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
}

function ContainerPropertyPanel({ props, onChange }: PropertyPanelProps) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Background</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.bgColor as string) || "#f3f4f6"} onChange={(e) => onChange({ bgColor: e.target.value })} />
          <button type="button" className="text-xs text-gray-500 hover:text-gray-700" onClick={() => onChange({ bgColor: "transparent" })}>Clear</button>
        </div>
      </label>
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gradient</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.bgGradientFrom as string) || "#ffffff"} onChange={(e) => onChange({ bgGradientFrom: e.target.value })} />
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.bgGradientTo as string) || "#ffffff"} onChange={(e) => onChange({ bgGradientTo: e.target.value })} />
          <span className="text-xs text-gray-400">From / To</span>
          <button type="button" className="text-xs text-gray-500 hover:text-gray-700" onClick={() => onChange({ bgGradientFrom: "", bgGradientTo: "" })}>Clear</button>
        </div>
      </div>

      {/* ── Background Image Upload ── */}
      <ImageUploadWidget
        value={(props.bgImage as string) || ""}
        onChange={(url) => onChange({ bgImage: url })}
        label="Background Image"
        compact
      />

      {/* Image controls (visible when image is set) */}
      {(props.bgImage as string) && (
        <div className="space-y-2 ml-1 pl-2 border-l-2 border-blue-100">
          <label className="block">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Image Fit</span>
            <select
              className="mt-0.5 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
              value={(props.bgSize as string) || "cover"}
              onChange={(e) => onChange({ bgSize: e.target.value })}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Position</span>
            <select
              className="mt-0.5 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
              value={(props.bgPosition as string) || "center"}
              onChange={(e) => onChange({ bgPosition: e.target.value })}
            >
              <option value="center">Center</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="top left">Top Left</option>
              <option value="top right">Top Right</option>
              <option value="bottom left">Bottom Left</option>
              <option value="bottom right">Bottom Right</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Overlay Color</span>
            <div className="flex gap-2 items-center mt-0.5">
              <input type="color" className="h-6 w-6 cursor-pointer rounded border border-gray-200" value={(props.overlayColor as string) || "#000000"} onChange={(e) => onChange({ overlayColor: e.target.value })} />
              <input
                type="range"
                className="flex-1"
                value={((props.overlayOpacity as number) ?? 0.5) * 100}
                onChange={(e) => onChange({ overlayOpacity: Number(e.target.value) / 100 })}
                min={0}
                max={100}
              />
              <span className="text-[10px] text-gray-400 w-8 text-right">
                {Math.round(((props.overlayOpacity as number) ?? 0.5) * 100)}%
              </span>
              <button type="button" className="text-[10px] text-gray-400 hover:text-gray-600" onClick={() => onChange({ overlayColor: "" })}>Clear</button>
            </div>
          </label>
        </div>
      )}

      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border Radius</span>
        <input type="number" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.borderRadius as number) || 0} onChange={(e) => onChange({ borderRadius: Number(e.target.value) })} min={0} max={999} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.borderColor as string) || "#e5e7eb"} onChange={(e) => onChange({ borderColor: e.target.value })} />
          <input type="number" className="w-16 rounded-md border border-gray-200 bg-white px-2 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.borderWidth as number) || 0} onChange={(e) => onChange({ borderWidth: Number(e.target.value) })} min={0} max={10} />
          <span className="text-xs text-gray-400">px</span>
        </div>
      </label>
    </div>
  );
}

registerElement({
  type: "container",
  label: "Container",
  icon: "📦",
  category: "layout",
  defaultProps: {
    bgColor: "transparent",
    borderRadius: 0,
    borderColor: "transparent",
    borderWidth: 0,
    padding: 0,
    bgGradientFrom: "",
    bgGradientTo: "",
    bgImage: "",
    bgSize: "cover",
    bgPosition: "center",
    overlayColor: "",
    overlayOpacity: 0.5,
  },
  defaultTransform: { width: 500, height: 400 },
  component: ContainerElementComponent,
  propertyPanel: ContainerPropertyPanel,
});
