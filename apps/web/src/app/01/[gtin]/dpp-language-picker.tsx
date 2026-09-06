"use client";

// Language picker for the public DPP passport (/01/{gtin}) - see dpp-view.tsx.
// Drives Google's "Website Translator" widget (translate.google.com/translate_a/
// element.js) to machine-translate the page's DPP terms (section titles,
// field labels, static copy) on request, but never the underlying product/
// answer data - every element rendering real product data across dpp-view.tsx,
// packaging-layers-view.tsx and repeatable-rows-view.tsx is marked
// `translate="no"`/`className="notranslate"`, which the widget honors and
// skips. Google's own UI (the default dropdown + top banner) is hidden; this
// component supplies its own dropdown and drives the widget's hidden
// `<select class="goog-te-combo">` directly, falling back to a full reload
// (the widget reads the `googtrans` cookie on init) if the combo isn't ready
// yet - e.g. right after the script has just been injected.
import { useEffect, useRef, useState } from "react";
import { Languages } from "lucide-react";

const SCRIPT_ID = "dpp-google-translate-script";
const COOKIE_NAME = "googtrans";

// EU official languages (ESPR is an EU regulation) plus a few widely-used
// extras, including Sinhala/Tamil - already offered elsewhere in this app's
// editor locale switcher (packages/editor/src/i18n).
const LANGUAGES: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "bg", label: "Български" },
  { code: "hr", label: "Hrvatski" },
  { code: "cs", label: "Čeština" },
  { code: "da", label: "Dansk" },
  { code: "nl", label: "Nederlands" },
  { code: "et", label: "Eesti" },
  { code: "fi", label: "Suomi" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "el", label: "Ελληνικά" },
  { code: "hu", label: "Magyar" },
  { code: "ga", label: "Gaeilge" },
  { code: "it", label: "Italiano" },
  { code: "lv", label: "Latviešu" },
  { code: "lt", label: "Lietuvių" },
  { code: "mt", label: "Malti" },
  { code: "pl", label: "Polski" },
  { code: "pt", label: "Português" },
  { code: "ro", label: "Română" },
  { code: "sk", label: "Slovenčina" },
  { code: "sl", label: "Slovenščina" },
  { code: "es", label: "Español" },
  { code: "sv", label: "Svenska" },
  { code: "ar", label: "العربية" },
  { code: "zh-CN", label: "中文（简体）" },
  { code: "hi", label: "हिन्दी" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "ru", label: "Русский" },
  { code: "tr", label: "Türkçe" },
  { code: "si", label: "සිංහල" },
  { code: "ta", label: "தமிழ்" },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: { TranslateElement?: new (options: Record<string, unknown>, id: string) => unknown } };
  }
}

function readGoogTransCookie(): string | null {
  const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
  if (!match) return null;
  const lang = decodeURIComponent(match[1]!).split("/").filter(Boolean)[1];
  return lang ?? null;
}

function setGoogTransCookie(lang: string | null) {
  if (!lang || lang === "en") {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
  } else {
    document.cookie = `${COOKIE_NAME}=/en/${lang}; path=/`;
  }
}

export function DppLanguagePicker() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("en");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(readGoogTransCookie() ?? "en");

    if (document.getElementById(SCRIPT_ID)) return;

    window.googleTranslateElementInit = () => {
      new window.google!.translate!.TranslateElement!(
        { pageLanguage: "en", autoDisplay: false },
        "dpp-google-translate-element"
      );
    };

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const applyLanguage = (lang: string) => {
    setCurrent(lang);
    setOpen(false);
    setGoogTransCookie(lang === "en" ? null : lang);

    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  const currentLabel = LANGUAGES.find((l) => l.code === current)?.label ?? "English";

  return (
    <>
      <div id="dpp-google-translate-element" style={{ display: "none" }} />
      <style>{`
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        body { top: 0px !important; }
        .goog-te-gadget-icon { display: none !important; }
        .goog-tooltip, .goog-tooltip:hover { box-shadow: none !important; background: none !important; }
        .goog-text-highlight { background: none !important; box-shadow: none !important; }
        #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
      `}</style>
      <div ref={containerRef} className="notranslate" translate="no" style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, fontFamily: "var(--font-sans)" }}>
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
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={l.code === current}
                onClick={() => applyLanguage(l.code)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "none",
                  background: l.code === current ? "#f1f5f9" : "transparent",
                  fontSize: 13,
                  fontWeight: l.code === current ? 700 : 500,
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
    </>
  );
}
