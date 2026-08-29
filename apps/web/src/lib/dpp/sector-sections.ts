import type { DppSector } from "@productix/db";

export interface DppSectionField {
  text: string;
  required: boolean;
}

/** One numbered sub-section (e.g. "§1 Performance & durability") within a
 * sector's own section - shape-compatible with dpp-sections.ts's
 * DppFieldGroup (label + fields), so the existing group-rendering path
 * (already used for "Manufacturer & Importer") and getOrderedDppSections'
 * sector splice work unchanged; see that file's DppSectionSpec.groups. */
export interface DppSectorGroup {
  label: string;
  fields: DppSectionField[];
}

export interface DppSectorSection {
  title: string;
  directive: string;
  groups: DppSectorGroup[];
}

/** Human-readable label for every DppSector value - shared between the
 * dashboard editor (which pairs these with lucide icons locally) and the
 * public passport view (which just needs the text). */
export const DPP_SECTOR_LABELS: Record<DppSector, string> = {
  BATTERY: "Battery",
  ELECTRONICS: "Electronics",
  TEXTILE: "Textile",
  TYRE: "Tyre",
  FURNITURE: "Furniture",
  CONSTRUCTION: "Construction",
  CHEMICALS: "Chemicals",
  TOYS: "Toys",
  MACHINERY: "Machinery",
  VEHICLES: "Vehicles",
  PACKAGING: "Packaging",
  COSMETICS: "Cosmetics",
  FOOD: "Food",
  MEDICAL: "Medical",
  INTERMEDIATE_PRODUCTS: "Intermediate Products",
  OTHER: "Other",
};

/** Sector-specific DPP data-entry fields, organized into the same numbered
 * sub-sections (§1, §2, ...) as the reference admin.dpp.gs product editor -
 * confirmed live for all 14 sectors below on 2026-08-29 (each sector's own
 * "Add product" draft form reveals its full sidebar, sub-sections included,
 * as soon as that sector is picked - no product had to be created). Field
 * text/citations are still curated from admin.dpp.gs's section-info API (see
 * packages/db/prisma/seed-data/dpp-section-info/); this pass regroups that
 * same field pool under the real sub-section labels instead of one flat
 * list, and fills a couple of previously-uncovered topics (e.g. battery's
 * lifecycle carbon footprint) the flat pool didn't have a field for yet.
 * OTHER and INTERMEDIATE_PRODUCTS have no dedicated section in that schema,
 * so they're intentionally absent here. */
export const DPP_SECTOR_SECTIONS: Partial<Record<DppSector, DppSectorSection>> = {
  "BATTERY": {
    "title": "Battery Data",
    "directive": "EU Battery Regulation 2023/1542 · Art. 3 (categories) · Art. 7 (carbon footprint declaration + class A-G, phased via delegated acts) · Art. 13-14 · Annex IV (performance & durability) · Annex VI.A (label) · Annex XIII (battery passport)",
    "groups": [
      {
        "label": "§1 Performance & durability",
        "fields": [
          { "text": "Battery category (portable / LMT / SLI / industrial / EV)", "required": true },
          { "text": "Capacity (kWh)", "required": true },
          { "text": "Nominal voltage", "required": true },
          { "text": "Cycle life", "required": true },
          { "text": "Operating temperature range", "required": true },
          { "text": "Round-trip efficiency (Annex IV)", "required": false },
          { "text": "Internal resistance", "required": false },
          { "text": "Self-discharge rate", "required": false },
          { "text": "Calendar warranty", "required": false }
        ]
      },
      {
        "label": "§2 Composition",
        "fields": [
          { "text": "Battery chemistry", "required": true },
          { "text": "Cathode material", "required": true },
          { "text": "Place of manufacture (Annex VI.A.3)", "required": true },
          { "text": "Anode material", "required": false },
          { "text": "Electrolyte type", "required": false }
        ]
      },
      {
        "label": "§3 Critical Raw Materials (CRM Act 2024/1252)",
        "fields": [
          { "text": "Content of critical materials (Li, Co, Ni, Mn) in kg", "required": true }
        ]
      },
      {
        "label": "§4 Carbon footprint lifecycle (kg CO₂/kWh)",
        "fields": [
          { "text": "Lifecycle carbon footprint (kg CO₂-eq per kWh of energy delivered over service life, Annex II BatReg)", "required": false }
        ]
      },
      {
        "label": "§5 Recycled content verification",
        "fields": [
          { "text": "Recycled content: Co, Li, Ni, Pb (% w/w, Annex XIII)", "required": true }
        ]
      },
      {
        "label": "§6 End-of-life & second life",
        "fields": [
          { "text": "State of health & cycle count (Art. 14 — BMS API)", "required": false },
          { "text": "Capacity threshold for 2nd life", "required": false }
        ]
      },
      {
        "label": "§7 Safety",
        "fields": [
          { "text": "UN number + hazmat class", "required": true },
          { "text": "Extinguishing agent", "required": true }
        ]
      }
    ]
  },
  "ELECTRONICS": {
    "title": "Electronics / ICT Data",
    "directive": "ESPR 2024/1781 — electronics & ICT is a Tier-1 priority product group (delegated act in preparation) · Ecodesign for smartphones & tablets Reg (EU) 2023/1670 (applies from 20 Jun 2025) · Energy Labelling Reg (EU) 2017/1369 + EPREL database · RoHS 2011/65/EU · WEEE 2012/19/EU · Right to Repair Directive (EU) 2024/1799 · USB-C common charger Reg (EU) 2022/2380 (from 28 Dec 2024) · REACH 1907/2006 · FR Repairability / Durability Index (Loi AGEC)",
    "groups": [
      {
        "label": "§1 Device classification",
        "fields": [
          { "text": "Device type, form factor, operating system + version", "required": false }
        ]
      },
      {
        "label": "§2 Energy (Energy Label / EPREL)",
        "fields": [
          { "text": "Energy efficiency class + EPREL registration where an energy label applies (Reg 2017/1369)", "required": true },
          { "text": "Power consumption (on-mode / networked standby) + annual energy", "required": false }
        ]
      },
      {
        "label": "§3 Repairability & durability (Reg 2023/1670)",
        "fields": [
          { "text": "FR Repairability & Durability Index (0–10) + EU repairability class A–E", "required": false },
          { "text": "Spare-part availability (years) + price list + repair manual + self-repair programme", "required": false }
        ]
      },
      {
        "label": "§4 Software & support (Reg 2023/1670)",
        "fields": [
          { "text": "OS & security update availability period for smartphones/tablets (Reg 2023/1670)", "required": true }
        ]
      },
      {
        "label": "§5 Battery endurance",
        "fields": [
          { "text": "Steps to reach the battery", "required": false },
          { "text": "Battery capacity (mAh) + rated cycles to 80% + user-replaceability", "required": false }
        ]
      },
      {
        "label": "§6 Connectivity & common charger",
        "fields": [
          { "text": "USB-C common charger for in-scope portable electronics (Reg 2022/2380, since 28 Dec 2024)", "required": true },
          { "text": "Charging port + max charging power + wireless charging + connectivity", "required": false }
        ]
      },
      {
        "label": "§7 Materials & substances (RoHS / REACH / WEEE)",
        "fields": [
          { "text": "RoHS compliance (restricted substances ≤ limits)", "required": true },
          { "text": "WEEE producer registration + e-waste category", "required": true },
          { "text": "REACH SVHC presence, recycled content %, critical raw materials, 3TG conflict-minerals policy", "required": false }
        ]
      },
      {
        "label": "§8 Reliability & protection",
        "fields": [
          { "text": "IP rating, drop resistance, MTBF, scratch resistance, warranty", "required": false }
        ]
      },
      {
        "label": "§9 Compliance & footprint",
        "fields": [
          { "text": "CE marking + EU Declaration of Conformity", "required": true },
          { "text": "Carbon footprint, take-back / trade-in URL, certifications (Energy Star / EPEAT / TCO / Blue Angel)", "required": false }
        ]
      }
    ]
  },
  "TEXTILE": {
    "title": "Textile Data",
    "directive": "Textile Labelling Regulation (EU) 1007/2011 (mandatory now) · ESPR 2024/1781 (delegated act for textiles in preparation, expected late 2026 / 2027) · PEFCR Apparel and Footwear v1.1 · EU Strategy for Sustainable and Circular Textiles 2022/COM 141",
    "groups": [
      {
        "label": "§1 Fibre composition (Reg. 1007/2011)",
        "fields": [
          { "text": "Fibre composition with % by weight (Reg. 1007/2011 — already mandatory in physical labels)", "required": true },
          { "text": "Fabric weight (g/m²)", "required": false },
          { "text": "Weave type", "required": false },
          { "text": "Yarn count", "required": false }
        ]
      },
      {
        "label": "§2 Origin & manufacturing chain",
        "fields": [
          { "text": "Origin / country information for the dominant fibre", "required": true },
          { "text": "Country of dyeing / weaving / cutting / sewing / finishing", "required": false },
          { "text": "Factory ID (Higg FEM, Open Apparel Registry)", "required": false }
        ]
      },
      {
        "label": "§3 Environmental footprint (PEFCR Apparel v1.1)",
        "fields": [
          { "text": "Carbon, water and land footprint per garment (PEFCR Apparel)", "required": false }
        ]
      },
      {
        "label": "§4 Chemicals & dyes",
        "fields": [
          { "text": "Dye class, Oeko-Tex / ZDHC MRSL / PFAS-free / formaldehyde-free flags", "required": false }
        ]
      },
      {
        "label": "§5 Durability",
        "fields": [
          { "text": "Durability test results: Martindale abrasion, pilling, colour fastness, wash cycles, tear strength", "required": false }
        ]
      },
      {
        "label": "§6 Microfibre shedding",
        "fields": [
          { "text": "Microfibre shedding rate (TMC / AATCC TM212)", "required": false }
        ]
      },
      {
        "label": "§7 Recyclability & repairability",
        "fields": [
          { "text": "Total recycled content %, mono-material flag, recyclability %, recycling pathway", "required": false },
          { "text": "Repair kit availability + URL, reuse / second-hand URL", "required": false }
        ]
      },
      {
        "label": "§8 Care instructions (ISO 3758)",
        "fields": [
          { "text": "Care instructions (ISO 3758) — washing, bleaching, drying, ironing, dry-cleaning", "required": true }
        ]
      },
      {
        "label": "§9 Certifications",
        "fields": [
          { "text": "Certifications: GOTS, Fairtrade, Bluesign, Cradle to Cradle, RWS, RDS, LWG, EU Ecolabel", "required": false }
        ]
      }
    ]
  },
  "TYRE": {
    "title": "Tyre Data",
    "directive": "EU Tyre Labelling Regulation (EU) 2020/740 (mandatory since 1 May 2021, EV pictogram from 1 May 2024) · EU EPREL database · Reg. 552/2009 (high-aromatic oils ban) · UNECE GRBP draft tyre-abrasion test method · ESPR delegated act for tyres (expected 2027)",
    "groups": [
      {
        "label": "§1 EU Tyre Label (Reg. 2020/740)",
        "fields": [
          { "text": "Vehicle class (C1 passenger / C2 light truck / C3 heavy truck)", "required": true },
          { "text": "Fuel-efficiency class A-E (rolling resistance)", "required": true },
          { "text": "Wet-grip class A-E", "required": true },
          { "text": "External rolling noise: measured dB(A) and class A-B-C", "required": true },
          { "text": "Snow-grip pictogram (3PMSF) if winter/all-season", "required": true },
          { "text": "Ice-grip Nordic pictogram if applicable", "required": true },
          { "text": "EV-optimised pictogram (from May 2024)", "required": true },
          { "text": "EPREL database registration ID", "required": true }
        ]
      },
      {
        "label": "§2 Dimensions & speed/load rating",
        "fields": [
          { "text": "Size designation, load index, speed rating", "required": false },
          { "text": "Tread depth (new) and legal minimum tread", "required": false },
          { "text": "Tread pattern (symmetric / asymmetric / directional)", "required": false },
          { "text": "Season (summer / winter / all-season / all-weather)", "required": false }
        ]
      },
      {
        "label": "§3 Rubber compound & reinforcement",
        "fields": [
          { "text": "Rubber blend composition (NR / SBR / BR …) with %", "required": false },
          { "text": "Carbon black, silica, steel-belt, textile-cord percentages", "required": false },
          { "text": "Recycled rubber % and bio-based content %", "required": false },
          { "text": "High-aromatic-oils-free confirmation (Reg. 552/2009)", "required": false }
        ]
      },
      {
        "label": "§4 Tyre abrasion & microplastic emissions",
        "fields": [
          { "text": "Abrasion in mg/km + UNECE GRBP method + anticipated A-E class (from 2027)", "required": false }
        ]
      },
      {
        "label": "§5 Manufacturing & DOT traceability",
        "fields": [
          { "text": "Country of manufacture, DOT plant code, full DOT code, manufacture week/year", "required": false }
        ]
      },
      {
        "label": "§6 End-of-life",
        "fields": [
          { "text": "Retreadable flag + retread URL", "required": false },
          { "text": "Recycling pathway (mechanical / devulcanisation / pyrolysis / energy recovery / retread)", "required": false }
        ]
      },
      {
        "label": "§7 Performance & safety extras",
        "fields": [
          { "text": "UTQG treadwear index", "required": false },
          { "text": "Run-flat / self-sealing / studdable flags", "required": false },
          { "text": "Type-approval / homologation codes", "required": false }
        ]
      }
    ]
  },
  "FURNITURE": {
    "title": "Furniture Data",
    "directive": "EU Regulation 2024/1781 (ESPR) — furniture is a Tier-1 priority product group, delegated act expected 2027–2028 · EU Deforestation Regulation (EU) 2023/1115 (EUDR) — mandatory wood traceability · EN 16516 / E1 / CARB Phase 2 — formaldehyde emissions from wood-based panels · Decopaint Directive 2004/42/EC — VOC content of coatings · FR Loi AGEC — Repairability Index mandatory for furniture from 2024",
    "groups": [
      {
        "label": "§1 Category & assembly",
        "fields": [
          { "text": "Care / cleaning instructions", "required": true },
          { "text": "Furniture category and intended use (residential / contract / outdoor / kitchen / bathroom / healthcare / educational)", "required": false },
          { "text": "Assembly: required, time, tools, flat-pack, modular design flag", "required": false }
        ]
      },
      {
        "label": "§2 Wood, panels & EUDR traceability",
        "fields": [
          { "text": "Country of origin for solid wood and wood-based panels (EUDR Reg. 2023/1115 — applies since 30 Dec 2024)", "required": true },
          { "text": "Wood composition with species, %, country of origin, FSC + PEFC certifications and chain-of-custody IDs", "required": false },
          { "text": "Panel type (particleboard / MDF / HDF / OSB / plywood / solid / laminate / veneer)", "required": false },
          { "text": "EUDR due-diligence statement URL", "required": false }
        ]
      },
      {
        "label": "§3 Formaldehyde & chemical emissions",
        "fields": [
          { "text": "Formaldehyde class for any wood-based panel — E1 is the EU minimum since the 2020 CLP Carc.1B reclassification", "required": true },
          { "text": "Formaldehyde emission (mg/m³ via EN 16516 chamber test) + VOC class (FR A+ to C) + total VOC (mg/m³)", "required": false },
          { "text": "Flame-retardants-free / PFAS-free / phthalates-free flags", "required": false }
        ]
      },
      {
        "label": "§4 Upholstery & textile components",
        "fields": [
          { "text": "Upholstery layered composition + fire-resistance class (EN 1021, BS 5852, CA TB 117) + leather LWG grade + origin", "required": false }
        ]
      },
      {
        "label": "§5 Durability & test compliance",
        "fields": [
          { "text": "Durability test (EN 1728 seating, EN 16139 contract, EN 12521 table), cycles passed, load capacity, scratch + light fastness, warranty", "required": false }
        ]
      },
      {
        "label": "§6 Repairability & spare parts",
        "fields": [
          { "text": "Repairability Index for furniture sold in France (Loi AGEC, 1.0–10.0 scale)", "required": true },
          { "text": "Repair kit availability + URLs, spare parts URL, availability years, modular replaceable parts list", "required": false }
        ]
      },
      {
        "label": "§7 Recycled content & end-of-life",
        "fields": [
          { "text": "Recycled content per material (wood / metal / plastic) + total + recyclability % per EN 45555", "required": false },
          { "text": "Disassembly time, tools, take-back URL, donation / second-hand partner", "required": false }
        ]
      },
      {
        "label": "§8 Environmental footprint",
        "fields": [
          { "text": "Carbon + water footprint per item + PEFCR Furniture (in development) + manufacturing energy source", "required": false }
        ]
      },
      {
        "label": "§9 Certifications",
        "fields": [
          { "text": "Certifications: EU Ecolabel, Blauer Engel, Nordic Swan, GREENGUARD Gold, Cradle to Cradle, ISO 14001, BSCI", "required": false }
        ]
      }
    ]
  },
  "CONSTRUCTION": {
    "title": "Construction Product Data",
    "directive": "Construction Products Regulation (EU) 305/2011 (CPR) + revision Reg (EU) 2024/3110 (in force, phased to 2039) · Declaration of Performance (DoP, Art 4-6 + Annex III) · CE marking against a harmonised standard (hEN) or European Technical Assessment (ETA) · AVCP system 1+/1/2+/3/4 · ESPR 2024/1781 (construction is a Tier-1 priority group) · EN 15804 EPD · EN 13501-1 reaction to fire · REACH 1907/2006",
    "groups": [
      {
        "label": "§1 Classification",
        "fields": [
          { "text": "Product category + intended use", "required": false }
        ]
      },
      {
        "label": "§2 Declaration of Performance & CE (CPR Art 4-6)",
        "fields": [
          { "text": "Declaration of Performance (DoP) with a unique identification code (CPR Art 4-6)", "required": true },
          { "text": "CE marking + the harmonised standard (hEN) or ETA the product is declared against", "required": true },
          { "text": "AVCP system (1+/1/2+/3/4) + notified body where the system requires one", "required": true }
        ]
      },
      {
        "label": "§3 Essential characteristics",
        "fields": [
          { "text": "Declared performance for each essential characteristic covered by the hEN", "required": true },
          { "text": "Reaction to fire (EN 13501-1 Euroclass)", "required": false },
          { "text": "Thermal conductivity λ + U-value, compressive / flexural strength, sound reduction Rw, water-vapour resistance µ", "required": false },
          { "text": "Load-bearing flag + dimensional tolerance class", "required": false }
        ]
      },
      {
        "label": "§4 Durability & sustainability (EN 15804 EPD)",
        "fields": [
          { "text": "EPD per EN 15804 — GWP (kg CO₂e) + EPD programme + service life", "required": false },
          { "text": "Recycled / reused / bio-based content %, recyclability %, recycling pathway", "required": false }
        ]
      },
      {
        "label": "§5 Composition & origin",
        "fields": [
          { "text": "Main materials, country of manufacture, plant ID", "required": false }
        ]
      },
      {
        "label": "§6 Substances (REACH)",
        "fields": [
          { "text": "Dangerous-substance information (REACH Art 31/33)", "required": true },
          { "text": "SVHC presence + details, formaldehyde class (E1/E0/NAF), VOC emission class (A+/A/B/C)", "required": false }
        ]
      },
      {
        "label": "§7 Documents & certifications",
        "fields": [
          { "text": "DoP / CE certificate / EPD / SDS / installation manual / datasheet URLs", "required": false },
          { "text": "Certifications (BREEAM, LEED, Cradle to Cradle, FSC, natureplus)", "required": false }
        ]
      }
    ]
  },
  "CHEMICALS": {
    "title": "Chemical Product Data",
    "directive": "REACH Reg (EC) 1907/2006 — registration, SVHC (Art 33/59), authorisation (Annex XIV), restriction (Annex XVII), Safety Data Sheet (Art 31 + Annex II) · CLP Reg (EC) 1272/2008 — GHS classification, labelling, pictograms, signal word, H/P statements, Poison Centre Notification + UFI (Annex VIII) · Detergents Reg 648/2004 · Biocidal Products Reg 528/2012 · ADR/UN transport",
    "groups": [
      {
        "label": "§1 Identification",
        "fields": [
          { "text": "Identity — substance vs mixture, chemical name, CAS / EC number", "required": true }
        ]
      },
      {
        "label": "§2 GHS / CLP classification",
        "fields": [
          { "text": "GHS/CLP classification: signal word, hazard pictograms, H (hazard) + P (precautionary) statements", "required": true },
          { "text": "UFI + Poison Centre Notification for hazardous mixtures (CLP Annex VIII)", "required": true },
          { "text": "UFI code", "required": false }
        ]
      },
      {
        "label": "§3 Composition & properties (SDS §3/§9)",
        "fields": [
          { "text": "Physical state + concentration + pH + flash/boiling point", "required": false },
          { "text": "Hazardous components table (SDS section 3): name, CAS, EC, %, classification", "required": false }
        ]
      },
      {
        "label": "§4 REACH status",
        "fields": [
          { "text": "SVHC disclosure (> 0.1% w/w, REACH Art 33)", "required": true },
          { "text": "REACH registration number + status", "required": false },
          { "text": "Authorisation required (Annex XIV) / restriction (Annex XVII) flags", "required": false }
        ]
      },
      {
        "label": "§5 Safe handling & storage",
        "fields": [
          { "text": "Storage conditions, incompatible materials, shelf life", "required": false }
        ]
      },
      {
        "label": "§6 Environment & disposal",
        "fields": [
          { "text": "PBT/vPvB, aquatic toxicity class, biodegradability %, waste code, disposal", "required": false }
        ]
      },
      {
        "label": "§7 Transport (ADR / UN)",
        "fields": [
          { "text": "Transport (ADR/UN): UN number, hazard class, packing group, shipping name", "required": false }
        ]
      },
      {
        "label": "§8 Compliance & documents",
        "fields": [
          { "text": "Safety Data Sheet (REACH Art 31 + Annex II) for hazardous substances/mixtures", "required": true },
          { "text": "Detergent ingredient data sheet, biocidal authorisation, certifications", "required": false }
        ]
      }
    ]
  },
  "TOYS": {
    "title": "Toy Safety Data",
    "directive": "Toy Safety Directive 2009/48/EC + the Toy Safety Regulation (adopted 2025 — introduces a mandatory toy Digital Product Passport, stricter chemical bans and digital labelling) · EN 71 series (mechanical, flammability, element migration, organic compounds) · EN IEC 62115 (electric toys) · REACH Annex XVII (phthalates) · CMR / SVHC substance bans",
    "groups": [
      {
        "label": "§1 Classification & age",
        "fields": [
          { "text": "Age grading + mandatory warnings (e.g. 'not suitable for children under 36 months' + crossed 0-3 pictogram where applicable)", "required": true },
          { "text": "Toy category + intended age range", "required": false }
        ]
      },
      {
        "label": "§2 Safety warnings",
        "fields": [
          { "text": "Small-parts / choking-hazard warning where relevant", "required": true }
        ]
      },
      {
        "label": "§3 Standards & conformity",
        "fields": [
          { "text": "CE marking + EU Declaration of Conformity", "required": true },
          { "text": "EN 71 conformity (at least EN 71-1 mechanical, EN 71-2 flammability, EN 71-3 element migration)", "required": true },
          { "text": "EN 71 parts tested (table) + EN 62115 for electric toys", "required": false },
          { "text": "Notified body + EC type-examination certificate", "required": false }
        ]
      },
      {
        "label": "§4 Chemical safety",
        "fields": [
          { "text": "Phthalate restriction compliance (REACH Annex XVII) + no banned CMR substances", "required": true },
          { "text": "Element-migration / formaldehyde / allergenic-fragrance disclosure", "required": false }
        ]
      },
      {
        "label": "§5 Physical / mechanical",
        "fields": [
          { "text": "Sharp-edge, magnet and projectile safety, acoustic level (EN 71-1)", "required": false }
        ]
      },
      {
        "label": "§6 Electric toy",
        "fields": [
          { "text": "Electric toy: battery type, voltage, button-cell accessibility", "required": false }
        ]
      },
      {
        "label": "§7 Materials & sustainability",
        "fields": [
          { "text": "Main materials, recycled content %, recyclability, packaging recyclability", "required": false }
        ]
      },
      {
        "label": "§8 Documents & certifications",
        "fields": [
          { "text": "Test report / instructions URLs, certifications (GS mark, Spiel gut, OEKO-TEX)", "required": false }
        ]
      }
    ]
  },
  "MACHINERY": {
    "title": "Machinery Data",
    "directive": "Machinery Regulation (EU) 2023/1230 (applies from 20 Jan 2027, replaces Machinery Directive 2006/42/EC): Essential Health & Safety Requirements (Annex III), conformity-assessment procedures (Annex VI–IX), CE marking, EU Declaration of Conformity, instructions · new digital / AI-safety, cybersecurity and substantial-modification provisions · high-risk Annex I machinery needs a notified body · EN ISO 12100 risk assessment · noise EN ISO 3744 / vibration EN ISO 5349/2631",
    "groups": [
      {
        "label": "§1 Classification",
        "fields": [
          { "text": "Machinery type + category + intended use + Annex I high-risk flag", "required": false }
        ]
      },
      {
        "label": "§2 Conformity (Reg 2023/1230)",
        "fields": [
          { "text": "CE marking + EU Declaration of Conformity", "required": true },
          { "text": "Conformity-assessment procedure (internal checks, EU type-examination or full quality assurance) + notified body for Annex I high-risk machinery", "required": true }
        ]
      },
      {
        "label": "§3 Technical specification",
        "fields": [
          { "text": "Power / voltage / speed / pressure / capacity", "required": false }
        ]
      },
      {
        "label": "§4 Safety",
        "fields": [
          { "text": "Compliance with the Essential Health & Safety Requirements (Annex III)", "required": true },
          { "text": "Noise / vibration emission declaration where above the threshold", "required": true },
          { "text": "Safety components table (light curtains, e-stops, interlocks) with PL/SIL + standard", "required": false },
          { "text": "Residual risks + required PPE, guards, emergency stop", "required": false }
        ]
      },
      {
        "label": "§5 Digital / software",
        "fields": [
          { "text": "Digital: safety software + version, cybersecurity measures, AI safety function", "required": false }
        ]
      },
      {
        "label": "§6 Lifecycle & maintenance",
        "fields": [
          { "text": "Service life, maintenance interval, spare parts + maintenance manual URLs", "required": false }
        ]
      },
      {
        "label": "§7 Materials & end-of-life",
        "fields": [
          { "text": "Materials, recyclability %, hazardous substances, disassembly URL", "required": false }
        ]
      },
      {
        "label": "§8 Documents & certifications",
        "fields": [
          { "text": "Instructions for use + technical file", "required": true },
          { "text": "Certifications (TÜV, GS mark, ATEX)", "required": false }
        ]
      }
    ]
  },
  "VEHICLES": {
    "title": "Vehicle Data",
    "directive": "End-of-Life Vehicles Directive 2000/53/EC (+ the proposed ELV Regulation on circularity requirements for vehicle design) · Directive 2005/64/EC — type approval re recyclability (≥85%) / recoverability (≥95%) · Reg (EU) 2018/858 — whole-vehicle type approval, Certificate of Conformity, repair & maintenance information access · Euro 6 / Euro 7 emissions",
    "groups": [
      {
        "label": "§1 Identification",
        "fields": [
          { "text": "Vehicle category (M/N/L/O) + make/model", "required": true },
          { "text": "WMI / VIN prefix", "required": false }
        ]
      },
      {
        "label": "§2 Type approval & conformity",
        "fields": [
          { "text": "Whole-vehicle type approval + Certificate of Conformity (Reg 2018/858)", "required": true }
        ]
      },
      {
        "label": "§3 Powertrain",
        "fields": [
          { "text": "Powertrain: fuel type, engine power, EV battery capacity + electric range, transmission", "required": false }
        ]
      },
      {
        "label": "§4 Environmental (Dir 2000/53 + 2005/64)",
        "fields": [
          { "text": "Emission standard (Euro 6d/7) + CO₂ (WLTP)", "required": true },
          { "text": "Recyclability ≥85% + recoverability ≥95% (Dir 2005/64)", "required": true }
        ]
      },
      {
        "label": "§5 End-of-life",
        "fields": [
          { "text": "ELV heavy-metal compliance (Pb/Hg/Cd/Cr VI — Dir 2000/53 Annex II) + depollution information", "required": true },
          { "text": "Dismantling information (IDIS), refrigerant type, ATF requirement", "required": false }
        ]
      },
      {
        "label": "§6 Materials",
        "fields": [
          { "text": "Material composition table + kerb weight + ISO 1043 plastics marking", "required": false },
          { "text": "Recycled-content %, hazardous substances", "required": false }
        ]
      },
      {
        "label": "§7 Lifecycle & service",
        "fields": [
          { "text": "Warranty, service interval, spare-parts + repair-info (RMI) URLs", "required": false }
        ]
      },
      {
        "label": "§8 Documents & certifications",
        "fields": [
          { "text": "Owner manual, certifications", "required": false }
        ]
      }
    ]
  },
  "PACKAGING": {
    "title": "Packaging Data",
    "directive": "PPWR — Packaging and Packaging Waste Regulation (EU) 2025/40 (applies from 12 Aug 2026). NOTE: PPWR does not itself mandate a Digital Product Passport — it requires identification ON the packaging (Art 15/18) and an EU Declaration of Conformity (Art 38/39 + Annex VIII). dpp.gs provides the DPP / GS1 Digital Link QR as the carrier for those obligations · Art 5 PFAS + heavy-metal limits · Art 6-11 design-for-recycling + recycled content + minimisation · Art 12 packaging labelling (from Aug 2028) · Art 26 + Annex VI reusable systems · Art 44/45 EPR registration",
    "groups": [
      {
        "label": "§1 Classification",
        "fields": [
          { "text": "Packaging category (plastic rigid/flexible, paper-board, glass, metal, composite, wood, biopolymer) + format + level (primary/secondary/tertiary)", "required": false }
        ]
      },
      {
        "label": "§2 Economic operators",
        "fields": [
          { "text": "Producer identification — name, registered trade name/trademark, postal address; on the packaging OR via a QR code/data carrier (Art 15(6), from 12 Aug 2026)", "required": true },
          { "text": "Importer identification where applicable — name/trademark + postal address (Art 18)", "required": true },
          { "text": "A type/batch/serial number or other element enabling identification of the packaging, on the pack or in an accompanying document (Art 15(5)) — a GS1 Digital Link satisfies this", "required": true }
        ]
      },
      {
        "label": "§3 Material composition",
        "fields": [
          { "text": "Material composition with per-material weight, recycled %, recyclability (basis for Art 12 labelling from 2028)", "required": false },
          { "text": "Total + empty weight + packaging ratio (Art 10 minimisation)", "required": false },
          { "text": "Mono-material flag", "required": false }
        ]
      },
      {
        "label": "§4 Substances",
        "fields": [
          { "text": "PFAS limits in food-contact packaging + heavy-metal sum ≤ 100 mg/kg (Art 5)", "required": true },
          { "text": "PFAS individual/sum ppb + total fluorine ppm + PFAS-free / bisphenol-free flags", "required": false },
          { "text": "SVHC presence (REACH > 0.1% w/w)", "required": false }
        ]
      },
      {
        "label": "§5 Recyclability",
        "fields": [
          { "text": "Recyclability class + % + recycled content % + recycling stream (PET/HDPE/paper/glass/aluminium/steel)", "required": false },
          { "text": "Separable components + compostability (EN 13432 / OK Compost)", "required": false }
        ]
      },
      {
        "label": "§6 Reusable packaging",
        "fields": [
          { "text": "Reuse: designed cycles, deposit scheme + amount, return points (Art 26 + Annex VI)", "required": false }
        ]
      },
      {
        "label": "§7 EPR registration",
        "fields": [
          { "text": "EPR registration in every member state where the packaging is first placed on the market (Art 44/45)", "required": true },
          { "text": "EPR registration numbers per country", "required": false }
        ]
      },
      {
        "label": "§8 Conformity & DoC",
        "fields": [
          { "text": "EU Declaration of Conformity per packaging type, backed by a technical file (Art 38/39 + Annex VII)", "required": true },
          { "text": "Declaration of Conformity URL + assessment date + test reports + retention period", "required": false },
          { "text": "Carbon footprint + PEF declaration + certifications (FSC / PEFC / Blue Angel / OK Compost)", "required": false }
        ]
      }
    ]
  },
  "COSMETICS": {
    "title": "Cosmetic Product Data",
    "directive": "Cosmetics Regulation (EC) 1223/2009: Responsible Person (Art 4), CPNP notification (Art 13), Product Information File (Art 11), safety assessment (Art 10 + Annex I), INCI ingredient labelling (Art 19), 26 listed fragrance allergens, nanomaterial declaration (Art 16), CMR restrictions, Period After Opening · animal-testing ban (Art 18) · microplastics restriction (REACH Annex XVII / Reg 2023/2055)",
    "groups": [
      {
        "label": "§1 Identification & Responsible Person",
        "fields": [
          { "text": "Responsible Person name + EU address (Art 4)", "required": true },
          { "text": "CPNP notification before placing on the market (Art 13)", "required": true },
          { "text": "Product type + country of origin", "required": false }
        ]
      },
      {
        "label": "§2 Composition (INCI, Art 19)",
        "fields": [
          { "text": "Full INCI ingredient list in descending order (Art 19)", "required": true },
          { "text": "Declared nanomaterials ([nano]) and listed fragrance allergens", "required": true },
          { "text": "Structured ingredient table (INCI, function, %)", "required": false }
        ]
      },
      {
        "label": "§3 Safety (Art 10/11)",
        "fields": [
          { "text": "Product Information File + safety assessment held (Art 10/11)", "required": true },
          { "text": "CMR presence flag, safety assessor, microbiological / challenge-test results", "required": false }
        ]
      },
      {
        "label": "§4 Usage",
        "fields": [
          { "text": "Period After Opening / shelf life + warnings", "required": true },
          { "text": "Usage instructions, target skin type", "required": false }
        ]
      },
      {
        "label": "§5 Claims & testing",
        "fields": [
          { "text": "Claims + substantiation (dermatologically/clinically tested, hypoallergenic), vegan / organic / not-tested-on-animals", "required": false }
        ]
      },
      {
        "label": "§6 Environmental",
        "fields": [
          { "text": "Packaging recyclability, recycled content, microplastics-free, biodegradability, refillable", "required": false }
        ]
      },
      {
        "label": "§7 Documents & certifications",
        "fields": [
          { "text": "Certifications (COSMOS, NATRUE, Leaping Bunny, Vegan Society)", "required": false }
        ]
      }
    ]
  },
  "FOOD": {
    "title": "Food Product Data",
    "directive": "Food Information to Consumers Reg (EU) 1169/2011 (FIC): legal name, ingredient list + QUID (Art 22), the 14 listed allergens (Annex II), mandatory nutrition declaration per 100 g/ml (Annex XV), net quantity, date of minimum durability / use-by (Art 24), storage, food business operator (Art 8), country of origin / place of provenance · Food Additives Reg 1333/2008 (E-numbers) · Claims Reg 1924/2006 · Organic Reg (EU) 2018/848 · Nutri-Score (voluntary)",
    "groups": [
      {
        "label": "§1 Identification",
        "fields": [
          { "text": "Legal/customary name + net quantity", "required": true },
          { "text": "Food business operator name + address (Art 8)", "required": true }
        ]
      },
      {
        "label": "§2 Ingredients & allergens",
        "fields": [
          { "text": "Full ingredient list in descending order + QUID for emphasised ingredients", "required": true },
          { "text": "The 14 listed allergens (Annex II), emphasised", "required": true },
          { "text": "E-number additives, GMO flag", "required": false }
        ]
      },
      {
        "label": "§3 Nutrition declaration",
        "fields": [
          { "text": "Mandatory nutrition declaration per 100 g/ml (energy, fat, saturates, carbohydrate, sugars, protein, salt)", "required": true },
          { "text": "Fibre, Nutri-Score (A–E)", "required": false }
        ]
      },
      {
        "label": "§4 Dates & storage",
        "fields": [
          { "text": "Date of minimum durability ('best before') or 'use by' + storage conditions", "required": true },
          { "text": "Preparation instructions, lot number", "required": false }
        ]
      },
      {
        "label": "§5 Claims & diet",
        "fields": [
          { "text": "Diet/ethical: organic (+ cert no.), vegan, vegetarian, gluten-free, halal, kosher", "required": false },
          { "text": "Nutrition & health claims (Reg 1924/2006)", "required": false }
        ]
      },
      {
        "label": "§6 Origin & traceability",
        "fields": [
          { "text": "Food category + country of origin / place of provenance", "required": false }
        ]
      },
      {
        "label": "§7 Environmental & certifications",
        "fields": [
          { "text": "Packaging recyclability + recycling info, carbon footprint", "required": false },
          { "text": "Certifications (Fairtrade, MSC, Rainforest Alliance, PDO/PGI)", "required": false }
        ]
      }
    ]
  },
  "MEDICAL": {
    "title": "Medical Device Data",
    "directive": "Medical Device Regulation (EU) 2017/745 (MDR) / In-Vitro Diagnostic Regulation (EU) 2017/746 (IVDR): risk classification (MDR I/IIa/IIb/III · IVDR A–D), conformity assessment + notified body, CE marking, UDI (Basic UDI-DI + UDI-DI, Art 27), EUDAMED registration, manufacturer Single Registration Number, authorised representative, clinical evaluation, Instructions For Use, implant card (Art 18), CMR/endocrine substances (Annex I 10.4)",
    "groups": [
      {
        "label": "§1 Identification & UDI",
        "fields": [
          { "text": "UDI — Basic UDI-DI + UDI-DI on the device label (Art 27)", "required": true },
          { "text": "Device type, model, GMDN code", "required": false }
        ]
      },
      {
        "label": "§2 Classification & conformity",
        "fields": [
          { "text": "CE marking + EU conformity (notified body for class IIa and above)", "required": true },
          { "text": "EC certificate number", "required": false }
        ]
      },
      {
        "label": "§3 Economic operators",
        "fields": [
          { "text": "Manufacturer SRN + authorised representative (for non-EU manufacturers)", "required": true },
          { "text": "EUDAMED registration", "required": true }
        ]
      },
      {
        "label": "§4 Clinical & safety",
        "fields": [
          { "text": "Risk class + intended purpose", "required": true },
          { "text": "Sterile + sterilization method, single-use, latex-free, MR safety", "required": false },
          { "text": "Contraindications + warnings", "required": false },
          { "text": "Clinical evaluation, certifications (ISO 13485, ISO 14971)", "required": false }
        ]
      },
      {
        "label": "§5 Lifecycle",
        "fields": [
          { "text": "Shelf life / expiry, lot / serial", "required": false }
        ]
      },
      {
        "label": "§6 Materials & substances (Annex I 10.4)",
        "fields": [
          { "text": "CMR / endocrine-disruptor + phthalate content (Annex I 10.4), materials, substances of concern", "required": false }
        ]
      },
      {
        "label": "§7 Documents & certifications",
        "fields": [
          { "text": "Instructions For Use; implant card for implantable devices (Art 18)", "required": true }
        ]
      }
    ]
  }
};

/** Strips an obviously citation-only trailing parenthetical (a regulation,
 * article, directive or annex reference, or a bare year/number like
 * "2023/1115") from a field's raw text, for use as a shorter input label.
 * Deliberately conservative - a trailing parenthetical with no such marker
 * (e.g. "(if applicable)") is left alone since it's part of the meaning, not
 * a citation. The full original text is always shown alongside as a caption,
 * so nothing is lost either way. */
const CITATION_MARKER_RE = /\b(reg\.?|regulation|art\.?|article|directive|annex|iso|dir\.?|eudr|clp|reach|espr|weee|epreL?)\b/i;
const YEAR_OR_REF_NUMBER_RE = /\b(19|20)\d{2}\b|\b\d+\/\d+\b/;

export function trimFieldLabel(text: string): string {
  const match = text.match(/^(.*)\s\(([^()]*)\)$/);
  if (!match) return text;
  const base = match[1] ?? "";
  const paren = match[2] ?? "";
  if (CITATION_MARKER_RE.test(paren) || YEAR_OR_REF_NUMBER_RE.test(paren)) {
    return base.trim();
  }
  return text;
}
