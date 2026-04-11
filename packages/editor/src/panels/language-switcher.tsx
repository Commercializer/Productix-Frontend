/* ─────────────────────────────────────────────
 * Language Switcher — Dropdown selector for
 * English, Sinhala, Tamil
 * ──────────────────────────────────────────── */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "../i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, locales } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = locales.find((l) => l.code === locale) ?? locales[0]!;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium transition-all border ${
          open
            ? "bg-blue-50 text-blue-600 border-blue-200 shadow-sm"
            : "text-gray-600 hover:bg-gray-100 border-transparent hover:border-gray-200"
        }`}
        title="Change language"
      >
        <span className="text-sm">{current.flag}</span>
        <span className="hidden sm:inline">{current.nativeLabel}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full right-0 mt-1.5 bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 z-[9999] min-w-[180px] animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              🌐 Language
            </span>
          </div>
          {locales.map((l) => {
            const isActive = l.code === locale;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLocale(l.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium ${isActive ? "text-blue-700" : "text-gray-800"}`}>
                    {l.nativeLabel}
                  </div>
                  <div className="text-[10px] text-gray-400">{l.label}</div>
                </div>
                {isActive && (
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
