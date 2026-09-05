// Shared row model for every DPP section that's really a repeatable table in
// the spreadsheet (see sector-requirements.ts's splitBySubtitle) rather than
// a flat field list: Material composition, Substances of concern's SVHC
// list, End-of-life assessment records, Repair & usage history's two logs,
// and Product specifications' custom rows. One generic component
// (RepeatableRowsPanel/RepeatableRowsView, see repeatable-rows-panel.tsx and
// 01/[gtin]/repeatable-rows-view.tsx) renders all of them, driven by a
// per-section RowFieldDef[] schema derived straight from that section's own
// JSON field list - see dpp-sections.ts's REPEATABLE_SECTIONS.
import type { RequirementField } from "./sector-requirements";

export interface RowFieldDef {
  /** Storage key within the row object - a stable slug, not the display
   * label (labels can be long/punctuated; see slugifyFieldKey). */
  key: string;
  label: string;
  type?: "number" | "date" | "url" | "toggle" | "select" | "checkbox";
  /** For "select": the fixed choices. For "checkbox": a multi-select group
   * (e.g. materials' Flags: CRM/Recycled) instead of a single Yes/No box. */
  options?: string[];
  /** Example text shown in the empty input (e.g. SVHC's "DEHP", "117-81-7") -
   * see RowFieldInput in repeatable-rows-panel.tsx. */
  placeholder?: string;
}

export type Row = Record<string, string>;

export function slugifyFieldKey(label: string): string {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  // A label with no letters/digits at all (e.g. QUID's "%" column) would
  // otherwise slugify to "", silently colliding every such field onto the
  // same storage key - fall back to a deterministic key derived from the
  // label's own character codes instead.
  if (slug) return slug;
  return `field-${[...label].map((c) => c.codePointAt(0)).join("")}`;
}

/** Maps a JSON section's real fields (see isAnswerableField) to the row
 * schema used by RepeatableRowsPanel/View - "toggle"/"select"/"checkbox"
 * pass through, everything else (plain text, or a bare "number"/"date"/"url"
 * hint the spreadsheet doesn't actually encode for these row fields) renders
 * as a plain text input. */
export function toRowFieldDefs(fields: RequirementField[]): RowFieldDef[] {
  return fields.map((f) => ({
    key: slugifyFieldKey(f.text),
    label: f.text,
    type: f.type === "toggle" || f.type === "select" || f.type === "checkbox" ? f.type : undefined,
    options: f.options,
    placeholder: f.placeholder,
  }));
}

export function createEmptyRow(fields: RowFieldDef[]): Row {
  return Object.fromEntries(fields.map((f) => [f.key, ""]));
}

function isRowNonEmpty(row: Row, fields: RowFieldDef[]): boolean {
  return fields.some((f) => row[f.key]?.trim());
}

/** Trims every field, drops rows left with nothing filled in - mirrors
 * prunePackagingLayers' isLayerNonEmpty check for the packaging section. */
export function pruneRows(rows: unknown, fields: RowFieldDef[]): Row[] {
  if (!Array.isArray(rows)) return [];
  return (rows as Row[])
    .map((row) => Object.fromEntries(fields.map((f) => [f.key, row[f.key]?.trim() ?? ""])))
    .filter((row) => isRowNonEmpty(row, fields));
}
