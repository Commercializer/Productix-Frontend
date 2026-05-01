/* ─────────────────────────────────────────────
 * Font Options — curated Google Fonts list for the
 * editor's font picker.
 *
 * `family` is the CSS font-family value written to
 * element props. `googleQuery` is the slug used to
 * build a single combined Google Fonts <link>.
 * ──────────────────────────────────────────── */

export type FontCategory = "Default" | "Sans" | "Serif" | "Display" | "Script" | "Mono";

export interface FontOption {
  id: string;
  label: string;
  family: string;
  category: FontCategory;
  googleQuery?: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: "inherit",   label: "Default (page font)", family: "inherit",                      category: "Default" },

  { id: "inter",     label: "Inter",            family: "'Inter', sans-serif",             category: "Sans",    googleQuery: "Inter:wght@400;500;600;700" },
  { id: "roboto",    label: "Roboto",           family: "'Roboto', sans-serif",            category: "Sans",    googleQuery: "Roboto:wght@400;500;700" },
  { id: "openSans",  label: "Open Sans",        family: "'Open Sans', sans-serif",         category: "Sans",    googleQuery: "Open+Sans:wght@400;500;600;700" },
  { id: "poppins",   label: "Poppins",          family: "'Poppins', sans-serif",           category: "Sans",    googleQuery: "Poppins:wght@400;500;600;700" },
  { id: "monts",     label: "Montserrat",       family: "'Montserrat', sans-serif",        category: "Sans",    googleQuery: "Montserrat:wght@400;500;600;700" },
  { id: "lato",      label: "Lato",             family: "'Lato', sans-serif",              category: "Sans",    googleQuery: "Lato:wght@400;700" },
  { id: "workSans",  label: "Work Sans",        family: "'Work Sans', sans-serif",         category: "Sans",    googleQuery: "Work+Sans:wght@400;500;600;700" },
  { id: "nunito",    label: "Nunito",           family: "'Nunito', sans-serif",            category: "Sans",    googleQuery: "Nunito:wght@400;500;600;700" },

  { id: "playfair",  label: "Playfair Display", family: "'Playfair Display', serif",       category: "Serif",   googleQuery: "Playfair+Display:wght@400;600;700" },
  { id: "merri",     label: "Merriweather",     family: "'Merriweather', serif",           category: "Serif",   googleQuery: "Merriweather:wght@400;700" },
  { id: "lora",      label: "Lora",             family: "'Lora', serif",                   category: "Serif",   googleQuery: "Lora:wght@400;500;600;700" },

  { id: "oswald",    label: "Oswald",           family: "'Oswald', sans-serif",            category: "Display", googleQuery: "Oswald:wght@400;500;600;700" },
  { id: "bebas",     label: "Bebas Neue",       family: "'Bebas Neue', sans-serif",        category: "Display", googleQuery: "Bebas+Neue" },
  { id: "anton",     label: "Anton",            family: "'Anton', sans-serif",             category: "Display", googleQuery: "Anton" },

  { id: "pacifico",  label: "Pacifico",         family: "'Pacifico', cursive",             category: "Script",  googleQuery: "Pacifico" },
  { id: "caveat",    label: "Caveat",           family: "'Caveat', cursive",               category: "Script",  googleQuery: "Caveat:wght@400;500;600;700" },
  { id: "dancing",   label: "Dancing Script",   family: "'Dancing Script', cursive",       category: "Script",  googleQuery: "Dancing+Script:wght@400;500;600;700" },

  { id: "jetbrains", label: "JetBrains Mono",   family: "'JetBrains Mono', monospace",     category: "Mono",    googleQuery: "JetBrains+Mono:wght@400;500;700" },
  { id: "fira",      label: "Fira Code",        family: "'Fira Code', monospace",          category: "Mono",    googleQuery: "Fira+Code:wght@400;500;600;700" },
];

const FONT_CATEGORY_ORDER: FontCategory[] = ["Default", "Sans", "Serif", "Display", "Script", "Mono"];

export function groupFontOptionsByCategory(): Array<{ category: FontCategory; options: FontOption[] }> {
  const buckets = new Map<FontCategory, FontOption[]>();
  for (const opt of FONT_OPTIONS) {
    const list = buckets.get(opt.category) ?? [];
    list.push(opt);
    buckets.set(opt.category, list);
  }
  return FONT_CATEGORY_ORDER
    .filter((cat) => buckets.has(cat))
    .map((cat) => ({ category: cat, options: buckets.get(cat)! }));
}

/**
 * Build the Google Fonts stylesheet URL covering every
 * option that has a `googleQuery`. Pass to a `<link rel="stylesheet">`.
 */
export function getGoogleFontsHref(): string {
  const families = FONT_OPTIONS
    .map((f) => f.googleQuery)
    .filter((q): q is string => !!q)
    .map((q) => `family=${q}`);
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}
