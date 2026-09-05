// Shared shape for the "Product packaging" section's repeatable layers -
// used by the dashboard editor (packaging-layers-panel.tsx), the public
// passport view (01/[gtin]/packaging-layers-view.tsx), and the server action
// that persists/prunes them (createProductDppAction in dashboard/actions.ts).
//
// Unlike every other DPP section (a flat `Record<fieldText, string>`, see
// dpp-sections.ts), packaging is a real GS1/PPWR "one declaration per
// packaging layer" structure (primary/secondary/tertiary), each with its own
// nested repeatable material composition and per-country EPR registrations -
// confirmed against the reference admin.dpp.gs product editor's "Packaging
// Layers (PPWR Art. 12)" screen on 2026-08-29. It's stored under
// sectionAnswers.packaging as `{ layers: PackagingLayer[] }` rather than the
// flat map every other section uses.
import { formatGtinValue } from "@/lib/gs1";

export interface PackagingLayerComponent {
  id: string;
  component: string;
  material: string;
  weightGrams: string;
  recycledPercent: string;
}

export interface PackagingLayerEprRegistration {
  id: string;
  country: string;
  schemeName: string;
  registrationNumber: string;
}

export interface PackagingLayer {
  id: string;
  label: string;
  /** Where this layer's data came from - see PACKAGING_DATA_SOURCE_OPTIONS.
   * Only "Manual entry" actually does anything today; the others are kept
   * for parity with the reference editor and to name a real, near-term
   * integration point (GTIN lookup, an external passport link, or pulling a
   * saved layer from a future per-company packaging library) rather than
   * silently dropping the field. */
  dataSource: string;
  packagingName: string;
  manufacturer: string;
  manufacturerCountry: string;
  layerType: string;
  weightGrams: string;
  components: PackagingLayerComponent[];
  recyclabilityGrade: string;
  reusable: string;
  eprRegistrations: PackagingLayerEprRegistration[];
  docNumber: string;
  docIssueDate: string;
  euDocExists: string;
  reachSvhcCompliant: string;
  docUrl: string;
  /** "More PPWR data (optional)" - Section 1 & 3, Classification &
   * minimisation (Art. 10). All optional, shown only behind the page's
   * "Show optional fields" toggle - see packaging-layers-panel.tsx. */
  packagingCategory: string;
  packagingFormat: string;
  volumeLitres: string;
  dimensions: string;
  totalWeightGrams: string;
  emptyWeightGrams: string;
  packagingRatio: string;
  monoMaterial: string;
  /** Section 2, Economic operator (Art. 15/18). */
  manufacturerRole: string;
  uniquePackagingIdentifier: string;
  producerTrademark: string;
  importer: string;
  importerAddress: string;
  /** Section 4, Substances (Art. 5). */
  heavyMetalsPpm: string;
  pfasPresent: string;
  foodContact: string;
  pfasFree: string;
  totalFluorinePpm: string;
  fluorineUnderLimit: string;
  bisphenolFree: string;
  svhcPresent: string;
  svhcDetails: string;
  /** Section 5, Recyclability (Art. 6-11) - beyond recyclabilityGrade/reusable above. */
  recycledContentPercent: string;
  recyclabilityPercent: string;
  recyclingStream: string;
  separableComponents: string;
  compostable: string;
  compostabilityStandard: string;
  materialLabel: string;
  separateCollectionLabel: string;
  qrDigitalCarrier: string;
  /** Section 6, Reuse (Art. 11). */
  depositScheme: string;
  depositAmount: string;
  designedReuseCycles: string;
  reuseSystemUrl: string;
  returnPointsUrl: string;
  /** Section 8, Conformity (extra) + footprint. */
  conformityAssessmentDate: string;
  retentionYears: string;
  testReportsUrl: string;
  docSignedBy: string;
  eprRegistrationLegacy: string;
  carbonFootprint: string;
  carbonSource: string;
}

/** Packaging Regulation (EU) 2025/40, Art. 12 caps a declaration at 15 layers. */
export const MAX_PACKAGING_LAYERS = 15;

export const PACKAGING_LAYER_TYPE_OPTIONS = ["Primary", "Secondary", "Tertiary / transport"];
export const PACKAGING_RECYCLABILITY_GRADE_OPTIONS = ["A", "B", "C", "D", "E"];
export const PACKAGING_YES_NO_OPTIONS = ["Yes", "No"];
export const PACKAGING_MANUFACTURER_ROLE_OPTIONS = ["Manufacturer", "Importer", "Authorised representative"];
export const PACKAGING_CARBON_SOURCE_OPTIONS = ["From linked DPP", "Manual entry"];
export const PACKAGING_MATERIAL_OPTIONS = [
  "Paper / Cardboard",
  "PET",
  "HDPE",
  "LDPE",
  "PP",
  "PS",
  "Other plastic",
  "Glass",
  "Aluminium",
  "Steel",
  "Wood",
  "Composite",
  "Biopolymer",
  "Other",
];
export const DEFAULT_PACKAGING_DATA_SOURCE = "Manual entry";
/** The only non-manual data source actually wired up - see
 * applyGtinLookupToLayer below. Kept as a named constant (not just a string
 * literal in the options list) so the dropdown label and the trigger check
 * in packaging-layers-panel.tsx can't drift apart. */
export const GTIN_LOOKUP_DATA_SOURCE = "GTIN lookup (Productix)";
export const PACKAGING_DATA_SOURCE_OPTIONS = [
  DEFAULT_PACKAGING_DATA_SOURCE,
  GTIN_LOOKUP_DATA_SOURCE,
  "External passport provider link",
  "Packaging layer (from library)",
];

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `layer-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createEmptyPackagingLayer(): PackagingLayer {
  return {
    id: newId(),
    label: "",
    dataSource: DEFAULT_PACKAGING_DATA_SOURCE,
    packagingName: "",
    manufacturer: "",
    manufacturerCountry: "",
    layerType: "",
    weightGrams: "",
    components: [],
    recyclabilityGrade: "",
    reusable: "",
    eprRegistrations: [],
    docNumber: "",
    docIssueDate: "",
    euDocExists: "",
    reachSvhcCompliant: "",
    docUrl: "",
    packagingCategory: "",
    packagingFormat: "",
    volumeLitres: "",
    dimensions: "",
    totalWeightGrams: "",
    emptyWeightGrams: "",
    packagingRatio: "",
    monoMaterial: "",
    manufacturerRole: "",
    uniquePackagingIdentifier: "",
    producerTrademark: "",
    importer: "",
    importerAddress: "",
    heavyMetalsPpm: "",
    pfasPresent: "",
    foodContact: "",
    pfasFree: "",
    totalFluorinePpm: "",
    fluorineUnderLimit: "",
    bisphenolFree: "",
    svhcPresent: "",
    svhcDetails: "",
    recycledContentPercent: "",
    recyclabilityPercent: "",
    recyclingStream: "",
    separableComponents: "",
    compostable: "",
    compostabilityStandard: "",
    materialLabel: "",
    separateCollectionLabel: "",
    qrDigitalCarrier: "",
    depositScheme: "",
    depositAmount: "",
    designedReuseCycles: "",
    reuseSystemUrl: "",
    returnPointsUrl: "",
    conformityAssessmentDate: "",
    retentionYears: "",
    testReportsUrl: "",
    docSignedBy: "",
    eprRegistrationLegacy: "",
    carbonFootprint: "",
    carbonSource: "",
  };
}

export function createEmptyPackagingComponent(): PackagingLayerComponent {
  return { id: newId(), component: "", material: "", weightGrams: "", recycledPercent: "" };
}

export function createEmptyEprRegistration(): PackagingLayerEprRegistration {
  return { id: newId(), country: "", schemeName: "", registrationNumber: "" };
}

/** Applies the product's own already-verified GTIN data (Product.gtinData -
 * populated by the same GS1 registry check used for GTIN entry elsewhere,
 * see verifyGtinAction/GtinField) to a layer's identity fields. Deliberately
 * doesn't call verifyGtinAction itself - that action rejects a GTIN already
 * registered to a product ("already registered to another product"), which
 * would always fire here since the product legitimately owns its own GTIN.
 * Only "Packaging name" and "Manufacturer" have a real GS1-field
 * counterpart (ProductDescription/BrandName and GCPOwner); nothing else
 * this GTIN lookup could plausibly know (weight, layer type, EPR, DoC...) is
 * part of GS1's basic registry response, so those stay untouched. */
export function applyGtinLookupToLayer(layer: PackagingLayer, gtinData: Record<string, unknown> | null): PackagingLayer {
  if (!gtinData) return { ...layer, dataSource: GTIN_LOOKUP_DATA_SOURCE };
  const packagingName = formatGtinValue(gtinData.ProductDescription) ?? formatGtinValue(gtinData.BrandName);
  const manufacturer = formatGtinValue(gtinData.GCPOwner);
  return {
    ...layer,
    dataSource: GTIN_LOOKUP_DATA_SOURCE,
    packagingName: packagingName ?? layer.packagingName,
    manufacturer: manufacturer ?? layer.manufacturer,
  };
}

/** The fields required for a PPWR-complete layer declaration - drives both
 * the editor's per-layer "Missing: N" count and the sidebar's completeness
 * dot for the packaging tab. */
export function countMissingRequiredLayerFields(layer: PackagingLayer): number {
  const required = [
    layer.packagingName,
    layer.manufacturer,
    layer.manufacturerCountry,
    layer.layerType,
    layer.weightGrams,
    layer.recyclabilityGrade,
    layer.euDocExists,
  ];
  return required.filter((v) => !v.trim()).length;
}

/** Every optional "More PPWR data" string field - factored out so
 * isLayerNonEmpty/prunePackagingLayers don't have to hand-list it twice. */
const OPTIONAL_PPWR_FIELD_KEYS = [
  "packagingCategory",
  "packagingFormat",
  "volumeLitres",
  "dimensions",
  "totalWeightGrams",
  "emptyWeightGrams",
  "packagingRatio",
  "monoMaterial",
  "manufacturerRole",
  "uniquePackagingIdentifier",
  "producerTrademark",
  "importer",
  "importerAddress",
  "heavyMetalsPpm",
  "pfasPresent",
  "foodContact",
  "pfasFree",
  "totalFluorinePpm",
  "fluorineUnderLimit",
  "bisphenolFree",
  "svhcPresent",
  "svhcDetails",
  "recycledContentPercent",
  "recyclabilityPercent",
  "recyclingStream",
  "separableComponents",
  "compostable",
  "compostabilityStandard",
  "materialLabel",
  "separateCollectionLabel",
  "qrDigitalCarrier",
  "depositScheme",
  "depositAmount",
  "designedReuseCycles",
  "reuseSystemUrl",
  "returnPointsUrl",
  "conformityAssessmentDate",
  "retentionYears",
  "testReportsUrl",
  "docSignedBy",
  "eprRegistrationLegacy",
  "carbonFootprint",
  "carbonSource",
] as const satisfies readonly (keyof PackagingLayer)[];

function isLayerNonEmpty(layer: PackagingLayer): boolean {
  return !!(
    layer.label.trim() ||
    layer.packagingName.trim() ||
    layer.manufacturer.trim() ||
    layer.manufacturerCountry.trim() ||
    layer.layerType.trim() ||
    layer.weightGrams.trim() ||
    layer.recyclabilityGrade.trim() ||
    layer.reusable.trim() ||
    layer.docNumber.trim() ||
    layer.docIssueDate.trim() ||
    layer.euDocExists.trim() ||
    layer.reachSvhcCompliant.trim() ||
    layer.docUrl.trim() ||
    layer.components.some((c) => c.component.trim() || c.material.trim() || c.weightGrams.trim() || c.recycledPercent.trim()) ||
    layer.eprRegistrations.some((e) => e.country.trim() || e.schemeName.trim() || e.registrationNumber.trim()) ||
    OPTIONAL_PPWR_FIELD_KEYS.some((key) => (layer[key] as string)?.trim())
  );
}

/** Trims every field, drops empty composition/EPR rows, then drops layers
 * left with nothing filled in at all - mirrors createProductDppAction's
 * pruning of every other section's flat field map. */
export function prunePackagingLayers(layers: unknown): PackagingLayer[] {
  if (!Array.isArray(layers)) return [];
  return (layers as PackagingLayer[])
    .map((l) => {
      const optionalPpwr = Object.fromEntries(
        OPTIONAL_PPWR_FIELD_KEYS.map((key) => [key, (l[key] as string | undefined)?.trim() ?? ""])
      ) as Record<(typeof OPTIONAL_PPWR_FIELD_KEYS)[number], string>;
      return {
        ...l,
        ...optionalPpwr,
        label: l.label?.trim() ?? "",
        dataSource: l.dataSource?.trim() || DEFAULT_PACKAGING_DATA_SOURCE,
        packagingName: l.packagingName?.trim() ?? "",
        manufacturer: l.manufacturer?.trim() ?? "",
        manufacturerCountry: l.manufacturerCountry?.trim() ?? "",
        layerType: l.layerType?.trim() ?? "",
        weightGrams: l.weightGrams?.trim() ?? "",
        recyclabilityGrade: l.recyclabilityGrade?.trim() ?? "",
        reusable: l.reusable?.trim() ?? "",
        docNumber: l.docNumber?.trim() ?? "",
        docIssueDate: l.docIssueDate?.trim() ?? "",
        euDocExists: l.euDocExists?.trim() ?? "",
        reachSvhcCompliant: l.reachSvhcCompliant?.trim() ?? "",
        docUrl: l.docUrl?.trim() ?? "",
        components: (l.components ?? []).filter(
          (c) => c.component?.trim() || c.material?.trim() || c.weightGrams?.trim() || c.recycledPercent?.trim()
        ),
        eprRegistrations: (l.eprRegistrations ?? []).filter(
          (e) => e.country?.trim() || e.schemeName?.trim() || e.registrationNumber?.trim()
        ),
      };
    })
    .filter(isLayerNonEmpty);
}
