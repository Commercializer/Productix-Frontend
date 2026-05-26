/* ─────────────────────────────────────────────
 * Editor Types - Responsive Canvas Data Model
 * ──────────────────────────────────────────── */

// ─── Content Locale System ─────────────────────

/**
 * Content language code (ISO 639-1, with optional region tag like `pt-BR`).
 * Kept as a broad string so users can author any world language;
 * `CONTENT_LOCALE_META` provides metadata for the well-known set.
 */
export type ContentLocale = string;

/** Display metadata for a content locale */
export interface ContentLocaleMeta {
  /** English-name label (e.g. "Spanish") */
  label: string;
  /** Native-name label (e.g. "Español") */
  nativeLabel: string;
  /** Emoji flag - defaults to 🌐 for languages without a clear region */
  flag: string;
  /** Whether this language is right-to-left */
  rtl?: boolean;
}

/**
 * Comprehensive registry of world languages keyed by ISO 639-1 / BCP-47 code.
 * Add additional regional variants here as needed.
 */
export const CONTENT_LOCALE_META: Record<string, ContentLocaleMeta> = {
  en: { label: "English", nativeLabel: "English", flag: "🇬🇧" },
  af: { label: "Afrikaans", nativeLabel: "Afrikaans", flag: "🇿🇦" },
  am: { label: "Amharic", nativeLabel: "አማርኛ", flag: "🇪🇹" },
  ar: { label: "Arabic", nativeLabel: "العربية", flag: "🇸🇦", rtl: true },
  az: { label: "Azerbaijani", nativeLabel: "Azərbaycanca", flag: "🇦🇿" },
  be: { label: "Belarusian", nativeLabel: "Беларуская", flag: "🇧🇾" },
  bg: { label: "Bulgarian", nativeLabel: "Български", flag: "🇧🇬" },
  bn: { label: "Bengali", nativeLabel: "বাংলা", flag: "🇧🇩" },
  bs: { label: "Bosnian", nativeLabel: "Bosanski", flag: "🇧🇦" },
  ca: { label: "Catalan", nativeLabel: "Català", flag: "🇪🇸" },
  ceb: { label: "Cebuano", nativeLabel: "Cebuano", flag: "🇵🇭" },
  co: { label: "Corsican", nativeLabel: "Corsu", flag: "🇫🇷" },
  cs: { label: "Czech", nativeLabel: "Čeština", flag: "🇨🇿" },
  cy: { label: "Welsh", nativeLabel: "Cymraeg", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  da: { label: "Danish", nativeLabel: "Dansk", flag: "🇩🇰" },
  de: { label: "German", nativeLabel: "Deutsch", flag: "🇩🇪" },
  dv: { label: "Dhivehi", nativeLabel: "ދިވެހި", flag: "🇲🇻", rtl: true },
  el: { label: "Greek", nativeLabel: "Ελληνικά", flag: "🇬🇷" },
  eo: { label: "Esperanto", nativeLabel: "Esperanto", flag: "🌐" },
  es: { label: "Spanish", nativeLabel: "Español", flag: "🇪🇸" },
  "es-MX": { label: "Spanish (Mexico)", nativeLabel: "Español (México)", flag: "🇲🇽" },
  et: { label: "Estonian", nativeLabel: "Eesti", flag: "🇪🇪" },
  eu: { label: "Basque", nativeLabel: "Euskara", flag: "🌐" },
  fa: { label: "Persian", nativeLabel: "فارسی", flag: "🇮🇷", rtl: true },
  ff: { label: "Fulah", nativeLabel: "Fulfulde", flag: "🌐" },
  fi: { label: "Finnish", nativeLabel: "Suomi", flag: "🇫🇮" },
  fil: { label: "Filipino", nativeLabel: "Filipino", flag: "🇵🇭" },
  fj: { label: "Fijian", nativeLabel: "Vakaviti", flag: "🇫🇯" },
  fo: { label: "Faroese", nativeLabel: "Føroyskt", flag: "🇫🇴" },
  fr: { label: "French", nativeLabel: "Français", flag: "🇫🇷" },
  "fr-CA": { label: "French (Canada)", nativeLabel: "Français (Canada)", flag: "🇨🇦" },
  fy: { label: "Frisian", nativeLabel: "Frysk", flag: "🇳🇱" },
  ga: { label: "Irish", nativeLabel: "Gaeilge", flag: "🇮🇪" },
  gd: { label: "Scots Gaelic", nativeLabel: "Gàidhlig", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  gl: { label: "Galician", nativeLabel: "Galego", flag: "🌐" },
  gn: { label: "Guarani", nativeLabel: "Avañe'ẽ", flag: "🇵🇾" },
  gu: { label: "Gujarati", nativeLabel: "ગુજરાતી", flag: "🇮🇳" },
  ha: { label: "Hausa", nativeLabel: "Hausa", flag: "🇳🇬" },
  haw: { label: "Hawaiian", nativeLabel: "ʻŌlelo Hawaiʻi", flag: "🌐" },
  he: { label: "Hebrew", nativeLabel: "עברית", flag: "🇮🇱", rtl: true },
  hi: { label: "Hindi", nativeLabel: "हिन्दी", flag: "🇮🇳" },
  hmn: { label: "Hmong", nativeLabel: "Hmoob", flag: "🌐" },
  hr: { label: "Croatian", nativeLabel: "Hrvatski", flag: "🇭🇷" },
  ht: { label: "Haitian Creole", nativeLabel: "Kreyòl Ayisyen", flag: "🇭🇹" },
  hu: { label: "Hungarian", nativeLabel: "Magyar", flag: "🇭🇺" },
  hy: { label: "Armenian", nativeLabel: "Հայերեն", flag: "🇦🇲" },
  id: { label: "Indonesian", nativeLabel: "Bahasa Indonesia", flag: "🇮🇩" },
  ig: { label: "Igbo", nativeLabel: "Igbo", flag: "🇳🇬" },
  is: { label: "Icelandic", nativeLabel: "Íslenska", flag: "🇮🇸" },
  it: { label: "Italian", nativeLabel: "Italiano", flag: "🇮🇹" },
  ja: { label: "Japanese", nativeLabel: "日本語", flag: "🇯🇵" },
  jv: { label: "Javanese", nativeLabel: "Basa Jawa", flag: "🇮🇩" },
  ka: { label: "Georgian", nativeLabel: "ქართული", flag: "🇬🇪" },
  kk: { label: "Kazakh", nativeLabel: "Қазақ тілі", flag: "🇰🇿" },
  km: { label: "Khmer", nativeLabel: "ភាសាខ្មែរ", flag: "🇰🇭" },
  kn: { label: "Kannada", nativeLabel: "ಕನ್ನಡ", flag: "🇮🇳" },
  ko: { label: "Korean", nativeLabel: "한국어", flag: "🇰🇷" },
  ku: { label: "Kurdish", nativeLabel: "Kurdî", flag: "🌐" },
  ky: { label: "Kyrgyz", nativeLabel: "Кыргызча", flag: "🇰🇬" },
  la: { label: "Latin", nativeLabel: "Latina", flag: "🌐" },
  lb: { label: "Luxembourgish", nativeLabel: "Lëtzebuergesch", flag: "🇱🇺" },
  lo: { label: "Lao", nativeLabel: "ລາວ", flag: "🇱🇦" },
  lt: { label: "Lithuanian", nativeLabel: "Lietuvių", flag: "🇱🇹" },
  lv: { label: "Latvian", nativeLabel: "Latviešu", flag: "🇱🇻" },
  mg: { label: "Malagasy", nativeLabel: "Malagasy", flag: "🇲🇬" },
  mi: { label: "Maori", nativeLabel: "Te Reo Māori", flag: "🇳🇿" },
  mk: { label: "Macedonian", nativeLabel: "Македонски", flag: "🇲🇰" },
  ml: { label: "Malayalam", nativeLabel: "മലയാളം", flag: "🇮🇳" },
  mn: { label: "Mongolian", nativeLabel: "Монгол", flag: "🇲🇳" },
  mr: { label: "Marathi", nativeLabel: "मराठी", flag: "🇮🇳" },
  ms: { label: "Malay", nativeLabel: "Bahasa Melayu", flag: "🇲🇾" },
  mt: { label: "Maltese", nativeLabel: "Malti", flag: "🇲🇹" },
  my: { label: "Burmese", nativeLabel: "မြန်မာ", flag: "🇲🇲" },
  ne: { label: "Nepali", nativeLabel: "नेपाली", flag: "🇳🇵" },
  nl: { label: "Dutch", nativeLabel: "Nederlands", flag: "🇳🇱" },
  no: { label: "Norwegian", nativeLabel: "Norsk", flag: "🇳🇴" },
  ny: { label: "Chichewa", nativeLabel: "Chichewa", flag: "🇲🇼" },
  or: { label: "Odia", nativeLabel: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  pa: { label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  pl: { label: "Polish", nativeLabel: "Polski", flag: "🇵🇱" },
  ps: { label: "Pashto", nativeLabel: "پښتو", flag: "🇦🇫", rtl: true },
  pt: { label: "Portuguese", nativeLabel: "Português", flag: "🇵🇹" },
  "pt-BR": { label: "Portuguese (Brazil)", nativeLabel: "Português (Brasil)", flag: "🇧🇷" },
  ro: { label: "Romanian", nativeLabel: "Română", flag: "🇷🇴" },
  ru: { label: "Russian", nativeLabel: "Русский", flag: "🇷🇺" },
  rw: { label: "Kinyarwanda", nativeLabel: "Kinyarwanda", flag: "🇷🇼" },
  sd: { label: "Sindhi", nativeLabel: "سنڌي", flag: "🌐", rtl: true },
  si: { label: "Sinhala", nativeLabel: "සිංහල", flag: "🇱🇰" },
  sk: { label: "Slovak", nativeLabel: "Slovenčina", flag: "🇸🇰" },
  sl: { label: "Slovenian", nativeLabel: "Slovenščina", flag: "🇸🇮" },
  sm: { label: "Samoan", nativeLabel: "Gagana Samoa", flag: "🇼🇸" },
  sn: { label: "Shona", nativeLabel: "ChiShona", flag: "🇿🇼" },
  so: { label: "Somali", nativeLabel: "Soomaali", flag: "🇸🇴" },
  sq: { label: "Albanian", nativeLabel: "Shqip", flag: "🇦🇱" },
  sr: { label: "Serbian", nativeLabel: "Српски", flag: "🇷🇸" },
  st: { label: "Sesotho", nativeLabel: "Sesotho", flag: "🇱🇸" },
  su: { label: "Sundanese", nativeLabel: "Basa Sunda", flag: "🇮🇩" },
  sv: { label: "Swedish", nativeLabel: "Svenska", flag: "🇸🇪" },
  sw: { label: "Swahili", nativeLabel: "Kiswahili", flag: "🇰🇪" },
  ta: { label: "Tamil", nativeLabel: "தமிழ்", flag: "🇱🇰" },
  te: { label: "Telugu", nativeLabel: "తెలుగు", flag: "🇮🇳" },
  tg: { label: "Tajik", nativeLabel: "Тоҷикӣ", flag: "🇹🇯" },
  th: { label: "Thai", nativeLabel: "ไทย", flag: "🇹🇭" },
  ti: { label: "Tigrinya", nativeLabel: "ትግርኛ", flag: "🇪🇷" },
  tk: { label: "Turkmen", nativeLabel: "Türkmen", flag: "🇹🇲" },
  to: { label: "Tongan", nativeLabel: "Lea Faka-Tonga", flag: "🇹🇴" },
  tr: { label: "Turkish", nativeLabel: "Türkçe", flag: "🇹🇷" },
  tt: { label: "Tatar", nativeLabel: "Татар теле", flag: "🌐" },
  ug: { label: "Uyghur", nativeLabel: "ئۇيغۇرچە", flag: "🌐", rtl: true },
  uk: { label: "Ukrainian", nativeLabel: "Українська", flag: "🇺🇦" },
  ur: { label: "Urdu", nativeLabel: "اردو", flag: "🇵🇰", rtl: true },
  uz: { label: "Uzbek", nativeLabel: "Oʻzbekcha", flag: "🇺🇿" },
  vi: { label: "Vietnamese", nativeLabel: "Tiếng Việt", flag: "🇻🇳" },
  xh: { label: "Xhosa", nativeLabel: "isiXhosa", flag: "🇿🇦" },
  yi: { label: "Yiddish", nativeLabel: "ייִדיש", flag: "🌐", rtl: true },
  yo: { label: "Yoruba", nativeLabel: "Yorùbá", flag: "🇳🇬" },
  zh: { label: "Chinese (Simplified)", nativeLabel: "中文 (简体)", flag: "🇨🇳" },
  "zh-TW": { label: "Chinese (Traditional)", nativeLabel: "中文 (繁體)", flag: "🇹🇼" },
  zu: { label: "Zulu", nativeLabel: "isiZulu", flag: "🇿🇦" },
};

/** All known content locales in alphabetical order by English label */
export const CONTENT_LOCALES: ContentLocale[] = Object.keys(CONTENT_LOCALE_META).sort((a, b) => {
  if (a === "en") return -1;
  if (b === "en") return 1;
  return (CONTENT_LOCALE_META[a]?.label ?? a).localeCompare(CONTENT_LOCALE_META[b]?.label ?? b);
});

/** Safe meta lookup with a sensible fallback for unknown codes. */
export function getContentLocaleMeta(locale: ContentLocale): ContentLocaleMeta {
  return (
    CONTENT_LOCALE_META[locale] ?? {
      label: locale.toUpperCase(),
      nativeLabel: locale.toUpperCase(),
      flag: "🌐",
    }
  );
}

// ─── Breakpoint System ─────────────────────────

/** Supported responsive breakpoints */
export type Breakpoint = "desktop" | "laptop" | "tablet" | "mobile";

/** Ordered list of breakpoints from widest to narrowest */
export const BREAKPOINTS: Breakpoint[] = ["desktop", "laptop", "tablet", "mobile"];

/** Ordered list of breakpoints from narrowest to widest (mobile-first) */
export const BREAKPOINTS_MOBILE_FIRST: Breakpoint[] = ["mobile", "tablet", "laptop", "desktop"];

/** Canonical viewport widths for each breakpoint */
export const BREAKPOINT_WIDTHS: Record<Breakpoint, number> = {
  desktop: 1440,
  laptop: 1280,
  tablet: 768,
  mobile: 428,
};

/** Canonical viewport heights for each breakpoint (portrait for mobile/tablet) */
export const BREAKPOINT_HEIGHTS: Record<Breakpoint, number> = {
  desktop: 900,
  laptop: 800,
  tablet: 1024,
  mobile: 926,
};

/**
 * Mobile-first min-width media query breakpoints.
 * Used to generate CSS `@media (min-width: ...)` rules.
 * Mobile is the base (no media query needed).
 */
export const BREAKPOINT_MIN_WIDTHS: Record<Breakpoint, number> = {
  mobile: 0,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
};

// ─── Transform ─────────────────────────────────

/** Position + size + rotation for every canvas element */
export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

// ─── Layout System ─────────────────────────────

/** Layout mode for an element */
export type LayoutMode = "absolute" | "flow";

/** Size unit for width/height in flow mode */
export type SizeUnit = "px" | "%" | "auto" | "fr";

/** Flow-mode layout properties for individual elements */
export interface LayoutProps {
  /** Whether element is absolutely positioned or in document flow */
  layoutMode: LayoutMode;
  /** Width value (interpreted according to widthUnit) */
  widthValue: number;
  /** Width unit */
  widthUnit: SizeUnit;
  /** Height value (interpreted according to heightUnit) */
  heightValue: number;
  /** Height unit */
  heightUnit: SizeUnit;
  /** Min-width in px - triggers wrapping when flex item shrinks below this */
  minWidth?: number;
  /** Max-width in px - prevents element from growing beyond this */
  maxWidth?: number;
  /** Margin [top, right, bottom, left] in px */
  margin: [number, number, number, number];
  /** Padding [top, right, bottom, left] in px */
  padding: [number, number, number, number];
  /** Align self within flex parent */
  alignSelf?: "auto" | "flex-start" | "center" | "flex-end" | "stretch";
  /** Flex grow factor */
  flexGrow?: number;
  /** Flex shrink factor */
  flexShrink?: number;
  /** Order within flex container */
  order?: number;
  /** Whether this element is hidden at this breakpoint */
  hidden?: boolean;
}

/** Flex container layout configuration (for Row, Column, and Artboard) */
export interface FlexContainerProps {
  /** Flex direction */
  direction: "row" | "column";
  /** Flex wrap behavior */
  wrap: "nowrap" | "wrap";
  /** Horizontal distribution */
  justifyContent: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
  /** Vertical alignment */
  alignItems: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
  /** Gap between children in px */
  gap: number;
  /** Container padding [top, right, bottom, left] in px */
  padding: [number, number, number, number];
}

/** Default layout props for new flow-mode elements */
export const DEFAULT_LAYOUT_PROPS: LayoutProps = {
  layoutMode: "flow",
  widthValue: 100,
  widthUnit: "%",
  heightValue: 0,
  heightUnit: "auto",
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
  flexGrow: 0,
  flexShrink: 1,
};

/** Default flex container props */
export const DEFAULT_FLEX_CONTAINER: FlexContainerProps = {
  direction: "column",
  wrap: "wrap",
  justifyContent: "flex-start",
  alignItems: "stretch",
  gap: 0,
  padding: [0, 0, 0, 0],
};

// ─── Element Node ──────────────────────────────

/** A single visual element on the canvas */
export interface ElementNode {
  id: string;
  /** Registered element type key (e.g. "text", "image", "card") */
  type: string;
  /** Base transform (desktop / design-time values) - used in absolute mode */
  transform: Transform;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  opacity: number;
  /** Element-type-specific props (text content, image src, colors, etc.) - always English / default */
  props: Record<string, unknown>;
  /**
   * Per-locale content overrides.
   * Only non-"en" locales need entries here.
   * Missing locales fall back to the base `props` (English).
   * Only text-like properties should be overridden (text, title, subtitle, ctaText, label, value).
   */
  i18nProps?: Partial<Record<ContentLocale, Record<string, unknown>>>;
  /** Child element IDs - used by group/container/row/column elements */
  children?: string[];
  /** Parent group ID (if element belongs to a group) */
  parentId?: string;
  /**
   * Block group ID - when set, this element belongs to a named group.
   * All elements sharing the same groupId move together when any member is dragged.
   */
  groupId?: string;
  /**
   * Per-breakpoint transform overrides (absolute mode only).
   * Only non-desktop breakpoints need entries here.
   * Missing breakpoints fall back to auto-scaled from the base transform.
   */
  responsiveOverrides?: Partial<Record<Breakpoint, Partial<Transform>>>;
  /**
   * Layout properties for flow mode.
   * When undefined, the element uses absolute mode (backward compat).
   */
  layout?: LayoutProps;
  /**
   * Per-breakpoint layout overrides (flow mode only).
   * Allows width/visibility/stacking changes per breakpoint.
   * Missing breakpoints inherit from the base layout props.
   */
  responsiveLayout?: Partial<Record<Breakpoint, Partial<LayoutProps>>>;
  /**
   * Optional URL — when set, clicking the rendered block on the
   * published / preview page navigates to this URL. Works for any
   * block type (image, card, text, …). When empty, the block
   * behaves normally with no click navigation.
   */
  link?: string;
  /**
   * Where the link opens. Defaults to "_blank" (new tab) when omitted.
   */
  linkTarget?: "_self" | "_blank";
}

// ─── Canvas Effects ────────────────────────────

/** Supported canvas visual overlay effects */
export type CanvasEffect =
  | "none"
  | "snowfall"
  | "confetti"
  | "halloween"
  | "avurudu"
  | "wesak"
  | "fireworks"
  | "hearts"
  | "sparkle";

/** All canvas effects with display metadata */
export const CANVAS_EFFECTS: { value: CanvasEffect; label: string; emoji: string; description: string }[] = [
  { value: "none", label: "None", emoji: "🚫", description: "No effect" },
  { value: "snowfall", label: "Snowfall", emoji: "❄️", description: "Gentle falling snow" },
  { value: "confetti", label: "Win / Confetti", emoji: "🎊", description: "Celebration confetti burst" },
  { value: "halloween", label: "Halloween", emoji: "🎃", description: "Spooky bats & pumpkins" },
  { value: "avurudu", label: "Avurudu", emoji: "🪷", description: "Sinhala & Tamil New Year" },
  { value: "wesak", label: "Wesak", emoji: "🪷", description: "Vesak lanterns & light" },
  { value: "fireworks", label: "Fireworks", emoji: "🎆", description: "Festive fireworks burst" },
  { value: "hearts", label: "Hearts", emoji: "💕", description: "Floating hearts" },
  { value: "sparkle", label: "Sparkle", emoji: "✨", description: "Twinkling sparkles" },
];

// ─── Artboard ──────────────────────────────────

/** An artboard / section with custom dimensions */
export interface Artboard {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  /** Ordered element IDs belonging to this artboard */
  elements: string[];
  /** Vertical order among sibling artboards */
  position: number;
  /** Flex container settings for flow-mode layout within this artboard */
  flexContainer?: FlexContainerProps;
  /** Per-breakpoint flex container overrides */
  responsiveFlexContainer?: Partial<Record<Breakpoint, Partial<FlexContainerProps>>>;
  /** Visual overlay effect for the artboard canvas */
  effect?: CanvasEffect;
}

// ─── Canvas Document ───────────────────────────

/** Metadata for a block group */
export interface BlockGroup {
  id: string;
  name: string;
  /** Element IDs or nested Group IDs belonging to this group */
  memberIds: string[];
  /** Parent group ID if this group is nested inside another group */
  groupId?: string;
  /** Whether the group is locked (prevents ungrouping / individual moves) */
  locked: boolean;
}

/** Top-level canvas document - the full page data */
export interface CanvasDocument {
  /** Schema version for future migrations */
  version: number;
  pageTitle: string;
  /** Ordered artboards (sections) */
  artboards: Artboard[];
  /** Flat element map for O(1) lookup */
  elements: Record<string, ElementNode>;
  /** Global style overrides */
  globalStyles?: Record<string, string>;
  /**
   * Which content locales have been authored.
   * Always includes "en". Presence of "si" or "ta" means
   * those translations are available for this page.
   */
  availableLocales?: ContentLocale[];
  /** Block groups - groups of elements that move/act together */
  groups?: Record<string, BlockGroup>;
  /**
   * Whether the floating search-on-page widget is shown on the published page.
   * Defaults to `true` when missing (existing pages keep the overlay).
   */
  showSearchOverlay?: boolean;
}

// ─── Template Types ────────────────────────────

/** Template metadata */
export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  category: "marketing" | "event" | "brand" | "social" | "custom";
  tags?: string[];
}

/** Full template with canvas document data */
export interface Template {
  meta: TemplateMeta;
  data: CanvasDocument;
}

// ─── Element Registration ──────────────────────

/** Block category for sidebar grouping */
export interface BlockCategory {
  title: string;
  components: string[];
  defaultExpanded?: boolean;
}
