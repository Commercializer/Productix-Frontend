/* ─────────────────────────────────────────────
 * Stat Card Element — Metric display
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";

function StatCardComponent({ props, scaleFactor = 1 }: ElementRenderProps) {
  const value = (props.value as string) || "0";
  const label = (props.label as string) || "Metric";
  const trend = (props.trend as string) || "";
  const icon = (props.icon as string) || "📊";
  const bgColor = (props.bgColor as string) || "#ffffff";
  const valueColor = (props.valueColor as string) || "#1a1a2e";
  const labelColor = (props.labelColor as string) || "#6b7280";
  const borderRadius = (props.borderRadius as number) || 16;
  const shadow = (props.shadow as string) || "md";

  const shadowMap: Record<string, string> = {
    none: "none",
    sm: "0 1px 3px rgba(0,0,0,0.08)",
    md: "0 4px 12px rgba(0,0,0,0.1)",
    lg: "0 8px 30px rgba(0,0,0,0.12)",
  };

  const s = scaleFactor;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: bgColor,
        borderRadius,
        boxShadow: shadowMap[shadow] || shadowMap.md,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: Math.round(16 * s),
        gap: Math.round(4 * s),
      }}
    >
      <span style={{ fontSize: Math.round(24 * s) }}>{icon}</span>
      <span style={{ fontSize: Math.round(28 * s), fontWeight: 800, color: valueColor, letterSpacing: "-0.02em" }}>{value}</span>
      <span style={{ fontSize: Math.round(12 * s), fontWeight: 500, color: labelColor, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      {trend && (
        <span
          style={{
            fontSize: Math.round(11 * s),
            fontWeight: 600,
            color: trend.startsWith("-") ? "#ef4444" : "#22c55e",
            marginTop: Math.round(2 * s),
          }}
        >
          {trend}
        </span>
      )}
    </div>
  );
}

function StatCardPropertyPanel({ props, onChange }: PropertyPanelProps) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Value</span>
        <input type="text" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.value as string) || ""} onChange={(e) => onChange({ value: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Label</span>
        <input type="text" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.label as string) || ""} onChange={(e) => onChange({ label: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trend</span>
        <input type="text" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.trend as string) || ""} onChange={(e) => onChange({ trend: e.target.value })} placeholder="+12%" />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Icon</span>
        <input type="text" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.icon as string) || ""} onChange={(e) => onChange({ icon: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Background</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.bgColor as string) || "#ffffff"} onChange={(e) => onChange({ bgColor: e.target.value })} />
          <input type="text" className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.bgColor as string) || "#ffffff"} onChange={(e) => onChange({ bgColor: e.target.value })} />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Value Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.valueColor as string) || "#1a1a2e"} onChange={(e) => onChange({ valueColor: e.target.value })} />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Shadow</span>
        <select className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.shadow as string) || "md"} onChange={(e) => onChange({ shadow: e.target.value })}>
          <option value="none">None</option>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </label>
    </div>
  );
}

registerElement({
  type: "stat-card",
  label: "Stat Card",
  icon: "📊",
  category: "promotional",
  defaultProps: { value: "10K+", label: "Users", trend: "+24%", icon: "📊", bgColor: "#ffffff", valueColor: "#1a1a2e", labelColor: "#6b7280", borderRadius: 16, shadow: "md" },
  defaultTransform: { width: 160, height: 160 },
  component: StatCardComponent,
  propertyPanel: StatCardPropertyPanel,
});
