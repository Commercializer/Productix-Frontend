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
  material: string;
}

export interface PackagingLayerEprRegistration {
  id: string;
  country: string;
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
}

/** Packaging Regulation (EU) 2025/40, Art. 12 caps a declaration at 15 layers. */
export const MAX_PACKAGING_LAYERS = 15;

export const PACKAGING_LAYER_TYPE_OPTIONS = ["Primary", "Secondary", "Tertiary / transport"];
export const PACKAGING_RECYCLABILITY_GRADE_OPTIONS = ["A", "B", "C", "D", "E"];
export const PACKAGING_YES_NO_OPTIONS = ["Yes", "No"];
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
  };
}

export function createEmptyPackagingComponent(): PackagingLayerComponent {
  return { id: newId(), material: "" };
}

export function createEmptyEprRegistration(): PackagingLayerEprRegistration {
  return { id: newId(), country: "", registrationNumber: "" };
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
    layer.components.some((c) => c.material.trim()) ||
    layer.eprRegistrations.some((e) => e.country.trim() || e.registrationNumber.trim())
  );
}

/** Trims every field, drops empty composition/EPR rows, then drops layers
 * left with nothing filled in at all - mirrors createProductDppAction's
 * pruning of every other section's flat field map. */
export function prunePackagingLayers(layers: unknown): PackagingLayer[] {
  if (!Array.isArray(layers)) return [];
  return (layers as PackagingLayer[])
    .map((l) => ({
      ...l,
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
      components: (l.components ?? []).filter((c) => c.material?.trim()),
      eprRegistrations: (l.eprRegistrations ?? []).filter((e) => e.country?.trim() || e.registrationNumber?.trim()),
    }))
    .filter(isLayerNonEmpty);
}
