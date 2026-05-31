/* ─────────────────────────────────────────────
 * Social Icon Group Element
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import {
  Share2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Music2,
  MessageCircle,
  AtSign,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { HexColorPopover } from "./hex-color-popover";

/* ─── Platform icon map ──────────────────────── */

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  twitter:   Twitter,
  facebook:  Facebook,
  instagram: Instagram,
  linkedin:  Linkedin,
  github:    Github,
  youtube:   Youtube,
  tiktok:    Music2,
  whatsapp:  MessageCircle,
  threads:   AtSign,
  website:   Globe,
  email:     Mail,
  phone:     Phone,
};

const PLATFORM_LABELS: Record<string, string> = {
  twitter: "X / Twitter",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  github: "GitHub",
  youtube: "YouTube",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
  threads: "Threads",
  website: "Website",
  email: "Email",
  phone: "Phone",
};

function SocialGroupComponent({ props, isEditing, scaleFactor = 1 }: ElementRenderProps) {
  const platforms = (props.platforms as string[]) || ["twitter", "instagram", "linkedin"];
  const links = (props.links as Record<string, string>) || {};
  const iconSize = (props.iconSize as number) || 36;
  const gap = (props.gap as number) || 12;
  const iconColor = (props.iconColor as string) || "#ffffff";
  const iconBg = (props.iconBg as string) || "#1a1a2e";
  const borderRadius = (props.borderRadius as number) || 999;

  const s = scaleFactor;
  const scaledIconSize = Math.round(iconSize * s);
  const scaledGap = Math.round(gap * s);
  const lucideSize = Math.round(scaledIconSize * 0.5);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: scaledGap, flexWrap: "wrap" }}>
      {platforms.map((platform: string) => {
        const IconComp = SOCIAL_ICONS[platform] || Globe;
        const url = links[platform] || "";
        const iconStyle: React.CSSProperties = {
          width: scaledIconSize,
          height: scaledIconSize,
          borderRadius,
          backgroundColor: iconBg,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "transform 0.15s ease",
          textDecoration: "none",
        };

        if (!isEditing && url) {
          return (
            <a key={platform} href={url} target="_blank" rel="noopener noreferrer" style={iconStyle}>
              <IconComp size={lucideSize} color={iconColor} strokeWidth={1.8} />
            </a>
          );
        }

        return (
          <div key={platform} style={iconStyle}>
            <IconComp size={lucideSize} color={iconColor} strokeWidth={1.8} />
          </div>
        );
      })}
    </div>
  );
}

const PLATFORM_URL_PLACEHOLDERS: Record<string, string> = {
  twitter: "https://x.com/yourhandle",
  facebook: "https://facebook.com/yourpage",
  instagram: "https://instagram.com/yourhandle",
  linkedin: "https://linkedin.com/in/you",
  github: "https://github.com/you",
  youtube: "https://youtube.com/@yourchannel",
  tiktok: "https://tiktok.com/@yourhandle",
  whatsapp: "https://wa.me/15551234567",
  threads: "https://threads.net/@yourhandle",
  website: "https://yoursite.com",
  email: "mailto:you@example.com",
  phone: "tel:+15551234567",
};

function SocialGroupPropertyPanel({ props, onChange }: PropertyPanelProps) {
  const platforms = (props.platforms as string[]) || [];
  const links = (props.links as Record<string, string>) || {};
  const allPlatforms = Object.keys(SOCIAL_ICONS);

  const togglePlatform = (p: string) => {
    if (platforms.includes(p)) {
      onChange({ platforms: platforms.filter((x: string) => x !== p) });
    } else {
      onChange({ platforms: [...platforms, p] });
    }
  };

  const setLink = (p: string, url: string) => {
    onChange({ links: { ...links, [p]: url } });
  };

  return (
    <div className="space-y-3">
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Platforms</span>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {allPlatforms.map((p) => {
            const isActive = platforms.includes(p);
            const IconComp = SOCIAL_ICONS[p] || Globe;
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 8px",
                  borderRadius: 8,
                  border: isActive ? "1.5px solid #0ea5e9" : "1px solid #e5e7eb",
                  background: isActive ? "#e0f2fe" : "#fafafa",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontSize: 10,
                  fontWeight: 600,
                  color: isActive ? "#0ea5e9" : "#6b7280",
                }}
              >
                <IconComp size={13} />
                {PLATFORM_LABELS[p] || p}
              </button>
            );
          })}
        </div>
      </div>
      {platforms.length > 0 && (
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Links</span>
          <div className="mt-2 space-y-2">
            {platforms.map((p) => {
              const IconComp = SOCIAL_ICONS[p] || Globe;
              return (
                <div key={p} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-500" title={PLATFORM_LABELS[p] || p}>
                    <IconComp size={14} />
                  </div>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none"
                    placeholder={PLATFORM_URL_PLACEHOLDERS[p] || "https://..."}
                    value={links[p] || ""}
                    onChange={(e) => setLink(p, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Icon Size</span>
        <input type="number" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none" value={(props.iconSize as number) || 36} onChange={(e) => onChange({ iconSize: Number(e.target.value) })} min={16} max={80} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gap</span>
        <input type="number" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none" value={(props.gap as number) || 12} onChange={(e) => onChange({ gap: Number(e.target.value) })} min={0} max={40} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Colors</span>
        <div className="mt-1 flex gap-3 items-center">
          <div className="flex flex-col items-center gap-0.5">
            <HexColorPopover value={(props.iconColor as string) || ""} onChange={(hex) => onChange({ iconColor: hex })} fallback="#ffffff" />
            <span className="text-[9px] text-gray-400">Icon</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <HexColorPopover value={(props.iconBg as string) || ""} onChange={(hex) => onChange({ iconBg: hex })} fallback="#1a1a2e" />
            <span className="text-[9px] text-gray-400">BG</span>
          </div>
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Corner Radius</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.borderRadius as number) ?? 999}
          onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          min={0}
          max={999}
        />
      </label>
    </div>
  );
}

registerElement({
  type: "social-group",
  label: "Social Icons",
  icon: <Share2 size={16} />,
  category: "social",
  defaultProps: { platforms: ["twitter", "instagram", "linkedin"], links: {}, iconSize: 36, gap: 12, iconColor: "#ffffff", iconBg: "#1a1a2e", borderRadius: 999 },
  defaultTransform: { width: 200, height: 48 },
  component: SocialGroupComponent,
  propertyPanel: SocialGroupPropertyPanel,
});
