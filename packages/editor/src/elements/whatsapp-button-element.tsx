/* ─────────────────────────────────────────────
 * WhatsApp Button Element - CTA button that opens
 * a wa.me chat for the configured phone number.
 * Lives in the "Engagement" (interactive) category.
 * ──────────────────────────────────────────── */

"use client";

import React, { useMemo, useState } from "react";
import { MessageCircle, ChevronDown, Search } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { HexColorPopover } from "./hex-color-popover";

/** True when running inside the editor canvas. */
function isInsideEditor(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !!(window as unknown as Record<string, unknown>).__productixEditor;
  } catch {
    return false;
  }
}

/* ─── Country dial codes ─────────────────────── */

interface Country {
  iso: string;
  name: string;
  dial: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { iso: "US", name: "United States", dial: "1",    flag: "🇺🇸" },
  { iso: "GB", name: "United Kingdom",dial: "44",   flag: "🇬🇧" },
  { iso: "CA", name: "Canada",        dial: "1",    flag: "🇨🇦" },
  { iso: "AU", name: "Australia",     dial: "61",   flag: "🇦🇺" },
  { iso: "NZ", name: "New Zealand",   dial: "64",   flag: "🇳🇿" },
  { iso: "IE", name: "Ireland",       dial: "353",  flag: "🇮🇪" },
  { iso: "IN", name: "India",         dial: "91",   flag: "🇮🇳" },
  { iso: "LK", name: "Sri Lanka",     dial: "94",   flag: "🇱🇰" },
  { iso: "PK", name: "Pakistan",      dial: "92",   flag: "🇵🇰" },
  { iso: "BD", name: "Bangladesh",    dial: "880",  flag: "🇧🇩" },
  { iso: "NP", name: "Nepal",         dial: "977",  flag: "🇳🇵" },
  { iso: "SG", name: "Singapore",     dial: "65",   flag: "🇸🇬" },
  { iso: "MY", name: "Malaysia",      dial: "60",   flag: "🇲🇾" },
  { iso: "ID", name: "Indonesia",     dial: "62",   flag: "🇮🇩" },
  { iso: "PH", name: "Philippines",   dial: "63",   flag: "🇵🇭" },
  { iso: "TH", name: "Thailand",      dial: "66",   flag: "🇹🇭" },
  { iso: "VN", name: "Vietnam",       dial: "84",   flag: "🇻🇳" },
  { iso: "HK", name: "Hong Kong",     dial: "852",  flag: "🇭🇰" },
  { iso: "TW", name: "Taiwan",        dial: "886",  flag: "🇹🇼" },
  { iso: "CN", name: "China",         dial: "86",   flag: "🇨🇳" },
  { iso: "JP", name: "Japan",         dial: "81",   flag: "🇯🇵" },
  { iso: "KR", name: "South Korea",   dial: "82",   flag: "🇰🇷" },
  { iso: "AE", name: "UAE",           dial: "971",  flag: "🇦🇪" },
  { iso: "SA", name: "Saudi Arabia",  dial: "966",  flag: "🇸🇦" },
  { iso: "QA", name: "Qatar",         dial: "974",  flag: "🇶🇦" },
  { iso: "KW", name: "Kuwait",        dial: "965",  flag: "🇰🇼" },
  { iso: "BH", name: "Bahrain",       dial: "973",  flag: "🇧🇭" },
  { iso: "OM", name: "Oman",          dial: "968",  flag: "🇴🇲" },
  { iso: "IL", name: "Israel",        dial: "972",  flag: "🇮🇱" },
  { iso: "TR", name: "Turkey",        dial: "90",   flag: "🇹🇷" },
  { iso: "EG", name: "Egypt",         dial: "20",   flag: "🇪🇬" },
  { iso: "ZA", name: "South Africa",  dial: "27",   flag: "🇿🇦" },
  { iso: "NG", name: "Nigeria",       dial: "234",  flag: "🇳🇬" },
  { iso: "KE", name: "Kenya",         dial: "254",  flag: "🇰🇪" },
  { iso: "GH", name: "Ghana",         dial: "233",  flag: "🇬🇭" },
  { iso: "MA", name: "Morocco",       dial: "212",  flag: "🇲🇦" },
  { iso: "DE", name: "Germany",       dial: "49",   flag: "🇩🇪" },
  { iso: "FR", name: "France",        dial: "33",   flag: "🇫🇷" },
  { iso: "ES", name: "Spain",         dial: "34",   flag: "🇪🇸" },
  { iso: "IT", name: "Italy",         dial: "39",   flag: "🇮🇹" },
  { iso: "PT", name: "Portugal",      dial: "351",  flag: "🇵🇹" },
  { iso: "NL", name: "Netherlands",   dial: "31",   flag: "🇳🇱" },
  { iso: "BE", name: "Belgium",       dial: "32",   flag: "🇧🇪" },
  { iso: "CH", name: "Switzerland",   dial: "41",   flag: "🇨🇭" },
  { iso: "AT", name: "Austria",       dial: "43",   flag: "🇦🇹" },
  { iso: "SE", name: "Sweden",        dial: "46",   flag: "🇸🇪" },
  { iso: "NO", name: "Norway",        dial: "47",   flag: "🇳🇴" },
  { iso: "DK", name: "Denmark",       dial: "45",   flag: "🇩🇰" },
  { iso: "FI", name: "Finland",       dial: "358",  flag: "🇫🇮" },
  { iso: "PL", name: "Poland",        dial: "48",   flag: "🇵🇱" },
  { iso: "CZ", name: "Czech Republic",dial: "420",  flag: "🇨🇿" },
  { iso: "GR", name: "Greece",        dial: "30",   flag: "🇬🇷" },
  { iso: "RU", name: "Russia",        dial: "7",    flag: "🇷🇺" },
  { iso: "UA", name: "Ukraine",       dial: "380",  flag: "🇺🇦" },
  { iso: "BR", name: "Brazil",        dial: "55",   flag: "🇧🇷" },
  { iso: "MX", name: "Mexico",        dial: "52",   flag: "🇲🇽" },
  { iso: "AR", name: "Argentina",     dial: "54",   flag: "🇦🇷" },
  { iso: "CL", name: "Chile",         dial: "56",   flag: "🇨🇱" },
  { iso: "CO", name: "Colombia",      dial: "57",   flag: "🇨🇴" },
  { iso: "PE", name: "Peru",          dial: "51",   flag: "🇵🇪" },
];

function getCountry(iso: string): Country {
  return COUNTRIES.find((c) => c.iso === iso) || COUNTRIES[0]!;
}

/** Strip everything except digits. */
function digitsOnly(input: string): string {
  return (input || "").replace(/\D+/g, "");
}

/** Build the wa.me URL. Returns "" if there's no phone number. */
function buildWaMeUrl(dial: string, phone: string, message: string): string {
  const number = `${digitsOnly(dial)}${digitsOnly(phone)}`;
  if (!number) return "";
  const base = `https://wa.me/${number}`;
  const msg = (message || "").slice(0, WA_MESSAGE_MAX).trim();
  return msg ? `${base}?text=${encodeURIComponent(msg)}` : base;
}

/**
 * WhatsApp's wa.me API itself has no documented hard cap, but encoded long
 * messages can blow past browser URL limits and get truncated. 1000 chars is
 * a safe, generous standard length that fits comfortably in any URL.
 */
const WA_MESSAGE_MAX = 1000;
const WA_MESSAGE_WARN = 900;

/* ─── WhatsApp brand glyph (filled) ────────── */

function WhatsAppGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.27-1.38a9.9 9.9 0 0 0 4.72 1.2h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01zM12.05 20.15h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.21 8.21 0 0 1-1.26-4.37c0-4.54 3.69-8.23 8.23-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.2 8.23zm4.51-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.15.16-.29.18-.54.06a6.74 6.74 0 0 1-2-1.24 7.4 7.4 0 0 1-1.38-1.72c-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.72 2.63 4.18 3.69.58.25 1.04.4 1.4.51.59.19 1.12.16 1.55.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28z"/>
    </svg>
  );
}

/* ─── Component ─────────────────────────────── */

function WhatsAppButtonComponent({ props, isEditing, scaleFactor = 1 }: ElementRenderProps) {
  const text = (props.text as string) || "Chat on WhatsApp";
  const countryIso = (props.countryIso as string) || "US";
  const phone = (props.phone as string) || "";
  const message = (props.message as string) || "";
  const bgColor = (props.bgColor as string) || "#25D366";
  const textColor = (props.textColor as string) || "#ffffff";
  const borderRadius = (props.borderRadius as number) ?? 999;
  const fontSize = (props.fontSize as number) || 15;
  const fontWeight = (props.fontWeight as string) || "600";
  const variant = (props.variant as string) || "filled";
  const showIcon = props.showIcon !== false;
  const iconSize = (props.iconSize as number) || 18;

  const country = getCountry(countryIso);
  const url = buildWaMeUrl(country.dial, phone, message);

  const s = scaleFactor;
  const scaledFontSize = Math.round(fontSize * s);
  const scaledPadH = Math.round(18 * s);
  const scaledRadius = Math.round(borderRadius * s);
  const scaledIcon = Math.round(iconSize * s);

  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: Math.round(8 * s),
    borderRadius: scaledRadius,
    fontSize: scaledFontSize,
    fontWeight,
    cursor: isInsideEditor() ? "inherit" : isEditing || !url ? "default" : "pointer",
    transition: "all 0.15s ease",
    textDecoration: "none",
    letterSpacing: "0.01em",
    padding: `0 ${scaledPadH}px`,
    boxShadow: variant === "filled" ? `0 2px 10px ${bgColor}40` : undefined,
    ...(variant === "filled"
      ? { background: bgColor, color: textColor, border: "none" }
      : variant === "outline"
        ? { background: "transparent", color: bgColor, border: `2px solid ${bgColor}` }
        : { background: "transparent", color: bgColor, border: "none" }),
  };

  const content = (
    <>
      {showIcon && (
        <WhatsAppGlyph
          size={scaledIcon}
          color={variant === "filled" ? textColor : bgColor}
        />
      )}
      <span>{text}</span>
    </>
  );

  if (!isEditing && url && !isInsideEditor()) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" style={style}>
        {content}
      </a>
    );
  }

  return (
    <div style={style} draggable={false}>
      {content}
    </div>
  );
}

/* ─── Property Panel ────────────────────────── */

function CountryCodePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const country = getCountry(value);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.iso.toLowerCase().includes(q) ||
        c.dial.startsWith(q.replace(/^\+/, "")),
    );
  }, [search]);

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          background: "#fff",
          cursor: "pointer",
          fontSize: 13,
          minWidth: 92,
          height: 38,
        }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>{country.flag}</span>
        <span style={{ fontWeight: 600, color: "#1f2937" }}>+{country.dial}</span>
        <ChevronDown size={14} color="#6b7280" style={{ marginLeft: "auto" }} />
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              zIndex: 50,
              width: 260,
              maxHeight: 280,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 10px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Search size={14} color="#9ca3af" />
              <input
                autoFocus
                type="text"
                placeholder="Search country or code"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 13,
                  background: "transparent",
                }}
              />
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.length === 0 && (
                <div style={{ padding: 12, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
                  No matches
                </div>
              )}
              {filtered.map((c) => {
                const active = c.iso === value;
                return (
                  <button
                    key={c.iso}
                    type="button"
                    onClick={() => {
                      onChange(c.iso);
                      setOpen(false);
                      setSearch("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "8px 12px",
                      border: "none",
                      background: active ? "#ecfdf5" : "transparent",
                      cursor: "pointer",
                      fontSize: 13,
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{c.flag}</span>
                    <span style={{ flex: 1, color: "#1f2937" }}>{c.name}</span>
                    <span style={{ color: "#6b7280", fontWeight: 600 }}>+{c.dial}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function WhatsAppButtonPropertyPanel({ props, onChange }: PropertyPanelProps) {
  const countryIso = (props.countryIso as string) || "US";
  const phone = (props.phone as string) || "";
  const country = getCountry(countryIso);
  const messageLen = ((props.message as string) || "").length;
  const previewUrl = buildWaMeUrl(country.dial, phone, (props.message as string) || "");

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Button Label</span>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none"
          value={(props.text as string) || ""}
          placeholder="Chat on WhatsApp"
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </label>

      {/* Phone number with country code */}
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone Number</span>
        <div style={{ marginTop: 4, display: "flex", gap: 6 }}>
          <CountryCodePicker
            value={countryIso}
            onChange={(iso) => onChange({ countryIso: iso })}
          />
          <input
            type="tel"
            inputMode="tel"
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 text-sm shadow-sm focus:border-emerald-500 focus:outline-none"
            style={{ height: 38 }}
            placeholder="555 123 4567"
            value={phone}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
        </div>
        {previewUrl && (
          <p style={{ fontSize: 10.5, color: "#6b7280", marginTop: 6, wordBreak: "break-all" }}>
            <span style={{ color: "#10b981", fontWeight: 600 }}>Link: </span>
            {previewUrl}
          </p>
        )}
      </div>

      {/* Prefilled message */}
      <label className="block">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Prefilled Message <span style={{ textTransform: "none", color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
          </span>
          <span style={{
            fontSize: 10,
            color: messageLen > WA_MESSAGE_WARN ? "#ef4444" : "#9ca3af",
            fontVariantNumeric: "tabular-nums",
          }}>
            {messageLen}/{WA_MESSAGE_MAX}
          </span>
        </div>
        <textarea
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none"
          rows={3}
          maxLength={WA_MESSAGE_MAX}
          value={(props.message as string) || ""}
          placeholder="Hi! I'd like to know more about..."
          onChange={(e) => onChange({ message: e.target.value.slice(0, WA_MESSAGE_MAX) })}
        />
        <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>
          Opens WhatsApp with this text pre-typed. Keep it short — long links can be truncated by some browsers.
        </p>
      </label>

      {/* Variant */}
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Style</span>
        <div className="mt-1 flex gap-1">
          {(["filled", "outline", "ghost"] as const).map((v) => (
            <button
              key={v}
              type="button"
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                ((props.variant as string) || "filled") === v
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => onChange({ variant: v })}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </label>

      {/* Show icon toggle */}
      <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Show WhatsApp Icon</span>
        <button
          type="button"
          onClick={() => onChange({ showIcon: props.showIcon === false })}
          style={{
            width: 36,
            height: 20,
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            position: "relative",
            background: props.showIcon !== false ? "#10b981" : "#d1d5db",
            transition: "background 0.2s",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 2,
              left: props.showIcon !== false ? 18 : 2,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              transition: "left 0.2s",
            }}
          />
        </button>
      </label>

      {/* Colors */}
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Background</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover
            value={(props.bgColor as string) || ""}
            onChange={(hex) => onChange({ bgColor: hex })}
            fallback="#25D366"
          />
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none"
            value={(props.bgColor as string) || "#25D366"}
            onChange={(e) => onChange({ bgColor: e.target.value })}
          />
        </div>
      </label>

      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Text Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover
            value={(props.textColor as string) || ""}
            onChange={(hex) => onChange({ textColor: hex })}
            fallback="#ffffff"
          />
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none"
            value={(props.textColor as string) || "#ffffff"}
            onChange={(e) => onChange({ textColor: e.target.value })}
          />
        </div>
      </label>

      {/* Border Radius */}
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Corner Radius</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none"
          value={(props.borderRadius as number) ?? 999}
          onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          min={0}
          max={999}
        />
      </label>

      {/* Font Size */}
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Font Size</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none"
          value={(props.fontSize as number) || 15}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          min={8}
          max={72}
        />
      </label>
    </div>
  );
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "whatsapp-button",
  label: "WhatsApp Button",
  icon: <MessageCircle size={16} />,
  category: "interactive",
  defaultProps: {
    text: "Chat on WhatsApp",
    countryIso: "US",
    phone: "",
    message: "",
    variant: "filled",
    bgColor: "#25D366",
    textColor: "#ffffff",
    borderRadius: 999,
    fontSize: 15,
    fontWeight: "600",
    showIcon: true,
    iconSize: 18,
  },
  defaultTransform: { width: 220, height: 48 },
  component: WhatsAppButtonComponent,
  propertyPanel: WhatsAppButtonPropertyPanel,
});
