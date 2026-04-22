/* ─────────────────────────────────────────────
 * Social Icon Element — Single draggable social
 * media icon (Facebook, Instagram, X/Twitter,
 * LinkedIn, YouTube, TikTok, GitHub, WhatsApp,
 * Snapchat, Pinterest, Threads)
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Github,
  Music2,
  MessageCircle,
  AtSign,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";

/* ─── Platform Config ────────────────────────── */

interface PlatformConfig {
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  defaultBg: string;
  defaultColor: string;
}

const PLATFORMS: Record<string, PlatformConfig> = {
  facebook:  { label: "Facebook",  icon: Facebook,       defaultBg: "#1877F2", defaultColor: "#ffffff" },
  instagram: { label: "Instagram", icon: Instagram,      defaultBg: "#E4405F", defaultColor: "#ffffff" },
  twitter:   { label: "X / Twitter", icon: Twitter,      defaultBg: "#000000", defaultColor: "#ffffff" },
  linkedin:  { label: "LinkedIn",  icon: Linkedin,       defaultBg: "#0A66C2", defaultColor: "#ffffff" },
  youtube:   { label: "YouTube",   icon: Youtube,        defaultBg: "#FF0000", defaultColor: "#ffffff" },
  tiktok:    { label: "TikTok",    icon: Music2,         defaultBg: "#000000", defaultColor: "#ffffff" },
  github:    { label: "GitHub",    icon: Github,         defaultBg: "#24292e", defaultColor: "#ffffff" },
  whatsapp:  { label: "WhatsApp",  icon: MessageCircle,  defaultBg: "#25D366", defaultColor: "#ffffff" },
  threads:   { label: "Threads",   icon: AtSign,         defaultBg: "#000000", defaultColor: "#ffffff" },
  website:   { label: "Website",   icon: Globe,          defaultBg: "#1a1a2e", defaultColor: "#ffffff" },
  email:     { label: "Email",     icon: Mail,           defaultBg: "#6b7280", defaultColor: "#ffffff" },
  phone:     { label: "Phone",     icon: Phone,          defaultBg: "#10b981", defaultColor: "#ffffff" },
};

/* ─── Component ──────────────────────────────── */

function SocialIconComponent({ props, scaleFactor = 1 }: ElementRenderProps) {
  const platform = (props.platform as string) || "instagram";
  const bgColor = (props.bgColor as string) || PLATFORMS[platform]?.defaultBg || "#1a1a2e";
  const iconColor = (props.iconColor as string) || PLATFORMS[platform]?.defaultColor || "#ffffff";
  const borderRadius = (props.borderRadius as number) ?? 999;
  const iconScale = (props.iconScale as number) || 0.5;
  const variant = (props.variant as string) || "filled";
  const url = (props.url as string) || "";

  const config = PLATFORMS[platform];
  const IconComp = config?.icon || Globe;

  const s = scaleFactor;

  const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Math.round(borderRadius * s),
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    cursor: url ? "pointer" : "default",
    ...(variant === "filled"
      ? { backgroundColor: bgColor, color: iconColor }
      : variant === "outline"
        ? { backgroundColor: "transparent", border: `2px solid ${bgColor}`, color: bgColor }
        : { backgroundColor: "transparent", color: bgColor }
    ),
    ...(variant === "filled" && {
      boxShadow: `0 2px 8px ${bgColor}33`,
    }),
  };

  return (
    <div style={containerStyle}>
      <IconComp
        size={Math.round(Math.min(100, 48) * iconScale * s * 2)}
        color="currentColor"
        strokeWidth={1.8}
      />
    </div>
  );
}

/* ─── Property Panel ─────────────────────────── */

function SocialIconPropertyPanel({ props, onChange }: PropertyPanelProps) {
  const currentPlatform = (props.platform as string) || "instagram";

  const handlePlatformChange = (platform: string) => {
    const config = PLATFORMS[platform];
    if (config) {
      onChange({
        platform,
        bgColor: config.defaultBg,
        iconColor: config.defaultColor,
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Platform Picker */}
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Platform</span>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {Object.entries(PLATFORMS).map(([key, config]) => {
            const isActive = currentPlatform === key;
            const Icon = config.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handlePlatformChange(key)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  padding: "8px 4px",
                  borderRadius: 10,
                  border: isActive ? "1.5px solid #0ea5e9" : "1px solid #e5e7eb",
                  background: isActive ? "#e0f2fe" : "#fafafa",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    backgroundColor: config.defaultBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={14} color={config.defaultColor} />
                </div>
                <span style={{
                  fontSize: 8,
                  fontWeight: 600,
                  color: isActive ? "#0ea5e9" : "#6b7280",
                  textAlign: "center",
                  lineHeight: 1.1,
                }}>
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Variant */}
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Style</span>
        <div className="mt-1 flex gap-1">
          {(["filled", "outline", "ghost"] as const).map((v) => (
            <button
              key={v}
              type="button"
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                (props.variant || "filled") === v
                  ? "bg-sky-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => onChange({ variant: v })}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </label>

      {/* URL */}
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Link URL</span>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none"
          placeholder="https://instagram.com/yourhandle"
          value={(props.url as string) || ""}
          onChange={(e) => onChange({ url: e.target.value })}
        />
      </label>

      {/* Colors */}
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Colors</span>
        <div className="mt-1 flex gap-2 items-center">
          <div className="flex flex-col items-center gap-0.5">
            <input
              type="color"
              className="h-8 w-8 cursor-pointer rounded border border-gray-200"
              value={(props.bgColor as string) || "#1877F2"}
              onChange={(e) => onChange({ bgColor: e.target.value })}
            />
            <span className="text-[9px] text-gray-400">BG</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <input
              type="color"
              className="h-8 w-8 cursor-pointer rounded border border-gray-200"
              value={(props.iconColor as string) || "#ffffff"}
              onChange={(e) => onChange({ iconColor: e.target.value })}
            />
            <span className="text-[9px] text-gray-400">Icon</span>
          </div>
        </div>
      </label>

      {/* Border Radius */}
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Corner Radius</span>
        <div className="mt-1 flex gap-2 items-center">
          <input
            type="range"
            className="flex-1"
            style={{ accentColor: "#0ea5e9" }}
            value={(props.borderRadius as number) ?? 999}
            onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
            min={0}
            max={999}
          />
          <span className="text-xs text-gray-400 w-8 text-right">{(props.borderRadius as number) ?? 999}</span>
        </div>
      </label>

      {/* Icon Scale */}
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Icon Size</span>
        <div className="mt-1 flex gap-2 items-center">
          <input
            type="range"
            className="flex-1"
            style={{ accentColor: "#0ea5e9" }}
            value={((props.iconScale as number) || 0.5) * 100}
            onChange={(e) => onChange({ iconScale: Number(e.target.value) / 100 })}
            min={20}
            max={90}
          />
          <span className="text-xs text-gray-400 w-8 text-right">{Math.round(((props.iconScale as number) || 0.5) * 100)}%</span>
        </div>
      </label>
    </div>
  );
}

/* ─── Registration — one per platform ────────── */

Object.entries(PLATFORMS).forEach(([key, config]) => {
  const Icon = config.icon;
  registerElement({
    type: `social-${key}`,
    label: config.label,
    icon: <Icon size={16} />,
    category: "social",
    defaultProps: {
      platform: key,
      bgColor: config.defaultBg,
      iconColor: config.defaultColor,
      borderRadius: 999,
      iconScale: 0.5,
      variant: "filled",
      url: "",
    },
    defaultTransform: { width: 48, height: 48 },
    component: SocialIconComponent,
    propertyPanel: SocialIconPropertyPanel,
  });
});
