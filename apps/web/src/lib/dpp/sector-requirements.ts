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

export type RequirementFieldType = "toggle" | "select" | "checkbox" | "upload" | "button" | "note" | "subtitle" | "section-heading" | "date";

export interface RequirementField {
  text: string;
  required: boolean;
  type?: RequirementFieldType;
  options?: string[];
}

export interface RequirementSection {
  label: string;
  fields: RequirementField[];
}

export interface SectorRequirementsDoc {
  sector: DppSector;
  sourceName: string;
  sections: Record<string, RequirementSection>;
}

export const SECTOR_REQUIREMENTS: Record<DppSector, SectorRequirementsDoc> = {
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

/** A field is real (answerable) unless it's decorative/structural in the
 * source spreadsheet - a regulatory citation ("note"), a group heading
 * ("subtitle" or, for a sector-data section's own top-of-section citation,
 * "section-heading"), or an "Add row" action ("button") with nothing to
 * store. */
export function isAnswerableField(field: RequirementField): boolean {
  return field.type !== "note" && field.type !== "subtitle" && field.type !== "button" && field.type !== "section-heading";
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

/** Splits a JSON section's raw fields into labeled segments at each
 * "subtitle" field - the spreadsheet's own way of marking sub-groups (e.g.
 * substances-of-concern-svhc's "Substances of Concern" repeatable row schema
 * vs. its "Compliance & certifications" flat fields; end-of-life's flat
 * fields vs. its "End-of-life assessment records" repeatable row schema).
 * Fields before the first subtitle land in a `label: ""` segment. Segments
 * with no real fields (e.g. a trailing subtitle with only a note before the
 * next one) are dropped. */
export function splitBySubtitle(fields: RequirementField[]): { label: string; fields: RequirementField[] }[] {
  const segments: { label: string; fields: RequirementField[] }[] = [{ label: "", fields: [] }];
  for (const field of fields) {
    if (field.type === "subtitle") {
      segments.push({ label: field.text, fields: [] });
    } else if (isAnswerableField(field)) {
      segments.at(-1)!.fields.push(field);
    }
  }
  return segments.filter((s) => s.fields.length > 0);
}
