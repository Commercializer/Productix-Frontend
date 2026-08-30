import type { DppSector } from "@productix/db";
import { DPP_SECTOR_SECTIONS, type DppSectionField } from "./sector-sections";
import {
  SECTOR_REQUIREMENTS,
  getRequirementFields,
  getRawFields,
  splitBySubtitle,
  type RequirementField,
} from "./sector-requirements";
import { toRowFieldDefs, pruneRows, type Row, type RowFieldDef } from "./repeatable-rows";

export type { DppSectionField };

export interface DppFieldGroup {
  label: string;
  fields: DppSectionField[];
}

/** One repeatable-row table within a section (Material composition,
 * Substances' SVHC list, End-of-life assessment records, Repair & usage
 * history's two logs, Product specifications' custom rows) - see
 * repeatable-rows.ts and the shared RepeatableRowsPanel/View components.
 * `key` namespaces this block's rows within the section's answers object
 * (see pruneSectionAnswers below) so a section can carry more than one
 * (repair-history has two: events + repairs). */
export interface DppRepeatableBlock {
  key: string;
  label: string;
  fields: RowFieldDef[];
  addLabel: string;
  emptyLabel: string;
  max?: number;
}

export interface DppSectionSpec {
  key: string;
  sidebarLabel: string;
  /** Lucide icon component name, resolved by the page via a small lookup map. */
  icon: string;
  title: string;
  directive: string;
  fields?: DppSectionField[];
  /** Only set for sections that render as labeled sub-groups (Manufacturer &
   * importer's Manufacturer/Importer split, Substances' Compliance &
   * certifications group) instead of - or alongside - a flat field list. */
  groups?: DppFieldGroup[];
  /** Repeatable tables rendered after `fields`/`groups`, if any - see
   * DppRepeatableBlock. */
  repeatable?: DppRepeatableBlock[];
}

/** Maps this app's internal section key to the spreadsheet's own kebab-case
 * section key (see sector-requirements/<sector>.json) - the only piece of
 * "which key means what" left hand-maintained; everything else (field text,
 * required flags, types, options, which sectors even have the section) is
 * resolved from the JSON at call time in getOrderedDppSections below. */
const SECTION_JSON_KEY: Record<string, string> = {
  manufacturer: "manufacturer-importer",
  "custom-specifications": "product-specifications",
  physical: "physical-properties",
  carbon: "carbon-footprint",
  recycled: "recycled-content",
  materials: "material-composition",
  substances: "substances-of-concern-svhc",
  repairability: "repairability",
  eol: "end-of-life",
  "repair-history": "repair-usage-history",
  documents: "documents-links",
};

/** Icon + regulatory directive per section - presentational chrome with no
 * JSON counterpart (the spreadsheet has no icon/citation columns), so this
 * is the one place content stays hand-authored. Sidebar label and card
 * title are NOT here - see sectionLabel below, which reads the spreadsheet's
 * own `label` for that section instead of a second hand-typed copy. */
const SECTION_CHROME: Record<string, { icon: string; directive: string }> = {
  manufacturer: { icon: "Building2", directive: "EU Regulation 2024/1781 (ESPR) · Art. 7(2)(a) · Market Surveillance Regulation 2019/1020" },
  "custom-specifications": { icon: "ClipboardList", directive: "Custom producer-defined specification rows" },
  physical: { icon: "Ruler", directive: "EU Regulation 2024/1781 (ESPR) · Art. 7(1) · Packaging & Packaging Waste Regulation 2025/40" },
  carbon: { icon: "Cloud", directive: "EU Regulation 2024/1781 (ESPR) · Art. 7(2)(b)" },
  recycled: { icon: "Recycle", directive: "EU Regulation 2024/1781 (ESPR) · Art. 7(2)(c)" },
  materials: { icon: "Layers", directive: "EU Regulation 2024/1781 (ESPR) · Art. 7(5) · Critical Raw Materials Act (CRMA) 2024/1252" },
  substances: { icon: "FlaskConical", directive: "REACH Regulation 1907/2006 · Art. 33 · EU Regulation 2024/1781 (ESPR) · Art. 7(5)(b) · SVHC Candidate List (ECHA)" },
  repairability: { icon: "Wrench", directive: "EU Regulation 2024/1781 (ESPR) · Art. 7(2)(e) · Right to Repair Directive 2024/1799/EU" },
  eol: { icon: "Trash2", directive: "EU Regulation 2024/1781 (ESPR) · Art. 7(2)(f) · Waste Framework Directive 2008/98/EC" },
  "repair-history": { icon: "History", directive: "GS1 EPCIS 2.0-compatible lifecycle/usage & repair-refurbishment event log" },
  documents: { icon: "FileText", directive: "EU Regulation 2024/1781 (ESPR) · Art. 7(2)(g) · CE Marking Directive · Machinery Regulation 2023/1230" },
};

function sectionLabel(sector: DppSector, jsonKey: string): string {
  return SECTOR_REQUIREMENTS[sector]?.sections[jsonKey]?.label ?? jsonKey;
}

function toDppField(f: RequirementField): DppSectionField {
  return {
    text: f.text,
    required: f.required,
    // "checkbox" (a bare yes/no with no options list, e.g. sector-data's
    // "FSC (Checkbox)") renders the same as "toggle" - DppFieldType has no
    // separate checkbox control, and a plain on/off is exactly what one is.
    type:
      f.type === "toggle" || f.type === "checkbox"
        ? "toggle"
        : f.type === "select" || f.type === "upload" || f.type === "date"
          ? f.type
          : undefined,
    options: f.options,
  };
}

function getFlatFields(sector: DppSector, jsonKey: string): DppSectionField[] | undefined {
  return getRequirementFields(sector, jsonKey)?.map(toDppField);
}

/** "Product identification" isn't a DppSectionSpec of its own - it's
 * custom-coded in the DPP page (name/sector/identifier). These are the
 * sector-dependent *extra* fields that render there (Brand name/Model
 * number/Product category/HS Code, plus whatever else that sector's
 * product-identification section adds) - resolved straight from the
 * spreadsheet, minus the three identity fields (Product name/GTIN-14/
 * Sector) the page already captures through dedicated controls. A field
 * that's really a repeatable table hint in disguise (TEXTILE's "Product
 * variants - Add Variant (...)") is dropped here rather than rendered as a
 * single confusing text input - see this file's known-gaps note at the
 * bottom. */
export function getIdentificationExtraFields(sector: DppSector | null): DppSectionField[] {
  if (!sector) return [];
  const fields = getRequirementFields(sector, "product-identification") ?? [];
  return fields
    .filter((f) => !["Product name", "GTIN-14", "Sector"].includes(f.text) && !f.text.startsWith("Product variants"))
    .map(toDppField);
}

function getManufacturerGroups(sector: DppSector): DppFieldGroup[] | undefined {
  const fields = getFlatFields(sector, "manufacturer-importer");
  if (!fields) return undefined;
  return [
    { label: "Manufacturer", fields: fields.filter((f) => !f.text.startsWith("Importer")) },
    { label: "Importer", fields: fields.filter((f) => f.text.startsWith("Importer")) },
  ];
}

function toBlock(key: string, segment: { label: string; fields: RequirementField[] }, addLabel: string, emptyLabel: string): DppRepeatableBlock {
  return { key, label: segment.label, fields: toRowFieldDefs(segment.fields), addLabel, emptyLabel };
}

/** A single flat-field-list section resolved as one repeatable block - used
 * for sections that are entirely a table in the spreadsheet, with no flat
 * fields alongside (Material composition, Product specifications). */
function getSingleBlockSection(sector: DppSector, jsonKey: string, blockKey: string, addLabel: string, emptyLabel: string): DppRepeatableBlock[] | undefined {
  const raw = getRawFields(sector, jsonKey);
  if (!raw) return undefined;
  const [segment] = splitBySubtitle(raw);
  return segment ? [toBlock(blockKey, segment, addLabel, emptyLabel)] : undefined;
}

/** Substances of concern: the spreadsheet's own "Substances of Concern
 * (SVHC)" subtitle marks a repeatable per-substance row table; its
 * "Compliance & certifications" subtitle marks a flat field group (CE
 * marking, REACH/RoHS toggles, energy class...) - see splitBySubtitle. */
function getSubstancesSpec(sector: DppSector): { groups?: DppFieldGroup[]; repeatable?: DppRepeatableBlock[] } | undefined {
  const raw = getRawFields(sector, "substances-of-concern-svhc");
  if (!raw) return undefined;
  const segments = splitBySubtitle(raw);
  const svhc = segments.find((s) => s.label.toLowerCase().includes("substances"));
  const compliance = segments.find((s) => s.label.toLowerCase().includes("compliance"));
  return {
    repeatable: svhc ? [toBlock("svhc", svhc, "Add substance", "No substances added yet.")] : undefined,
    groups: compliance ? [{ label: compliance.label, fields: compliance.fields.map(toDppField) }] : undefined,
  };
}

/** End of life: a flat field list (EU waste code, deposit return scheme...)
 * followed by a repeatable "End-of-life assessment records" table. */
function getEolSpec(sector: DppSector): { fields?: DppSectionField[]; repeatable?: DppRepeatableBlock[] } | undefined {
  const raw = getRawFields(sector, "end-of-life");
  if (!raw) return undefined;
  const segments = splitBySubtitle(raw);
  const flat = segments.find((s) => !s.label.toLowerCase().includes("assessment"));
  const records = segments.find((s) => s.label.toLowerCase().includes("assessment"));
  return {
    fields: flat ? flat.fields.map(toDppField) : undefined,
    repeatable: records ? [toBlock("records", records, "Add assessment record", "No end-of-life assessment records yet.")] : undefined,
  };
}

/** Repair & usage history: two independent repeatable logs, no flat fields -
 * a section with no pre-existing app equivalent before this rebuild. */
function getRepairHistoryBlocks(sector: DppSector): DppRepeatableBlock[] | undefined {
  const raw = getRawFields(sector, "repair-usage-history");
  if (!raw) return undefined;
  const segments = splitBySubtitle(raw);
  const events = segments.find((s) => s.label.toLowerCase().includes("usage"));
  const repairs = segments.find((s) => s.label.toLowerCase().includes("repair"));
  const blocks: DppRepeatableBlock[] = [];
  if (events) blocks.push(toBlock("events", events, "Add event", "No lifecycle or usage events recorded yet."));
  if (repairs) blocks.push(toBlock("repairs", repairs, "Add repair record", "No repair records yet."));
  return blocks.length > 0 ? blocks : undefined;
}

/** Maps a sector to its own "<sector>-data" JSON section key (see
 * sector-requirements/<sector>.json) - the spreadsheet names this section
 * differently per sector (battery-data, chemical-product-data, ...), unlike
 * every generic section's shared key, so it can't join SECTION_JSON_KEY
 * above. OTHER has no such section in the spreadsheet (confirmed - it's the
 * one sector with nothing sector-specific to declare). */
const SECTOR_DATA_JSON_KEY: Partial<Record<DppSector, string>> = {
  BATTERY: "battery-data",
  CHEMICALS: "chemical-product-data",
  CONSTRUCTION: "construction-product-data",
  COSMETICS: "cosmetic-product-data",
  ELECTRONICS: "electronics-ict-data",
  FOOD: "food-product-data",
  FURNITURE: "furniture-data",
  INTERMEDIATE_PRODUCTS: "intermediate-product-data",
  MACHINERY: "machinery-data",
  MEDICAL: "medical-device-data",
  PACKAGING: "packaging-data",
  TEXTILE: "textile-data",
  TOYS: "toy-safety-data",
  TYRE: "tyre-data",
  VEHICLES: "vehicle-data",
};

/** The sector-specific tab's own numbered sub-sections (Battery's §1-§7 etc.)
 * - resolved from that sector's own "<sector>-data" JSON section the same
 * way every other multi-group section is (split at each "subtitle" field,
 * see splitBySubtitle), with its top-of-section "section-heading" field (a
 * regulatory citation, not a real group) dropped by isAnswerableField. Falls
 * back to sector-sections.ts's hand-authored DPP_SECTOR_SECTIONS groups only
 * when the JSON has nothing for this sector - a safety net, not the normal
 * path, since every sector in SECTOR_DATA_JSON_KEY has had JSON content
 * since the 2026-08-30 sector-requirements fill. Exported so the dashboard
 * DPP editor page can resolve the same groups directly (sidebar
 * completeness/"missing required" checks) without re-deriving them. */
export function getSectorDataGroups(sector: DppSector): DppFieldGroup[] | undefined {
  const jsonKey = SECTOR_DATA_JSON_KEY[sector];
  const raw = jsonKey ? getRawFields(sector, jsonKey) : undefined;
  if (raw && raw.length > 0) {
    const groups = splitBySubtitle(raw).map((seg) => ({ label: seg.label, fields: seg.fields.map(toDppField) }));
    if (groups.length > 0) return groups;
  }
  return DPP_SECTOR_SECTIONS[sector]?.groups;
}

/** Title/directive for the sector-specific tab: sector-sections.ts's
 * hand-authored copy where one exists (it names the actual regulation
 * articles, e.g. "EU Battery Regulation 2023/1542 · Art. 3 ..." - much more
 * specific than the spreadsheet's own citation), else the JSON section's own
 * label/citation - used today only by INTERMEDIATE_PRODUCTS, which has JSON
 * sector-data but no DPP_SECTOR_SECTIONS entry (that hand-authored map never
 * covered it - see its own doc comment). */
function getSectorDataChrome(sector: DppSector, jsonKey: string | undefined, raw: RequirementField[] | undefined): { title: string; directive: string } {
  const spec = DPP_SECTOR_SECTIONS[sector];
  if (spec) return { title: spec.title, directive: spec.directive };
  const citation = raw?.find((f) => f.type === "section-heading" || f.type === "note");
  return { title: jsonKey ? sectionLabel(sector, jsonKey) : "Sector data", directive: citation?.text ?? "" };
}

/** Every section, in the spreadsheet's own ordering, resolved fresh from
 * SECTOR_REQUIREMENTS for the given sector - a section that sector's JSON
 * doesn't have is simply absent from the result (this replaces the old
 * hand-maintained ESPR_EXCLUDED_GENERIC_SECTIONS map: presence is now
 * whatever the spreadsheet says it is, per sector, checked directly). The
 * sector-specific section (see getSectorDataGroups above) is spliced in
 * between "materials" and "substances", matching every sector file's own key
 * order. "packaging" renders via PackagingLayersPanel/View, not the generic
 * renderer - product-packaging's JSON content documents that same PPWR
 * layer structure for reference, but the panel's own hand-typed schema
 * (packaging-layers.ts) is richer (GTIN lookup, nested components, per-
 * country EPR registrations) than a flat field list could drive, so it's
 * kept as a static entry rather than sourced from spreadsheet content; every
 * sector gets it (matching its universal presence in the JSON). */
export function getOrderedDppSections(sector: DppSector | null): DppSectionSpec[] {
  if (!sector) return [];
  const sections: DppSectionSpec[] = [];
  const push = (key: string, jsonKey: string, extra: Partial<DppSectionSpec>) => {
    if (!extra.fields && !extra.groups && !extra.repeatable) return;
    sections.push({ key, sidebarLabel: sectionLabel(sector, jsonKey), title: sectionLabel(sector, jsonKey), ...SECTION_CHROME[key]!, ...extra });
  };

  push("manufacturer", "manufacturer-importer", { groups: getManufacturerGroups(sector) });
  push("custom-specifications", "product-specifications", {
    repeatable: getSingleBlockSection(sector, "product-specifications", "rows", "Add specification", "No custom specifications added yet."),
  });
  push("physical", "physical-properties", { fields: getFlatFields(sector, "physical-properties") });
  push("carbon", "carbon-footprint", { fields: getFlatFields(sector, "carbon-footprint") });
  push("recycled", "recycled-content", { fields: getFlatFields(sector, "recycled-content") });
  push("materials", "material-composition", {
    repeatable: getSingleBlockSection(sector, "material-composition", "rows", "Add material", "No materials added yet."),
  });

  const sectorDataJsonKey = SECTOR_DATA_JSON_KEY[sector];
  const sectorGroups = getSectorDataGroups(sector);
  if (sectorGroups && sectorGroups.length > 0) {
    const { title, directive } = getSectorDataChrome(sector, sectorDataJsonKey, sectorDataJsonKey ? getRawFields(sector, sectorDataJsonKey) : undefined);
    sections.push({ key: "sector", sidebarLabel: title, icon: "Boxes", title, directive, groups: sectorGroups });
  }

  const substancesSpec = getSubstancesSpec(sector);
  push("substances", "substances-of-concern-svhc", { groups: substancesSpec?.groups, repeatable: substancesSpec?.repeatable });

  sections.push({
    key: "packaging",
    sidebarLabel: "Product packaging",
    icon: "PackageCheck",
    title: "Packaging Layers (PPWR Art. 12)",
    directive: "Packaging Regulation (EU) 2025/40, Art. 12 — declaration per packaging layer. Max. 15 layers.",
  });

  push("repairability", "repairability", { fields: getFlatFields(sector, "repairability") });

  const eolSpec = getEolSpec(sector);
  push("eol", "end-of-life", { fields: eolSpec?.fields, repeatable: eolSpec?.repeatable });

  push("repair-history", "repair-usage-history", { repeatable: getRepairHistoryBlocks(sector) });
  push("documents", "documents-links", { fields: getFlatFields(sector, "documents-links") });

  return sections;
}

/** Trims/prunes one section's saved answers before persisting - mirrors
 * prunePackagingLayers for the "packaging" exception. Flat fields (stored
 * directly on the section's answer object, keyed by field text - unchanged
 * from before this rebuild) are trimmed and dropped if empty; repeatable
 * blocks (stored under the reserved "__rows" key, one array per block key -
 * see DppRepeatableBlock) are pruned via pruneRows against that block's own
 * field schema, resolved fresh from the spreadsheet for this sector so a
 * stale/renamed row key can never silently persist. */
export function pruneSectionAnswers(sector: DppSector, sectionKey: string, raw: Record<string, unknown>): Record<string, unknown> {
  const spec = getOrderedDppSections(sector).find((s) => s.key === sectionKey);
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (key === "__rows") continue;
    const trimmed = typeof value === "string" ? value.trim() : "";
    if (trimmed) result[key] = trimmed;
  }

  const rawRows = raw.__rows;
  if (spec?.repeatable && rawRows && typeof rawRows === "object") {
    const rowsOut: Record<string, Row[]> = {};
    for (const block of spec.repeatable) {
      const pruned = pruneRows((rawRows as Record<string, unknown>)[block.key], block.fields);
      if (pruned.length > 0) rowsOut[block.key] = pruned;
    }
    if (Object.keys(rowsOut).length > 0) result.__rows = rowsOut;
  }

  return result;
}

// Known gap: TEXTILE's product-identification lists a "Product variants -
// Add Variant (Variant GTIN, Size, Color, SKU)" field that names a
// repeatable table's columns in plain text rather than as real structured
// row fields (unlike Material composition/Substances/End-of-life records/
// Repair history, which the spreadsheet does give real per-column field
// entries for - see splitBySubtitle). getIdentificationExtraFields drops it
// rather than rendering a single confusing free-text input for it; building
// the actual Variant GTIN/Size/Color/SKU repeatable table is a small
// follow-up (same RepeatableRowsPanel/View this rebuild introduces), not
// done in this pass.
