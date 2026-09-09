"use client";

// Language picker for the public DPP passport (/01/{gtin}) - see
// dpp-view.tsx. Switches the page's fixed UI copy (section titles, field
// labels, static strings - see translateDpp) between hand-written
// dictionaries by navigating to the same URL with a `?lang=` query param;
// the server component re-renders with that language. Product/answer data
// (names, descriptions, every value a producer typed in) is never touched
// by this - it always renders exactly as entered, regardless of the
// selected UI language. Previously drove the Google Translate widget
// instead of real dictionaries - see translate.ts for the manual
// dictionaries this replaced it with.
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Languages } from "lucide-react";
import { DPP_LANGUAGES } from "@/lib/dpp/i18n/languages";

export function DppLanguagePicker({ lang }: { lang: string }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const applyLanguage = (code: string) => {
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (code === "en") params.delete("lang");
    else params.set("lang", code);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const currentLabel = DPP_LANGUAGES.find((l) => l.code === lang)?.label ?? "English";

  return (
    <div ref={containerRef} style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, fontFamily: "var(--font-sans)" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 14px",
          borderRadius: 999,
          border: "none",
          background: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)",
          fontSize: 13,
          fontWeight: 600,
          color: "#0f172a",
          cursor: "pointer",
        }}
      >
        <Languages size={15} />
        {currentLabel}
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.04)",
            padding: 6,
            maxHeight: 320,
            overflowY: "auto",
            minWidth: 190,
          }}
        >
          {DPP_LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={l.code === lang}
              onClick={() => applyLanguage(l.code)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: 8,
                border: "none",
                background: l.code === lang ? "#f1f5f9" : "transparent",
                fontSize: 13,
                fontWeight: l.code === lang ? 700 : 500,
                color: "#0f172a",
                cursor: "pointer",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
