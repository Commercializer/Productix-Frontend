import type { DppSector } from "@productix/db";
import { DPP_SECTOR_SECTIONS, type DppSectionField } from "./sector-sections";

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
          }
        ]
      },
      {
        "label": "Importer",
        "fields": [
          {
            "text": "Importer name & address (if manufacturer outside EU)",
            "required": true
          }
        ]
      }
    ]
  },
  {
    "key": "specifications",
    "sidebarLabel": "Product specifications",
    "icon": "ClipboardList",
    "title": "Product Specifications",
    "directive": "EU Regulation 2024/1781 (ESPR) · Art. 7(2)(d) · CE Marking Directive 93/68/EEC · REACH Reg. 1907/2006 · RoHS Directive 2011/65/EU",
    "fields": [
      {
        "text": "Brand name",
        "required": false
      },
      {
        "text": "Model number",
        "required": false
      },
      {
        "text": "HS Code",
        "required": false
      },
      {
        "text": "CE marking (if applicable)",
        "required": true
      },
      {
        "text": "Declaration of Conformity",
        "required": true
      },
      {
        "text": "REACH compliance",
        "required": false
      },
      {
        "text": "RoHS compliance",
        "required": false
      },
      {
        "text": "Energy efficiency class",
        "required": false
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
        "required": true
      },
      {
        "text": "Manufacture date (batteries, perishables, food, cosmetics)",
        "required": true
      },
      {
        "text": "Width × Height × Depth (mm)",
        "required": false
      },
      {
        "text": "Expected lifetime (years)",
        "required": false
      },
      {
        "text": "Warranty period",
        "required": false
      },
      {
        "text": "Expiry / best-before date",
        "required": false
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
        "required": true
      },
      {
        "text": "Manufacturing phase",
        "required": false
      },
      {
        "text": "Transport phase",
        "required": false
      },
      {
        "text": "Use phase",
        "required": false
      },
      {
        "text": "End of life phase",
        "required": false
      },
      {
        "text": "Methodology",
        "required": false
      },
      {
        "text": "EPD declaration URL",
        "required": false
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
        "required": true
      },
      {
        "text": "Pre-consumer recycled %",
        "required": false
      },
      {
        "text": "Post-consumer recycled %",
        "required": false
      },
      {
        "text": "Renewable content %",
        "required": false
      },
      {
        "text": "Recyclability %",
        "required": false
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
        "text": "CAS numbers",
        "required": false
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
        "text": "Location in product",
        "required": false
      },
      {
        "text": "Safe handling URL",
        "required": false
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
        "required": true
      },
      {
        "text": "Spare parts availability period",
        "required": true
      },
      {
        "text": "Repair manual URL",
        "required": false
      },
      {
        "text": "Repair network URL",
        "required": false
      },
      {
        "text": "Disassembly time",
        "required": false
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
        "text": "Recyclability % by weight (batteries mandatory)",
        "required": true
      },
      {
        "text": "EU Waste code (if applicable)",
        "required": true
      },
      {
        "text": "Disassembly instructions",
        "required": true
      },
      {
        "text": "Recycling instructions",
        "required": false
      },
      {
        "text": "Deposit return scheme",
        "required": false
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

/** Generic ESPR sections to drop for sectors that admin.dpp.gs's own
 * per-sector notes (see packages/db/prisma/seed-data/dpp-section-info/
 * <sector>.json) mark as sitting outside the ESPR Digital Product Passport
 * mandate: food.json's "food" entry says "Food is excluded from the ESPR
 * Digital Product Passport"; cosmetics.json's "cosmetics" entry says
 * "Cosmetics are outside the ESPR DPP mandate"; medical.json's "medical"
 * entry says medical devices "are outside the ESPR DPP" (they run on
 * UDI/EUDAMED instead). Every one of these generic sections' directive
 * cites "EU Regulation 2024/1781 (ESPR)" as its basis, so once a sector
 * opts out of ESPR they stop applying - the sector's own section already
 * carries the equivalent domain data (nutrition/allergens, INCI/CPNP,
 * UDI/IFU). Medical keeps "specifications" and "documents": CE marking, the
 * Declaration of Conformity and Technical Documentation are still hard
 * MDR/IVDR requirements even though the rest of ESPR doesn't apply to it. */
const ESPR_EXCLUDED_GENERIC_SECTIONS: Partial<Record<DppSector, string[]>> = {
  FOOD: ["specifications", "carbon", "recycled", "materials", "substances", "repairability", "eol", "documents"],
  COSMETICS: ["specifications", "carbon", "recycled", "materials", "substances", "repairability", "eol", "documents"],
  MEDICAL: ["carbon", "recycled", "materials", "substances", "repairability", "eol"],
};

/** The generic sections that normally precede the spliced-in sector section,
 * in DPP_SECTIONS order - used to re-anchor the splice point when one or
 * more of them has been dropped by ESPR_EXCLUDED_GENERIC_SECTIONS (see
 * getOrderedDppSections). */
const PRE_SECTOR_KEYS = ["manufacturer", "specifications", "physical", "carbon", "recycled", "materials"];

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
