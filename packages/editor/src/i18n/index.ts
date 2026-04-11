/* ─────────────────────────────────────────────
 * i18n Store — Lightweight language state manager
 *
 * Uses Zustand for a tiny global locale store.
 * Persists selection to localStorage.
 * ──────────────────────────────────────────── */

"use client";

import { create } from "zustand";
import { translations, type Locale, type TranslationStrings, LOCALES } from "./translations";

/* ─── Helpers ─────────────────────────────── */

const STORAGE_KEY = "productix-locale";

function loadSavedLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && (saved === "en" || saved === "si" || saved === "ta")) return saved;
  return "en";
}

/* ─── Store ────────────────────────────────── */

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useI18nStore = create<I18nState>((set) => ({
  locale: loadSavedLocale(),
  setLocale: (locale: Locale) => {
    localStorage.setItem(STORAGE_KEY, locale);
    set({ locale });
  },
}));

/* ─── Hook — t() function ─────────────────── */

/**
 * Returns the translation function `t(key)` for the
 * current locale, plus the current locale and setter.
 */
export function useTranslation() {
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);

  const t = (key: keyof TranslationStrings): string => {
    return translations[locale]?.[key] ?? translations.en[key] ?? key;
  };

  return { t, locale, setLocale, locales: LOCALES };
}

/* ─── Re-exports for convenience ──────────── */

export { LOCALES } from "./translations";
export type { Locale, TranslationStrings } from "./translations";
