/* ─────────────────────────────────────────────
 * Card Element - Container with background, shadow, border
 *
 * Now supports background images via the reusable
 * ImageUploadWidget (drag-drop, file picker, library).
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { LayoutDashboard } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { ImageUploadWidget } from "../media/image-upload-widget";
import { HexColorPopover } from "./hex-color-popover";

/* ─── Component ─────────────────────────────── */

function CardElementComponent({ props, scaleFactor = 1 }: ElementRenderProps) {
  const bgColor = (props.bgColor as string) || "#ffffff";
  const borderRadius = (props.borderRadius as number) || 16;
  const shadow = (props.shadow as string) || "lg";
  const borderColor = (props.borderColor as string) || "transparent";
  const borderWidth = (props.borderWidth as number) || 0;
  const padding = (props.padding as number) || 24;
  const bgImage = (props.bgImage as string) || "";
  const overlayColor = (props.overlayColor as string) || "";
  const opacity = (props.bgOpacity as number) ?? 1;
  const bgSize = (props.bgSize as string) || "cover";
  const bgPosition = (props.bgPosition as string) || "center";

  const shadowMap: Record<string, string> = {
    none: "none",
    sm: "0 1px 3px rgba(0,0,0,0.08)",
    md: "0 4px 12px rgba(0,0,0,0.1)",
    lg: "0 8px 30px rgba(0,0,0,0.12)",
    xl: "0 16px 48px rgba(0,0,0,0.16)",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius,
        backgroundColor: bgColor,
        boxShadow: shadowMap[shadow] || shadowMap.md,
        border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
        padding: Math.round(padding * scaleFactor),
        overflow: "hidden",
        position: "relative",
        opacity,
      }}
    >
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
          }}
        />
      )}
      {overlayColor && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: overlayColor,
            borderRadius,
          }}
        />
      )}
    </div>
  );
}

/* ─── Property Panel ────────────────────────── */

function CardPropertyPanel({ props, onChange }: PropertyPanelProps) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Background</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover
            value={(props.bgColor as string) || ""}
            onChange={(hex) => onChange({ bgColor: hex })}
            fallback="#ffffff"
          />
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={(props.bgColor as string) || "#ffffff"}
            onChange={(e) => onChange({ bgColor: e.target.value })}
          />
        </div>
      </label>

      {/* ── Background Image Upload ── */}
      <ImageUploadWidget
        value={(props.bgImage as string) || ""}
        onChange={(url) => onChange({ bgImage: url })}
        label="Background Image"
        compact
      />

      {/* Background image controls (only visible when image is set) */}
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
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Image Position</span>
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
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Overlay</span>
            <div className="mt-0.5 flex gap-2 items-center">
              <HexColorPopover
                value={((props.overlayColor as string) || "").slice(0, 7)}
                onChange={(hex) => onChange({ overlayColor: hex + "80" })}
                fallback="#000000"
              />
              <button
                type="button"
                className="text-[10px] text-gray-400 hover:text-gray-600"
                onClick={() => onChange({ overlayColor: "" })}
              >
                Clear
              </button>
            </div>
          </label>
        </div>
      )}

      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border Radius</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.borderRadius as number) || 16}
          onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          min={0}
          max={999}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Shadow</span>
        <select
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.shadow as string) || "lg"}
          onChange={(e) => onChange({ shadow: e.target.value })}
        >
          <option value="none">None</option>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">Extra Large</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover
            value={(props.borderColor as string) || ""}
            onChange={(hex) => onChange({ borderColor: hex })}
            fallback="#e5e7eb"
          />
          <input
            type="number"
            className="w-16 rounded-md border border-gray-200 bg-white px-2 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={(props.borderWidth as number) || 0}
            onChange={(e) => onChange({ borderWidth: Number(e.target.value) })}
            min={0}
            max={10}
            placeholder="px"
          />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Padding</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.padding as number) || 24}
          onChange={(e) => onChange({ padding: Number(e.target.value) })}
          min={0}
          max={100}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Opacity</span>
        <input
          type="range"
          className="mt-1 w-full"
          value={((props.bgOpacity as number) ?? 1) * 100}
          onChange={(e) => onChange({ bgOpacity: Number(e.target.value) / 100 })}
          min={0}
          max={100}
        />
        <span className="text-xs text-gray-400">{Math.round(((props.bgOpacity as number) ?? 1) * 100)}%</span>
      </label>
    </div>
  );
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "card",
  label: "Card",
  icon: <LayoutDashboard size={16} />,
  category: "layout",
  defaultProps: {
    bgColor: "#ffffff",
    borderRadius: 16,
    shadow: "lg",
    borderColor: "transparent",
    borderWidth: 0,
    padding: 24,
    bgImage: "",
    bgSize: "cover",
    bgPosition: "center",
    overlayColor: "",
    bgOpacity: 1,
  },
  defaultTransform: { width: 360, height: 240 },
  component: CardElementComponent,
  propertyPanel: CardPropertyPanel,
});
