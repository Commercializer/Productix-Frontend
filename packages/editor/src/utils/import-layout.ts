/* ─────────────────────────────────────────────
 * Import Layout - Convert AI/external JSON into
 * a CanvasDocument the editor can load.
 *
 * The shape we accept is intentionally flatter than
 * CanvasDocument so it is easy to hand-author or
 * AI-generate - IDs, zIndex, defaults, etc. are
 * filled in here.
 * ──────────────────────────────────────────── */

import type { CanvasDocument, ElementNode } from "@productix/types";
import { createDefaultArtboard, createDefaultElement, defaultTransform } from "./defaults";
import { generateElementId } from "./id";
import { getAllElements, getElementDefinition } from "../elements/registry";

export interface ImportLayoutInput {
  pageTitle?: string;
  artboard?: {
    width?: number;
    height?: number;
    background?: string;
  };
  elements: Array<{
    type: string;
    props?: Record<string, unknown>;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    rotation?: number;
    zIndex?: number;
  }>;
}

export interface ImportResult {
  ok: true;
  document: CanvasDocument;
  warnings: string[];
}

export interface ImportFailure {
  ok: false;
  error: string;
}

const MIN_W = 320;
const MAX_W = 1440;
const MIN_H = 400;
const MAX_H = 8000;

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Parse + validate a JSON string and convert it to a
 * CanvasDocument. On invalid JSON or missing fields
 * we fail with a clear message instead of producing
 * a half-built document.
 */
export function importLayoutFromJson(raw: string): ImportResult | ImportFailure {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return { ok: false, error: `Invalid JSON: ${(e as Error).message}` };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, error: "JSON root must be an object" };
  }

  const input = parsed as Partial<ImportLayoutInput>;
  if (!Array.isArray(input.elements)) {
    return { ok: false, error: "`elements` array is required" };
  }

  const warnings: string[] = [];

  const ab = createDefaultArtboard({
    width: clamp(input.artboard?.width ?? 428, MIN_W, MAX_W),
    height: clamp(input.artboard?.height ?? 926, MIN_H, MAX_H),
    backgroundColor: input.artboard?.background ?? "#ffffff",
  });
  ab.elements = [];

  const elements: Record<string, ElementNode> = {};

  input.elements.forEach((raw, idx) => {
    if (!raw || typeof raw !== "object" || typeof raw.type !== "string") {
      warnings.push(`Element #${idx + 1} skipped - missing "type"`);
      return;
    }
    const def = getElementDefinition(raw.type);
    if (!def) {
      warnings.push(`Element #${idx + 1} skipped - unknown type "${raw.type}"`);
      return;
    }
    const mergedProps = { ...def.defaultProps, ...(raw.props ?? {}) };
    const transform = defaultTransform({
      x: typeof raw.x === "number" ? raw.x : 0,
      y: typeof raw.y === "number" ? raw.y : 0,
      width: typeof raw.width === "number" ? raw.width : def.defaultTransform.width ?? 200,
      height: typeof raw.height === "number" ? raw.height : def.defaultTransform.height ?? 80,
      rotation: typeof raw.rotation === "number" ? raw.rotation : 0,
    });
    const id = generateElementId();
    const node = createDefaultElement(id, raw.type, mergedProps, transform);
    node.zIndex = typeof raw.zIndex === "number" ? raw.zIndex : idx;
    elements[id] = node;
    ab.elements.push(id);
  });

  if (Object.keys(elements).length === 0) {
    return { ok: false, error: "No valid elements after parsing" };
  }

  const document: CanvasDocument = {
    version: 1,
    pageTitle: typeof input.pageTitle === "string" && input.pageTitle ? input.pageTitle : "AI Generated Page",
    artboards: [ab],
    elements,
  };

  return { ok: true, document, warnings };
}

/* ─── AI Prompt ─────────────────────────────── */

export interface AIBrief {
  productName?: string;
  productCategory?: string;
  productDescription?: string;
  vibe?: string;
  backgroundColor?: string;
  accentColor?: string;
  audience?: string;
  keyFeatures?: string;
  ctaText?: string;
  extraNotes?: string;
}

function formatBrief(brief?: AIBrief): string {
  if (!brief) return "";
  const lines: string[] = [];
  if (brief.productName) lines.push(`- Product name: ${brief.productName}`);
  if (brief.productCategory) lines.push(`- Category: ${brief.productCategory}`);
  if (brief.productDescription) lines.push(`- What it is: ${brief.productDescription}`);
  if (brief.vibe) lines.push(`- Vibe / style: ${brief.vibe}`);
  if (brief.backgroundColor) lines.push(`- Preferred background color: ${brief.backgroundColor} (use this for the artboard background)`);
  if (brief.accentColor) lines.push(`- Accent / brand color: ${brief.accentColor} (use this for buttons, highlights, callouts)`);
  if (brief.audience) lines.push(`- Target audience: ${brief.audience}`);
  if (brief.keyFeatures) lines.push(`- Key features / selling points to highlight: ${brief.keyFeatures}`);
  if (brief.ctaText) lines.push(`- Primary call-to-action text: "${brief.ctaText}"`);
  if (brief.extraNotes) lines.push(`- Extra notes: ${brief.extraNotes}`);
  if (lines.length === 0) return "";
  return `\n# DESIGN BRIEF (from the user - honour these)\n${lines.join("\n")}\n`;
}

/**
 * Build a copy-paste prompt that explains the JSON
 * schema + lists every registered element type with
 * its props and default size. The catalog is generated
 * from the live element registry so it stays in sync.
 *
 * Pass a `brief` to inject the user's answers about the
 * product (name, category, colors, audience, etc.) so
 * the LLM produces a more targeted layout.
 */
export function buildAIPrompt(brief?: AIBrief): string {
  const defs = getAllElements();

  const catalog = defs
    .map((d) => {
      const propsList = Object.entries(d.defaultProps)
        .map(([k, v]) => `    "${k}": ${JSON.stringify(v)}`)
        .join(",\n");
      const w = d.defaultTransform.width ?? 200;
      const h = d.defaultTransform.height ?? 80;
      return `### ${d.label}  (type: "${d.type}", category: ${d.category})
default size: ${w} × ${h}
props (defaults shown - override any you need):
{
${propsList}
}`;
    })
    .join("\n\n");

  const briefSection = formatBrief(brief);

  return `You are designing a single mobile product showcase page for the Productix page builder.
Return STRICT JSON ONLY - no prose, no markdown fences, no commentary. The user pastes your output into the importer.

# CANVAS
- Mobile-first artboard. Default size 428 × 926 px (you may pick any width 320–1440, height 400–8000).
- All element coordinates are absolute pixels from the artboard's top-left corner.
- Element stacking: later items in the \`elements\` array sit on top. You may also set \`zIndex\`.
- Keep elements within the artboard bounds. Leave reasonable padding (~20–24 px) on the sides.

# OUTPUT SHAPE
{
  "pageTitle": "string (optional)",
  "artboard": {
    "width": 428,
    "height": 926,
    "background": "#ffffff"      // any CSS color
  },
  "elements": [
    {
      "type": "<one of the types in the catalog>",
      "props": { /* element-specific, see catalog */ },
      "x": 0, "y": 0,
      "width": 0, "height": 0,
      "rotation": 0,                // optional
      "zIndex": 0                   // optional
    }
  ]
}

# ELEMENT CATALOG

${catalog}

# EXAMPLE OUTPUT
{
  "pageTitle": "Energy Drink Launch",
  "artboard": { "width": 428, "height": 926, "background": "#0f172a" },
  "elements": [
    { "type": "heading", "props": { "text": "Unstoppable", "color": "#fff", "fontSize": 48, "textAlign": "center" }, "x": 24, "y": 80, "width": 380, "height": 70 },
    { "type": "text", "props": { "text": "The new ice-cold energy hit", "color": "#cbd5e1", "fontSize": 16, "textAlign": "center" }, "x": 24, "y": 160, "width": 380, "height": 40 },
    { "type": "image", "props": { "src": "https://placehold.co/300x300", "borderRadius": 16 }, "x": 64, "y": 220, "width": 300, "height": 300 },
    { "type": "button", "props": { "text": "Shop now", "background": "#22d3ee", "color": "#0f172a", "borderRadius": 28 }, "x": 88, "y": 560, "width": 252, "height": 52 }
  ]
}

# RULES
1. Output JSON only. No \`\`\`json fences. No leading or trailing text.
2. Only use \`type\` values from the catalog above. Unknown types will be dropped.
3. Every element MUST have x, y, width, height (numbers).
4. Use real placeholder image URLs (e.g. https://placehold.co/<w>x<h>) for image/video src - do NOT invent unreachable URLs.
5. Compose 6–14 elements for a typical mobile showcase page.
${briefSection}
Now design the page based on the brief above${brief ? "" : " I give next"}.`;
}
