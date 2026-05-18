/* ─────────────────────────────────────────────
 * Hex-first color popover
 *
 * Replaces the browser's native <input type="color">
 * (which defaults to RGB on macOS/Chrome) with a
 * compact saturation/value pad + hue slider + hex
 * field. Hex is the primary representation.
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const POPOVER_WIDTH = 280;

/* ─── Color math ────────────────────────────── */

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const stripped = hex.replace(/^#/, "");
  const m = stripped.match(/^([0-9a-f]{6})$/i) || stripped.match(/^([0-9a-f]{3})$/i);
  if (!m || !m[1]) return { r: 0, g: 0, b: 0 };
  let h: string = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const hex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : (d / max) * 100, v: max * 100 };
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  s /= 100; v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

function isValidHex(s: string): boolean {
  return /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s.trim());
}

function normalizeHex(s: string): string {
  const t = s.trim().replace(/^#/, "");
  if (t.length === 3) {
    return "#" + t.split("").map((c) => c + c).join("").toLowerCase();
  }
  return "#" + t.toLowerCase();
}

/* ─── Sub-controls ──────────────────────────── */

function SVPad({ hue, s, v, onChange }: {
  hue: number;
  s: number;
  v: number;
  onChange: (s: number, v: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const update = useCallback((clientX: number, clientY: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const y = clamp(clientY - rect.top, 0, rect.height);
    onChange((x / rect.width) * 100, (1 - y / rect.height) * 100);
  }, [onChange]);

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        draggingRef.current = true;
        update(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (draggingRef.current) update(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => {
        draggingRef.current = false;
        try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
      }}
      style={{
        position: "relative",
        width: "100%",
        height: 120,
        borderRadius: 4,
        background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`,
        cursor: "crosshair",
        touchAction: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: `${s}%`,
          top: `${100 - v}%`,
          width: 12,
          height: 12,
          borderRadius: 6,
          border: "2px solid #fff",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.4)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function HueSlider({ hue, onChange }: { hue: number; onChange: (h: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const update = useCallback((clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    onChange((x / rect.width) * 360);
  }, [onChange]);

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        draggingRef.current = true;
        update(e.clientX);
      }}
      onPointerMove={(e) => {
        if (draggingRef.current) update(e.clientX);
      }}
      onPointerUp={(e) => {
        draggingRef.current = false;
        try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
      }}
      style={{
        position: "relative",
        width: "100%",
        height: 12,
        marginTop: 10,
        borderRadius: 6,
        background: "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
        cursor: "ew-resize",
        touchAction: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: `${(hue / 360) * 100}%`,
          top: "50%",
          width: 10,
          height: 16,
          borderRadius: 2,
          border: "2px solid #fff",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.4)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ─── Main popover ──────────────────────────── */

type ColorFormat = "hex" | "rgb" | "hsl";

export function HexColorPopover({
  value,
  onChange,
  fallback = "#000000",
}: {
  value: string;
  onChange: (hex: string) => void;
  fallback?: string;
}) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [hexDraft, setHexDraft] = useState<string>("");
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const swatchRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const effective = value || fallback;
  const rgb = useMemo(() => hexToRgb(effective), [effective]);
  const hsv = useMemo(() => rgbToHsv(rgb.r, rgb.g, rgb.b), [rgb]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);

  // Position the popover under the swatch, in viewport space, keeping it on-screen
  useEffect(() => {
    if (!open || !swatchRef.current) return;
    function place() {
      const r = swatchRef.current!.getBoundingClientRect();
      const vw = window.innerWidth;
      const left = clamp(r.left, 8, vw - POPOVER_WIDTH - 8);
      const top = r.bottom + 6;
      setPos({ top, left });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  // Click-outside to close (swatch + popover are both safe zones)
  useEffect(() => {
    if (!open) return;
    function handle(e: PointerEvent) {
      const t = e.target as Node;
      if (swatchRef.current?.contains(t)) return;
      if (popoverRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("pointerdown", handle);
    return () => document.removeEventListener("pointerdown", handle);
  }, [open]);

  // Reset hex draft whenever the popover opens or the external value changes
  useEffect(() => {
    setHexDraft(effective);
  }, [effective, open]);

  const setHsvAndEmit = (h: number, s: number, v: number) => {
    const { r, g, b } = hsvToRgb(h, s, v);
    onChange(rgbToHex(r, g, b));
  };

  const setRgbAndEmit = (r: number, g: number, b: number) => {
    onChange(rgbToHex(r, g, b));
  };

  const setHslAndEmit = (h: number, s: number, l: number) => {
    const { r, g, b } = hslToRgb(h, s, l);
    onChange(rgbToHex(r, g, b));
  };

  return (
    <>
      <button
        ref={swatchRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open color picker"
        style={{ backgroundColor: effective }}
        className="h-8 w-8 cursor-pointer rounded border border-gray-200"
      />
      {open && pos && typeof document !== "undefined" && createPortal(
        <div
          ref={popoverRef}
          style={{ position: "fixed", top: pos.top, left: pos.left, width: POPOVER_WIDTH, zIndex: 9999, color: "#111827" }}
          className="rounded-md border border-gray-200 bg-white p-3 shadow-lg"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <SVPad
            hue={hsv.h}
            s={hsv.s}
            v={hsv.v}
            onChange={(s, v) => setHsvAndEmit(hsv.h, s, v)}
          />
          <HueSlider
            hue={hsv.h}
            onChange={(h) => setHsvAndEmit(h, hsv.s, hsv.v)}
          />

          {/* Format-specific inputs */}
          {format === "hex" && (
            <div className="mt-3">
              <input
                type="text"
                value={hexDraft}
                onChange={(e) => {
                  const next = e.target.value;
                  setHexDraft(next);
                  if (isValidHex(next)) onChange(normalizeHex(next));
                }}
                onBlur={() => setHexDraft(effective)}
                className="w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-center text-xs font-mono uppercase tracking-wider text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none"
                maxLength={7}
                spellCheck={false}
              />
              <div className="mt-1 text-center text-[10px] font-medium uppercase tracking-wider text-gray-400">
                HEX
              </div>
            </div>
          )}

          {format === "rgb" && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["r", "g", "b"] as const).map((ch) => (
                <div key={ch}>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={Math.round(rgb[ch])}
                    onChange={(e) => {
                      const n = clamp(parseInt(e.target.value, 10) || 0, 0, 255);
                      setRgbAndEmit(
                        ch === "r" ? n : rgb.r,
                        ch === "g" ? n : rgb.g,
                        ch === "b" ? n : rgb.b,
                      );
                    }}
                    className="w-full rounded-md border border-gray-200 bg-white px-1 py-1 text-center text-xs font-mono text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none"
                  />
                  <div className="mt-1 text-center text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    {ch}
                  </div>
                </div>
              ))}
            </div>
          )}

          {format === "hsl" && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["h", "s", "l"] as const).map((ch) => (
                <div key={ch}>
                  <input
                    type="number"
                    min={0}
                    max={ch === "h" ? 360 : 100}
                    value={Math.round(hsl[ch])}
                    onChange={(e) => {
                      const max = ch === "h" ? 360 : 100;
                      const n = clamp(parseInt(e.target.value, 10) || 0, 0, max);
                      setHslAndEmit(
                        ch === "h" ? n : hsl.h,
                        ch === "s" ? n : hsl.s,
                        ch === "l" ? n : hsl.l,
                      );
                    }}
                    className="w-full rounded-md border border-gray-200 bg-white px-1 py-1 text-center text-xs font-mono text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none"
                  />
                  <div className="mt-1 text-center text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    {ch}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Format selector */}
          <div className="mt-3 flex gap-1 rounded-md bg-gray-100 p-0.5">
            {(["hex", "rgb", "hsl"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`flex-1 rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                  format === f
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
