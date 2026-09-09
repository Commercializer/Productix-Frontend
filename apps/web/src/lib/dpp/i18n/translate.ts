// Manual translation lookup for the public DPP passport (/01/{gtin}) - see
// 01/[gtin]/dpp-view.tsx and dpp-language-picker.tsx. Replaces the old
// Google Translate widget (which machine-translated the whole DOM at
// request time) with hand-written, per-language dictionaries keyed by the
// exact English source string - the same strings that are the field/
// section/group labels resolved from sector-requirements/*.json and a
// handful of hardcoded UI strings elsewhere on this page. A key with no
// translation for the current language (or `lang: "en"`/an unrecognized
// code) falls back to the original English text - translation is
// best-effort dictionary lookup, never a hard requirement to render.
//
// Only the fixed UI copy (labels, titles, static strings) is ever looked up
// here - the actual per-product answer *data* (names, descriptions, GTIN,
// every value a producer typed in) is never passed through this function
// and stays exactly as entered, in whatever language it was entered in.
//
// NOTE: dictionaries/<lang>.json are being generated one batch at a time -
// only add a static import here once its file actually exists (an import of
// a missing file fails the whole build, not just that language) - see
// DPP_LANGUAGES in languages.ts for the full target list still pending.
import fr from "./dictionaries/fr.json";
import de from "./dictionaries/de.json";
import es from "./dictionaries/es.json";
import it from "./dictionaries/it.json";
import pt from "./dictionaries/pt.json";
import nl from "./dictionaries/nl.json";
import da from "./dictionaries/da.json";
import sv from "./dictionaries/sv.json";
import fi from "./dictionaries/fi.json";
import et from "./dictionaries/et.json";

type Dictionary = Record<string, string>;

const DICTIONARIES: Record<string, Dictionary> = {
  fr,
  de,
  es,
  it,
  pt,
  nl,
  da,
  sv,
  fi,
  et,
};

/** Translates one piece of fixed DPP UI copy (a field label, section title,
 * group heading, or static string) into `lang` - returns `text` unchanged
 * for English or any string with no dictionary entry. */
export function translateDpp(text: string, lang: string): string {
  if (!text || lang === "en") return text;
  return DICTIONARIES[lang]?.[text] ?? text;
}

/** Same as translateDpp, but substitutes a `{n}` placeholder with `n` after
 * translation - used for the one templated string on this page ("Layer
 * {n}"). */
export function translateDppTemplate(text: string, lang: string, n: number): string {
  return translateDpp(text, lang).replace("{n}", String(n));
}
