/* ─────────────────────────────────────────────
 * Social Icon Group Element
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";

const SOCIAL_ICONS: Record<string, string> = {
  twitter: "𝕏",
  facebook: "f",
  instagram: "📷",
  linkedin: "in",
  github: "⌘",
  youtube: "▶",
  tiktok: "♪",
};

function SocialGroupComponent({ props, scaleFactor = 1 }: ElementRenderProps) {
  const platforms = (props.platforms as string[]) || ["twitter", "instagram", "linkedin"];
  const iconSize = (props.iconSize as number) || 36;
  const gap = (props.gap as number) || 12;
  const iconColor = (props.iconColor as string) || "#ffffff";
  const iconBg = (props.iconBg as string) || "#1a1a2e";
  const borderRadius = (props.borderRadius as number) || 999;

  const s = scaleFactor;
  const scaledIconSize = Math.round(iconSize * s);
  const scaledGap = Math.round(gap * s);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: scaledGap, flexWrap: "wrap" }}>
      {platforms.map((platform: string) => (
        <div
          key={platform}
          style={{
            width: scaledIconSize,
            height: scaledIconSize,
            borderRadius,
            backgroundColor: iconBg,
            color: iconColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: scaledIconSize * 0.45,
            fontWeight: 700,
            cursor: "pointer",
            transition: "transform 0.15s ease",
          }}
        >
          {SOCIAL_ICONS[platform] || platform[0]?.toUpperCase()}
        </div>
      ))}
    </div>
  );
}

function SocialGroupPropertyPanel({ props, onChange }: PropertyPanelProps) {
  const platforms = (props.platforms as string[]) || [];
  const allPlatforms = Object.keys(SOCIAL_ICONS);

  const togglePlatform = (p: string) => {
    if (platforms.includes(p)) {
      onChange({ platforms: platforms.filter((x: string) => x !== p) });
    } else {
      onChange({ platforms: [...platforms, p] });
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Platforms</span>
        <div className="mt-1 flex flex-wrap gap-1">
          {allPlatforms.map((p) => (
            <button
              key={p}
              type="button"
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                platforms.includes(p) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => togglePlatform(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Icon Size</span>
        <input type="number" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.iconSize as number) || 36} onChange={(e) => onChange({ iconSize: Number(e.target.value) })} min={16} max={80} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gap</span>
        <input type="number" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" value={(props.gap as number) || 12} onChange={(e) => onChange({ gap: Number(e.target.value) })} min={0} max={40} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Icon Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.iconColor as string) || "#ffffff"} onChange={(e) => onChange({ iconColor: e.target.value })} />
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200" value={(props.iconBg as string) || "#1a1a2e"} onChange={(e) => onChange({ iconBg: e.target.value })} />
          <span className="text-xs text-gray-400">Icon / BG</span>
        </div>
      </label>
    </div>
  );
}

registerElement({
  type: "social-group",
  label: "Social Icons",
  icon: "🔗",
  category: "social",
  defaultProps: { platforms: ["twitter", "instagram", "linkedin"], iconSize: 36, gap: 12, iconColor: "#ffffff", iconBg: "#1a1a2e", borderRadius: 999 },
  defaultTransform: { width: 200, height: 48 },
  component: SocialGroupComponent,
  propertyPanel: SocialGroupPropertyPanel,
});
