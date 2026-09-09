// Languages offered by the public DPP passport's language picker (see
// 01/[gtin]/dpp-language-picker.tsx) - EU official languages (ESPR is an EU
// regulation) plus a few widely-used extras, including Sinhala/Tamil -
// already offered elsewhere in this app's editor locale switcher
// (packages/editor/src/i18n). Every non-English code here must have a
// matching dictionary at ./dictionaries/<code>.json - see translate.ts.
export interface DppLanguage {
  code: string;
  label: string;
}

export const DPP_LANGUAGES: DppLanguage[] = [
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

const VALID_CODES = new Set(DPP_LANGUAGES.map((l) => l.code));

/** Validates a `?lang=` query value against the supported list - anything
 * else (missing, typo, a code we don't ship) falls back to English. */
export function normalizeDppLang(raw: string | undefined | null): string {
  return raw && VALID_CODES.has(raw) ? raw : "en";
}
