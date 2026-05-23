/* ─────────────────────────────────────────────
 * Font Picker - custom dropdown that previews
 * each option in its own typeface.
 *
 * Uses a fixed-position popover anchored to the
 * trigger button so it can escape the scrolling
 * properties panel without being clipped.
 * ──────────────────────────────────────────── */

"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { FONT_OPTIONS, groupFontOptionsByCategory } from "../utils/fonts";

interface FontPickerProps {
  value: string;
  onChange: (family: string) => void;
}

export function FontPicker({ value, onChange }: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  const current = FONT_OPTIONS.find((o) => o.family === value) ?? FONT_OPTIONS[0]!;

  useEffect(() => {
    if (!open) return;
    const updatePos = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (r) setPos({ top: r.bottom + 4, left: r.left, width: r.width });
    };
    updatePos();

    const onPointerDown = (e: MouseEvent) => {
      if (
        popRef.current?.contains(e.target as Node) ||
        btnRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:border-gray-300 focus:border-blue-500 focus:outline-none"
        style={{ fontFamily: current.family }}
      >
        <span className="truncate">{current.label}</span>
        <ChevronDown size={14} className="ml-2 flex-shrink-0 text-gray-400" />
      </button>

      {open && pos && (
        <div
          ref={popRef}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            width: pos.width,
            maxHeight: 360,
            overflowY: "auto",
            zIndex: 9999,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            boxShadow: "0 12px 32px rgba(0,0,0,0.14)",
            padding: "4px 0",
          }}
        >
          {groupFontOptionsByCategory().map(({ category, options }) => (
            <div key={category}>
              <div
                style={{
                  padding: "8px 12px 4px",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {category}
              </div>
              {options.map((opt) => {
                const selected = opt.family === value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChange(opt.family);
                      setOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                      width: "100%",
                      padding: "8px 12px",
                      fontFamily: opt.family,
                      fontSize: 14,
                      color: selected ? "#0284c7" : "#1f2937",
                      background: selected ? "#f0f9ff" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (!selected) e.currentTarget.style.background = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      if (!selected) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {opt.label}
                    </span>
                    {selected && <Check size={14} style={{ flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
