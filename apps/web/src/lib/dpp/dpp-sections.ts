import type { DppSector } from "@productix/db";
import { DPP_SECTOR_SECTIONS, type DppSectionField } from "./sector-sections";
import { COUNTRY_OPTIONS } from "./countries";

export type { DppSectionField };

export interface DppFieldGroup {
  label: string;
  fields: DppSectionField[];
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
   * importer's MANUFACTURER / IMPORTER split) instead of a flat field list. */
  groups?: DppFieldGroup[];
}

/** Brand name / Model number / Product category / HS Code - rendered on the
 * "Product identification" tab (see the DPP page's hardcoded `identification`
 * render branch), matching the spreadsheet's own grouping. There used to be
 * a generic `specifications` section below holding these plus the
 * CE-marking/compliance fields (now relocated into "substances" - see that
 * section's "Compliance & certifications" group) - once both moved out, the
 * `specifications` section had nothing left in it and was removed entirely,
 * but its answers key lives on: these 4 fields are still stored under
 * `sectionAnswers.specifications` (see setFieldAnswer("specifications", ...)
 * in the page and SectionCard's `data.sectionAnswers.specifications` read in
 * the public view) purely so nothing already saved under that key is lost or
 * migrated - it's not tied to any section object named "specifications"
 * anymore. */
export const IDENTIFICATION_EXTRA_FIELDS: DppSectionField[] = [
  {
    "text": "Brand name",
    "required": false
  },
  {
    "text": "Model number",
    "required": false
  },
  {
    "text": "Product category",
    "required": false
  },
  {
    "text": "HS Code",
    "required": false
  }
];

/** Every generic (non sector-specific) DPP section, curated from
 * admin.dpp.gs's section-info API (see
 * packages/db/prisma/seed-data/dpp-section-info/). "Product identification"
 * isn't here - it's custom-coded in the DPP page (name/sector/identifier).
 * The sector-specific section (see sector-sections.ts) is appended after
 * "materials" and before "substances" by the page itself, since which one
 * applies depends on the product's chosen sector. */
export const DPP_SECTIONS: DppSectionSpec[] = [
  {
    "key": "manufacturer",
    "sidebarLabel": "Manufacturer & importer",
    "icon": "Building2",
    "title": "Manufacturer & Importer",
    "directive": "EU Regulation 2024/1781 (ESPR) · Art. 7(2)(a) · Market Surveillance Regulation 2019/1020",
    "groups": [
      {
        "label": "Manufacturer",
        "fields": [
          {
            "text": "Manufacturer legal name",
            "required": true
          },
          {
            "text": "Manufacturer country",
            "required": true
          },
          {
            "text": "Manufacturer postal address",
            "required": false
          },
          {
            "text": "Compliance contact email/phone",
            "required": false
          },
          {
            "text": "Authorized representative in the EU",
            "required": false
          },
          {
            "text": "Manufacturing facility ID (plant code or GS1 GLN - optional, one of the 4 EU DPP Registry identifiers)",
            "required": false
          },
          {
            "text": "Facility ID scheme",
            "required": false,
            "type": "select",
            "options": ["None", "GLN (GS1)", "EU-OP", "Other"]
          }
        ]
      },
      {
        "label": "Importer",
        "fields": [
          {
            "text": "Importer name & address (if manufacturer outside EU)",
            "required": true
          },
          {
            "text": "Importer country",
            "required": false,
            "type": "select",
            "options": COUNTRY_OPTIONS
          }
        ]
      }
    ]
  },
  {
    "key": "physical",
    "sidebarLabel": "Physical properties",
    "icon": "Ruler",
    "title": "Physical Characteristics",
    "directive": "EU Regulation 2024/1781 (ESPR) · Art. 7(1) · Packaging & Packaging Waste Regulation 2025/40",
    "fields": [
      {
        "text": "Total weight in kg — required for waste-stream calculations",
        "required": true,
        "type": "number"
      },
      {
        "text": "Manufacture date (batteries, perishables, food, cosmetics)",
        "required": true,
        "type": "date"
      },
      {
        "text": "Width (mm)",
        "required": false,
        "type": "number"
      },
      {
        "text": "Height (mm)",
        "required": false,
        "type": "number"
      },
      {
        "text": "Depth (mm)",
        "required": false,
        "type": "number"
      },
      {
        "text": "Expected lifetime (years)",
        "required": false,
        "type": "number"
      },
      {
        "text": "Warranty period",
        "required": false,
        "type": "number"
      },
      {
        "text": "Expiry / best-before date",
        "required": false,
        "type": "date"
      }
    ]
  },
  {
    "key": "carbon",
    "sidebarLabel": "Carbon footprint",
    "icon": "Cloud",
    "title": "Carbon Footprint",
    "directive": "EU Regulation 2024/1781 (ESPR) · Art. 7(2)(b)",
    "fields": [
      {
        "text": "Total CO₂ equivalent (batteries mandatory, others phased)",
        "required": true,
        "type": "number"
      },
      {
        "text": "Manufacturing phase",
        "required": false,
        "type": "number"
      },
      {
        "text": "Transport phase",
        "required": false,
        "type": "number"
      },
      {
        "text": "Use phase",
        "required": false,
        "type": "number"
      },
      {
        "text": "End of life phase",
        "required": false,
        "type": "number"
      },
      {
        "text": "Methodology",
        "required": false
      },
      {
        "text": "EPD declaration URL",
        "required": false,
        "type": "url"
      }
    ]
  },
  {
    "key": "recycled",
    "sidebarLabel": "Recycled content",
    "icon": "Recycle",
    "title": "Recycled Content",
    "directive": "EU Regulation 2024/1781 (ESPR) · Art. 7(2)(c)",
    "fields": [
      {
        "text": "Total recycled content as % by weight of the product (batteries mandatory from 2031)",
        "required": true,
        "type": "number"
      },
      {
        "text": "Pre-consumer recycled %",
        "required": false,
        "type": "number"
      },
      {
        "text": "Post-consumer recycled %",
        "required": false,
        "type": "number"
      },
      {
        "text": "Renewable content %",
        "required": false,
        "type": "number"
      },
      {
        "text": "Recyclability %",
        "required": false,
        "type": "number"
      }
    ]
  },
  {
    "key": "materials",
    "sidebarLabel": "Material composition",
    "icon": "Layers",
    "title": "Material Composition",
    "directive": "EU Regulation 2024/1781 (ESPR) · Art. 7(5) · Critical Raw Materials Act (CRMA) 2024/1252",
    "fields": [
      {
        "text": "All materials >0.1% by weight (SVHC threshold)",
        "required": true
      },
      {
        "text": "Critical Raw Materials with country of origin",
        "required": true
      },
      {
        "text": "Recycled content per material",
        "required": false
      },
      {
        "text": "Material category",
        "required": false
      }
    ]
  },
  {
    "key": "substances",
    "sidebarLabel": "Substances of concern (SVHC)",
    "icon": "FlaskConical",
    "title": "Substances of Concern",
    "directive": "REACH Regulation 1907/2006 · Art. 33 · EU Regulation 2024/1781 (ESPR) · Art. 7(5)(b) · SVHC Candidate List (ECHA)",
    "groups": [
      {
        "label": "Substances of Concern (SVHC)",
        "fields": [
          {
            "text": "All SVHC substances >0.1% by weight (w/w) in the product",
            "required": true
          },
          {
            "text": "Non-SVHC substances of concern",
            "required": false
          },
          {
            "text": "CAS numbers",
            "required": false
          },
          {
            "text": "Location in product",
            "required": false
          },
          {
            "text": "Safe handling URL",
            "required": false
          }
        ]
      },
      {
        "label": "Compliance & certifications",
        "fields": [
          {
            "text": "CE marking (if applicable)",
            "required": true,
            "type": "toggle"
          },
          {
            "text": "Declaration of Conformity",
            "required": true,
            "type": "toggle"
          },
          {
            "text": "REACH compliance",
            "required": false,
            "type": "toggle"
          },
          {
            "text": "RoHS compliance",
            "required": false,
            "type": "toggle"
          },
          {
            "text": "Energy efficiency class",
            "required": false,
            "type": "select",
            "options": ["A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"]
          },
          {
            "text": "Energy consumption (kWh/year)",
            "required": false,
            "type": "number"
          },
          {
            "text": "IP rating",
            "required": false
          },
          {
            "text": "Third party certifications",
            "required": false
          }
        ]
      }
    ]
  },
  // Renders via PackagingLayersPanel/PackagingLayersView (see
  // packaging-layers.ts), not the generic field-list renderer - the
  // `fields` below are unused for rendering, kept only so this stays a
  // valid DppSectionSpec.
  {
    "key": "packaging",
    "sidebarLabel": "Product packaging",
    "icon": "PackageCheck",
    "title": "Packaging Layers (PPWR Art. 12)",
    "directive": "Packaging Regulation (EU) 2025/40, Art. 12 — declaration per packaging layer. Max. 15 layers.",
    "fields": [
      {
        "text": "Producer identification — name, registered trade name/trademark, postal address; on the packaging OR via a QR code/data carrier (Art 15(6), from 12 Aug 2026)",
        "required": true
      },
      {
        "text": "Importer identification where applicable — name/trademark + postal address (Art 18)",
        "required": true
      },
      {
        "text": "A type/batch/serial number or other element enabling identification of the packaging, on the pack or in an accompanying document (Art 15(5)) — a GS1 Digital Link satisfies this",
        "required": true
      },
      {
        "text": "EU Declaration of Conformity per packaging type, backed by a technical file (Art 38/39 + Annex VII)",
        "required": true
      },
      {
        "text": "PFAS limits in food-contact packaging + heavy-metal sum ≤ 100 mg/kg (Art 5)",
        "required": true
      },
      {
        "text": "EPR registration in every member state where the packaging is first placed on the market (Art 44/45)",
        "required": true
      },
      {
        "text": "Packaging category (plastic rigid/flexible, paper-board, glass, metal, composite, wood, biopolymer) + format + level (primary/secondary/tertiary)",
        "required": false
      },
      {
        "text": "Material composition with per-material weight, recycled %, recyclability (basis for Art 12 labelling from 2028)",
        "required": false
      },
      {
        "text": "Total + empty weight + packaging ratio (Art 10 minimisation)",
        "required": false
      },
      {
        "text": "Mono-material flag",
        "required": false
      },
      {
        "text": "PFAS individual/sum ppb + total fluorine ppm + PFAS-free / bisphenol-free flags",
        "required": false
      },
      {
        "text": "SVHC presence (REACH > 0.1% w/w)",
        "required": false
      },
      {
        "text": "Recyclability class + % + recycled content % + recycling stream (PET/HDPE/paper/glass/aluminium/steel)",
        "required": false
      },
      {
        "text": "Separable components + compostability (EN 13432 / OK Compost)",
        "required": false
      },
      {
        "text": "Reuse: designed cycles, deposit scheme + amount, return points (Art 26 + Annex VI)",
        "required": false
      },
      {
        "text": "EPR registration numbers per country",
        "required": false
      },
      {
        "text": "Declaration of Conformity URL + assessment date + test reports + retention period",
        "required": false
      },
      {
        "text": "Carbon footprint + PEF declaration + certifications (FSC / PEFC / Blue Angel / OK Compost)",
        "required": false
      }
    ]
  },
  {
    "key": "repairability",
    "sidebarLabel": "Repairability",
    "icon": "Wrench",
    "title": "Repairability",
    "directive": "EU Regulation 2024/1781 (ESPR) · Art. 7(2)(e) · Right to Repair Directive 2024/1799/EU",
    "fields": [
      {
        "text": "Repairability score (phased by product category)",
        "required": true,
        "type": "number"
      },
      {
        "text": "Spare parts availability period",
        "required": true,
        "type": "number"
      },
      {
        "text": "Repair manual URL",
        "required": false,
        "type": "url"
      },
      {
        "text": "Repair network URL",
        "required": false,
        "type": "url"
      },
      {
        "text": "Spare parts URL",
        "required": false,
        "type": "url"
      },
      {
        "text": "Disassembly time",
        "required": false,
        "type": "number"
      }
    ]
  },
  {
    "key": "eol",
    "sidebarLabel": "End of life",
    "icon": "Trash2",
    "title": "End of Life",
    "directive": "EU Regulation 2024/1781 (ESPR) · Art. 7(2)(f) · Waste Framework Directive 2008/98/EC",
    "fields": [
      {
        "text": "EU Waste code (if applicable)",
        "required": true
      },
      {
        "text": "Disassembly instructions",
        "required": true,
        "type": "url"
      },
      {
        "text": "Recycling instructions",
        "required": false
      },
      {
        "text": "Deposit return scheme",
        "required": false,
        "type": "toggle"
      },
      {
        "text": "Take-back information",
        "required": false
      }
    ]
  },
  {
    "key": "documents",
    "sidebarLabel": "Documents & links",
    "icon": "FileText",
    "title": "Documents & Links",
    "directive": "EU Regulation 2024/1781 (ESPR) · Art. 7(2)(g) · CE Marking Directive · Machinery Regulation 2023/1230",
    "fields": [
      {
        "text": "Declaration of Conformity",
        "required": true
      },
      {
        "text": "Technical Documentation (for authorities)",
        "required": true
      },
      {
        "text": "User Manual (in all EU languages)",
        "required": true
      },
      {
        "text": "Repair manual",
        "required": false
      },
      {
        "text": "Spare parts catalogue",
        "required": false
      },
      {
        "text": "Product datasheet",
        "required": false
      },
      {
        "text": "Safety instructions",
        "required": false
      },
      {
        "text": "Energy label",
        "required": false
      },
      {
        "text": "Disassembly instructions",
        "required": false
      },
      {
        "text": "EPD (Environmental Product Declaration)",
        "required": false
      }
    ]
  }
];

/** Generic ESPR sections to drop per sector - reconciled 2026-08-30 against
 * the user-supplied "DPP Sector & Sections Requirements" spreadsheet (see
 * dpp-sector-requirements.json at the repo root), which lists each of the 16
 * sectors' own section set explicitly. This superseded an earlier, less
 * granular version of this map (FOOD/COSMETICS/MEDICAL only) sourced from
 * admin.dpp.gs's own per-sector notes (see
 * packages/db/prisma/seed-data/dpp-section-info/<sector>.json), which turned
 * out to disagree with the spreadsheet on two points: (1) FOOD/COSMETICS DO
 * get "Documents & links" per the spreadsheet, not excluded as before; (2)
 * MEDICAL is NOT a wholesale ESPR opt-out per the spreadsheet - it lists
 * every generic section (including carbon/recycled/materials/repairability/
 * eol), contradicting the older source's "medical devices are outside the
 * ESPR DPP" note. Two other groupings emerge from the spreadsheet that
 * weren't in the old map at all: TEXTILE/TYRE/FURNITURE drop
 * carbon/materials/recycled (TEXTILE/TYRE also drop repairability - furniture
 * keeps it); CHEMICALS/PACKAGING/COSMETICS/FOOD drop
 * carbon/recycled/materials/substances/repairability/eol entirely, since
 * their own sector-specific section already carries the equivalent
 * compliance data (Chemicals' SDS/GHS/CLP, Packaging's own DoC group,
 * Food/Cosmetics' own labelling regs) instead of the generic ESPR versions.
 * BATTERY/ELECTRONICS/CONSTRUCTION/TOYS/MACHINERY/VEHICLES/
 * INTERMEDIATE_PRODUCTS/OTHER get every generic section, per the spreadsheet
 * (no entry needed - absent from this map means nothing is excluded). */
const ESPR_EXCLUDED_GENERIC_SECTIONS: Partial<Record<DppSector, string[]>> = {
  TEXTILE: ["carbon", "materials", "recycled", "repairability"],
  TYRE: ["carbon", "materials", "recycled", "repairability"],
  FURNITURE: ["carbon", "materials", "recycled"],
  CHEMICALS: ["carbon", "recycled", "materials", "substances", "repairability", "eol"],
  PACKAGING: ["carbon", "recycled", "materials", "substances", "repairability", "eol"],
  COSMETICS: ["carbon", "recycled", "materials", "substances", "repairability", "eol"],
  FOOD: ["carbon", "recycled", "materials", "substances", "repairability", "eol"],
};

/** The generic sections that normally precede the spliced-in sector section,
 * in DPP_SECTIONS order - used to re-anchor the splice point when one or
 * more of them has been dropped by ESPR_EXCLUDED_GENERIC_SECTIONS (see
 * getOrderedDppSections). */
const PRE_SECTOR_KEYS = ["manufacturer", "physical", "carbon", "recycled", "materials"];

/** DPP_SECTIONS filtered to what actually applies to `sector` (see
 * ESPR_EXCLUDED_GENERIC_SECTIONS), with the sector-specific section (if any)
 * spliced in right after the last remaining section among PRE_SECTOR_KEYS -
 * normally "materials", but for a sector that drops "materials" this falls
 * back to whichever of manufacturer/specifications/physical survived. The
 * sector section's `groups` (its numbered §1, §2... sub-sections - see
 * sector-sections.ts) render via the same group-rendering path as
 * "Manufacturer & Importer"'s Manufacturer/Importer sub-groups; the editor
 * additionally splits each group into its own sidebar sub-item (see
 * products/[productId]/dpp/page.tsx's sidebarItems). Shared so the public
 * passport view doesn't have to duplicate this filtering/ordering logic. */
export function getOrderedDppSections(sector: DppSector | null): DppSectionSpec[] {
  const excludedKeys = new Set(sector ? (ESPR_EXCLUDED_GENERIC_SECTIONS[sector] ?? []) : []);
  const sections = excludedKeys.size ? DPP_SECTIONS.filter((s) => !excludedKeys.has(s.key)) : DPP_SECTIONS;

  const sectorSpec = sector ? DPP_SECTOR_SECTIONS[sector] : undefined;
  if (!sectorSpec) return sections;

  const anchorKey = [...PRE_SECTOR_KEYS].reverse().find((key) => sections.some((s) => s.key === key));
  const anchorIdx = anchorKey ? sections.findIndex((s) => s.key === anchorKey) : -1;
  const before = sections.slice(0, anchorIdx + 1);
  const after = sections.slice(anchorIdx + 1);
  const sectorSection: DppSectionSpec = {
    key: "sector",
    sidebarLabel: sectorSpec.title,
    icon: "Boxes",
    title: sectorSpec.title,
    directive: sectorSpec.directive,
    groups: sectorSpec.groups,
  };
  return [...before, sectorSection, ...after];
}
