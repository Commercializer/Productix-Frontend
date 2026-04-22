/* ─────────────────────────────────────────────
 * Slot Machine Element — A simple block showing a slot machine
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { Gamepad2 } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";

function SlotMachineComponent({ props, scaleFactor = 1 }: ElementRenderProps) {
  const title = (props.title as string) || "Spin to Win!";
  const ctaText = (props.ctaText as string) || "Spin Now";
  const bgColor = (props.bgColor as string) || "#4f46e5";
  const textColor = (props.textColor as string) || "#ffffff";
  const slotBg = (props.slotBg as string) || "#ffffff";
  const borderRadius = (props.borderRadius as number) || 24;
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
        justifyContent: "space-between",
        padding: Math.round(24 * s),
        textAlign: "center",
        boxShadow: "inset 0 0 0 6px rgba(255,255,255,0.2), 0 10px 25px -5px rgba(0, 0, 0, 0.2)",
      }}
    >
      <h3 style={{ fontSize: Math.round(24 * s), fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>{title}</h3>
      
      {/* Slots Container */}
      <div 
        style={{ 
          display: "flex", 
          gap: Math.round(12 * s), 
          backgroundColor: "rgba(0,0,0,0.5)", 
          padding: Math.round(12 * s), 
          borderRadius: Math.round(16 * s),
          width: "100%",
          justifyContent: "center",
          boxShadow: "inset 0 4px 10px rgba(0,0,0,0.8)"
        }}
      >
        {["🎰", "🍒", "💎"].map((emoji, i) => (
          <div 
            key={i} 
            style={{ 
              width: Math.round(60 * s), 
              height: Math.round(70 * s), 
              backgroundColor: slotBg, 
              borderRadius: Math.round(8 * s),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: Math.round(32 * s),
              boxShadow: "0 4px 0 rgba(0,0,0,0.2)"
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <button
        style={{
          backgroundColor: "#eab308",
          color: "#000",
          border: "none",
          padding: `${Math.round(14 * s)}px ${Math.round(32 * s)}px`,
          borderRadius: Math.round(30 * s),
          fontSize: Math.round(18 * s),
          fontWeight: 800,
          textTransform: "uppercase",
          cursor: "pointer",
          boxShadow: "0 6px 0 #ca8a04",
          transform: "translateY(0)",
          transition: "all 0.1s"
        }}
      >
        {ctaText}
      </button>
    </div>
  );
}

function SlotMachinePropertyPanel({ props, onChange }: PropertyPanelProps) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</span>
        <input type="text" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.title as string) || ""} onChange={(e) => onChange({ title: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">CTA Text</span>
        <input type="text" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.ctaText as string) || ""} onChange={(e) => onChange({ ctaText: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Machine Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.bgColor as string) || "#4f46e5"} onChange={(e) => onChange({ bgColor: e.target.value })} />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Slot Background</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.slotBg as string) || "#ffffff"} onChange={(e) => onChange({ slotBg: e.target.value })} />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border Radius</span>
        <input type="number" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.borderRadius as number) || 24} onChange={(e) => onChange({ borderRadius: Number(e.target.value) })} min={0} max={50} />
      </label>
    </div>
  );
}

registerElement({
  type: "slot-machine",
  label: "Slot Machine",
  icon: <Gamepad2 size={16} />,
  category: "gaming",
  defaultProps: {
    title: "Spin to Win!",
    ctaText: "Spin Now",
    bgColor: "#4f46e5",
    textColor: "#ffffff",
    slotBg: "#ffffff",
    borderRadius: 24,
  },
  defaultTransform: { width: 320, height: 260 },
  component: SlotMachineComponent,
  propertyPanel: SlotMachinePropertyPanel,
});
