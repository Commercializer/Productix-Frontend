// Single source of truth for DPP field content: the "DPP Sector & Sections
// Requirements" spreadsheet, parsed into one JSON file per sector (see
// ../sector-requirements/*.json - identical copies live at the repo root's
// dpp-sector-requirements/ folder for reference/diffing). Every generic DPP
// section's fields (manufacturer, physical, carbon, recycled, materials,
// substances, repairability, end-of-life, documents, product-specifications)
// are resolved from these files at module load - dpp-sections.ts no longer
// hand-copies field lists into TypeScript, so there's nothing left to drift
// out of sync with the spreadsheet. The sector-specific tabs (Battery's §1-§7
// etc.) used to be the one exception - every sector's own "<sector>-data"
// section here was an empty placeholder, so that content stayed hand-authored
// in sector-sections.ts. As of 2026-08-30 that section is filled from the
// same admin.dpp.gs research (see dpp-sector-requirements.structured.json at
// the repo root), and dpp-sections.ts's getSectorDataGroups reads it the same
// way as every other section - sector-sections.ts's DPP_SECTOR_SECTIONS
// groups are kept only as a fallback for a sector with no JSON content.
import type { DppSector } from "@productix/db";

import battery from "./sector-requirements/battery.json";
import chemicals from "./sector-requirements/chemicals.json";
import construction from "./sector-requirements/construction.json";
import cosmetics from "./sector-requirements/cosmetics.json";
import electronics from "./sector-requirements/electronics.json";
import food from "./sector-requirements/food.json";
import furniture from "./sector-requirements/furniture.json";
import intermediateProducts from "./sector-requirements/intermediate_products.json";
import machinery from "./sector-requirements/machinery.json";
import medical from "./sector-requirements/medical.json";
import other from "./sector-requirements/other.json";
import packaging from "./sector-requirements/packaging.json";
import textile from "./sector-requirements/textile.json";
import toys from "./sector-requirements/toys.json";
import tyre from "./sector-requirements/tyre.json";
import vehicles from "./sector-requirements/vehicles.json";

export type RequirementFieldType =
  | "toggle"
  | "select"
  | "checkbox"
  | "upload"
  | "button"
  | "note"
  | "subtitle"
  | "section-heading"
  | "date"
  | "date-picker"
  | "country-picker"
  | "tags"
  | "custom-rows"
  | "text"
  | "hidden"
  | "nested-section"
  | "file-upload"
  | "tag-select"
  | "description"
  | "info-banner"
  | "info_banner";

export type ConditionRule = { field: string; equals: string | boolean };

export interface RequirementField {
  text: string;
  required: boolean;
  type?: RequirementFieldType;
  options?: string[];
  /** Small caption shown alongside the field (e.g. "descending order of
   * weight") - distinct from the trailing-parenthetical citation text
   * trimFieldLabel already strips off `text` itself. */
  helperText?: string;
  /** "lite" renders helperText more muted/subdued - the only variant the
   * spreadsheet uses today. */
  helperTextStyle?: string;
  placeholder?: string;
  /** For type: "country-picker" - always rendered as a searchable select
   * regardless of this flag today, kept for fidelity with the source. */
  searchable?: boolean;
  /** For type: "tags" - whether more than one option can be selected. */
  multiple?: boolean;
  /** For type: "custom-rows" - an inline repeatable row table's column
   * schema (e.g. Food's QUID "Ingredient"/"%" rows), distinct from the
   * subtitle-delimited repeatable tables splitBySubtitle already finds -
   * see extractCustomRowsBlocks in dpp-sections.ts. */
  rowFields?: { text: string; required: boolean }[];
  /** A callout box (component: "info_banner", or type: "info-banner") - see
   * isCalloutField/toCallout below. `variant` picks the color; either a
   * plain `text` or a `title` + bullet `items` list, depending on which
   * shape the spreadsheet used for this particular banner. */
  component?: string;
  variant?: "success" | "warning" | "danger" | "neutral";
  title?: string;
  items?: string[];
  /** Show this field only when `field` (matched against its sibling's own
   * `text`) currently holds `equals` - e.g. Packaging's "Producer product
   * page URL" only when "Redirect to producer's product page" is Yes. See
   * isFieldVisible in dpp-sections.ts. */
  conditional?: ConditionRule;
  /** Disable (but still show) this field while `field` holds `equals`. */
  disabledWhen?: ConditionRule;
  /** This field is only actually required while `field` holds `equals` -
   * overrides the plain `required` flag when set. See isFieldRequired. */
  requiredWhen?: ConditionRule;
}

export interface RequirementSection {
  label: string;
  fields: RequirementField[];
  /** Overall heading for the section, repeated across its sub-tabs when
   * showMainTitleOnAllSubsections is set - presentational only. */
  mainTitle?: string;
  showMainTitleOnAllSubsections?: boolean;
  /** Free-form explainer copy shown above a section that's really one
   * repeatable table (e.g. product-specifications) - explainerText2 is a
   * second line, explainerTextStyle "lite" renders both muted. */
  explainerText?: string;
  explainerText2?: string;
  explainerTextStyle?: string;
  /** Caps how many rows that section's repeatable table can hold. */
  maxRows?: number;
}

export interface SectorRequirementsDoc {
  sector: DppSector;
  sourceName: string;
  sections: Record<string, RequirementSection>;
}

/** A small number of fields in the spreadsheet export use `label`/`name` (or,
 * for a pure info-banner, `title`) instead of `text` for their display copy
 * (e.g. every sector's Material composition "Material name" select) - `text`
 * doubles as both the display label and the storage/row key everywhere else
 * in this app (slugifyFieldKey, trimFieldLabel, the answers map), so a field
 * missing it outright would crash the first section that renders it. Runs
 * once at module load over every sector's raw JSON import. */
function normalizeField(raw: Record<string, unknown>): RequirementField {
  // Deliberately not falling back to `title` here - a pure info-banner
  // object (title + items, no text) should stay textless so toCallout below
  // doesn't render the same string as both a heading and a body paragraph.
  const text = raw.text ?? raw.label ?? raw.name ?? "";
  return { ...raw, text } as RequirementField;
}

function normalizeDoc(doc: SectorRequirementsDoc): SectorRequirementsDoc {
  return {
    ...doc,
    sections: Object.fromEntries(
      Object.entries(doc.sections).map(([key, section]) => [
        key,
        { ...section, fields: (section.fields as unknown as Record<string, unknown>[]).map(normalizeField) },
      ])
    ),
  };
}

const RAW_SECTOR_REQUIREMENTS: Record<DppSector, SectorRequirementsDoc> = {
  BATTERY: battery as SectorRequirementsDoc,
  CHEMICALS: chemicals as SectorRequirementsDoc,
  CONSTRUCTION: construction as SectorRequirementsDoc,
  COSMETICS: cosmetics as SectorRequirementsDoc,
  ELECTRONICS: electronics as SectorRequirementsDoc,
  FOOD: food as SectorRequirementsDoc,
  FURNITURE: furniture as SectorRequirementsDoc,
  INTERMEDIATE_PRODUCTS: intermediateProducts as SectorRequirementsDoc,
  MACHINERY: machinery as SectorRequirementsDoc,
  MEDICAL: medical as SectorRequirementsDoc,
  OTHER: other as SectorRequirementsDoc,
  PACKAGING: packaging as SectorRequirementsDoc,
  TEXTILE: textile as SectorRequirementsDoc,
  TOYS: toys as SectorRequirementsDoc,
  TYRE: tyre as SectorRequirementsDoc,
  VEHICLES: vehicles as SectorRequirementsDoc,
};

export const SECTOR_REQUIREMENTS: Record<DppSector, SectorRequirementsDoc> = Object.fromEntries(
  Object.entries(RAW_SECTOR_REQUIREMENTS).map(([sector, doc]) => [sector, normalizeDoc(doc)])
) as Record<DppSector, SectorRequirementsDoc>;

/** A callout/banner entry (the spreadsheet's `component: "info_banner"`
 * fields, or a standalone `type: "info-banner"`/"info_banner"` object) -
 * informational copy with nothing for the producer to answer, never a real
 * field. See toCallout/getCallouts and dpp-sections.ts's DppFieldGroup/
 * DppRepeatableBlock `callouts`. */
export function isCalloutField(field: RequirementField): boolean {
  return field.component === "info_banner" || field.type === "info-banner" || field.type === "info_banner";
}

/** A field is real (answerable) unless it's decorative/structural in the
 * source spreadsheet - a regulatory citation ("note"), a group heading
 * ("subtitle" or, for a sector-data section's own top-of-section citation,
 * "section-heading"), an "Add row" action ("button") with nothing to store,
 * a callout banner (see isCalloutField), free-standing explainer copy
 * ("description"), a field with no visible purpose ("hidden"), or a
 * repeatable sub-table declared inline ("nested-section" - only used inside
 * product-packaging today, which renders through PackagingLayersPanel/View
 * instead of this generic path; excluded here as a safety net). */
export function isAnswerableField(field: RequirementField): boolean {
  return (
    field.type !== "note" &&
    field.type !== "subtitle" &&
    field.type !== "button" &&
    field.type !== "section-heading" &&
    field.type !== "description" &&
    field.type !== "hidden" &&
    field.type !== "nested-section" &&
    !isCalloutField(field)
  );
}

export interface RequirementCallout {
  variant: "success" | "warning" | "danger" | "neutral";
  text?: string;
  title?: string;
  items?: string[];
}

export function toCallout(field: RequirementField): RequirementCallout {
  return { variant: field.variant ?? "neutral", text: field.text || undefined, title: field.title, items: field.items };
}

export function getCallouts(fields: RequirementField[]): RequirementCallout[] {
  return fields.filter(isCalloutField).map(toCallout);
}

/** Looks up one JSON section's real (answerable) fields for a sector, or
 * `undefined` if that sector's spreadsheet doesn't have the section at all -
 * the caller uses that to decide whether the section applies to the sector,
 * replacing the old hand-maintained ESPR_EXCLUDED_GENERIC_SECTIONS map. */
export function getRequirementFields(sector: DppSector, jsonSectionKey: string): RequirementField[] | undefined {
  const section = SECTOR_REQUIREMENTS[sector]?.sections[jsonSectionKey];
  if (!section) return undefined;
  return section.fields.filter(isAnswerableField);
}

/** Same lookup, but unfiltered - keeps "note"/"subtitle"/"button" markers in
 * place so splitBySubtitle can use them to find sub-group boundaries. */
export function getRawFields(sector: DppSector, jsonSectionKey: string): RequirementField[] | undefined {
  return SECTOR_REQUIREMENTS[sector]?.sections[jsonSectionKey]?.fields;
}

/** Callout banners for a flat (no-subtitle) section, e.g. Carbon footprint's
 * "Max lifecycle CF thresholds..." note or Recycled content's 2031 targets -
 * a subtitled section's own banners come from splitBySubtitle's per-segment
 * `callouts` instead (see getSingleBlockSection/getSubstancesSpec/
 * getSectorDataGroups in dpp-sections.ts), so this is only called for
 * physical/carbon/recycled/repairability in getOrderedDppSections. */
export function getSectionCallouts(sector: DppSector, jsonSectionKey: string): RequirementCallout[] {
  return getCallouts(getRawFields(sector, jsonSectionKey) ?? []);
}

/** Splits a JSON section's raw fields into labeled segments at each
 * "subtitle" field - the spreadsheet's own way of marking sub-groups (e.g.
 * substances-of-concern-svhc's "Substances of Concern" repeatable row schema
 * vs. its "Compliance & certifications" flat fields; end-of-life's flat
 * fields vs. its "End-of-life assessment records" repeatable row schema).
 * Fields before the first subtitle land in a `label: ""` segment. Segments
 * with no real fields (e.g. a trailing subtitle with only a note before the
 * next one) are dropped. */
export function splitBySubtitle(fields: RequirementField[]): { label: string; fields: RequirementField[]; callouts: RequirementCallout[] }[] {
  const segments: { label: string; fields: RequirementField[]; callouts: RequirementCallout[] }[] = [{ label: "", fields: [], callouts: [] }];
  for (const field of fields) {
    if (field.type === "subtitle") {
      segments.push({ label: field.text, fields: [], callouts: [] });
    } else if (isCalloutField(field)) {
      segments.at(-1)!.callouts.push(toCallout(field));
    } else if (isAnswerableField(field)) {
      segments.at(-1)!.fields.push(field);
    }
  }
  return segments.filter((s) => s.fields.length > 0);
}
