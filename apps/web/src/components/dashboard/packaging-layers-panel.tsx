"use client";

// Repeatable "one declaration per packaging layer" editor for the DPP's
// "Product packaging" tab (PPWR Art. 12) - see
// apps/web/src/lib/dpp/packaging-layers.ts for the shared shape/pruning
// logic and its doc comment for why this section isn't a flat field list
// like every other one. Mirrors the reference admin.dpp.gs editor's layer
// list + expand-to-edit pattern, minus the AI document upload/extract/
// generate workflow (needs its own document-processing backend - out of
// scope here; producers can still link an existing DoC via the URL field).
import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { COUNTRY_OPTIONS } from "@/lib/dpp/countries";
import { SearchableSelect } from "@/components/dashboard/searchable-select";
import { formatGtinValue } from "@/lib/gs1";
import {
  applyGtinLookupToLayer,
  createEmptyPackagingComponent,
  createEmptyEprRegistration,
  createEmptyPackagingLayer,
  countMissingRequiredLayerFields,
  GTIN_LOOKUP_DATA_SOURCE,
  MAX_PACKAGING_LAYERS,
  PACKAGING_CARBON_SOURCE_OPTIONS,
  PACKAGING_DATA_SOURCE_OPTIONS,
  PACKAGING_LAYER_TYPE_OPTIONS,
  PACKAGING_MANUFACTURER_ROLE_OPTIONS,
  PACKAGING_MATERIAL_OPTIONS,
  PACKAGING_RECYCLABILITY_GRADE_OPTIONS,
  PACKAGING_YES_NO_OPTIONS,
  type PackagingLayer,
} from "@/lib/dpp/packaging-layers";

const inputClass =
  "w-full h-[38px] px-3 rounded-lg border border-(--ds-border) bg-(--ds-bg) text-[13px] text-(--ds-text-primary) placeholder-(--ds-text-muted) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all";
const selectClass =
  "w-full h-[38px] px-3 rounded-lg border border-(--ds-border) bg-(--ds-bg) text-[13px] text-(--ds-text-primary) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-(--ds-text-primary) mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const groupHeadingClass = "text-[11px] font-semibold uppercase tracking-wide text-(--ds-text-muted) mb-3";

function LayerForm({
  layer,
  onChange,
  productGtin,
  productGtinData,
  showOptional,
}: {
  layer: PackagingLayer;
  onChange: (layer: PackagingLayer) => void;
  productGtin: string | null;
  productGtinData: Record<string, unknown> | null;
  showOptional: boolean;
}) {
  const set = <K extends keyof PackagingLayer>(key: K, value: PackagingLayer[K]) => onChange({ ...layer, [key]: value });

  const handleDataSourceChange = (value: string) => {
    if (value === GTIN_LOOKUP_DATA_SOURCE) {
      onChange(applyGtinLookupToLayer(layer, productGtinData));
      return;
    }
    set("dataSource", value);
  };

  const gtinOwner = formatGtinValue(productGtinData?.GCPOwner);
  const gtinDescription = formatGtinValue(productGtinData?.ProductDescription) ?? formatGtinValue(productGtinData?.BrandName);

  return (
    <div className="space-y-5 p-4 rounded-xl border border-(--ds-border) bg-(--ds-bg)">
      <Field label="Layer label">
        <input
          type="text"
          value={layer.label}
          onChange={(e) => set("label", e.target.value)}
          placeholder="Primary bottle / Outer carton / Transport pallet"
          className={inputClass}
        />
      </Field>

      <Field label="Data source">
        <select value={layer.dataSource} onChange={(e) => handleDataSourceChange(e.target.value)} className={selectClass}>
          {PACKAGING_DATA_SOURCE_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {layer.dataSource === GTIN_LOOKUP_DATA_SOURCE &&
          (gtinOwner || gtinDescription ? (
            <p className="mt-1 text-[11px] text-(--ds-text-muted)">
              Pulled from GTIN {productGtin}: {[gtinDescription, gtinOwner].filter(Boolean).join(" · ")}. Packaging
              name/manufacturer were filled in above - edit freely.
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
              No verified GTIN data available yet - set a GTIN in Product identification first, or fill this layer
              in manually.
            </p>
          ))}
        {layer.dataSource !== "Manual entry" && layer.dataSource !== GTIN_LOOKUP_DATA_SOURCE && (
          <p className="mt-1 text-[11px] text-(--ds-text-muted)">
            Not wired up yet - this stays a manual form either way.
          </p>
        )}
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Packaging name" required>
          <input
            type="text"
            value={layer.packagingName}
            onChange={(e) => set("packagingName", e.target.value)}
            placeholder="Brown corrugated carton"
            className={inputClass}
          />
        </Field>
        <Field label="Manufacturer" required>
          <input type="text" value={layer.manufacturer} onChange={(e) => set("manufacturer", e.target.value)} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Manufacturer country" required>
          <SearchableSelect
            options={COUNTRY_OPTIONS}
            value={layer.manufacturerCountry}
            onChange={(v) => set("manufacturerCountry", v)}
            searchPlaceholder="Search countries…"
          />
        </Field>
      </div>

      <div className="pt-1 border-t border-(--ds-border)">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-(--ds-text-muted) mb-3 mt-4">
          Required for the Declaration of Conformity
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Layer type (PPWR)" required>
            <select value={layer.layerType} onChange={(e) => set("layerType", e.target.value)} className={selectClass}>
              <option value="">— Select —</option>
              {PACKAGING_LAYER_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Weight (g)" required>
            <input
              type="number"
              min="0"
              value={layer.weightGrams}
              onChange={(e) => set("weightGrams", e.target.value)}
              placeholder="50"
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-(--ds-surface-2) border border-(--ds-border) space-y-2">
        <p className="text-[12px] font-semibold text-(--ds-text-primary)">Layer composition</p>
        <p className="text-[11px] text-(--ds-text-muted)">
          What this layer is physically made of — one row per material (e.g. bottle body · cap · label).
        </p>
        {layer.components.map((c) => (
          <div key={c.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_0.7fr_0.7fr_auto] gap-2 items-center">
            <input
              type="text"
              value={c.component}
              onChange={(e) =>
                set(
                  "components",
                  layer.components.map((x) => (x.id === c.id ? { ...x, component: e.target.value } : x))
                )
              }
              placeholder="Paper tray"
              className={inputClass}
            />
            <select
              value={c.material}
              onChange={(e) =>
                set(
                  "components",
                  layer.components.map((x) => (x.id === c.id ? { ...x, material: e.target.value } : x))
                )
              }
              className={selectClass}
            >
              <option value="">— Material —</option>
              {PACKAGING_MATERIAL_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={c.weightGrams}
              onChange={(e) =>
                set(
                  "components",
                  layer.components.map((x) => (x.id === c.id ? { ...x, weightGrams: e.target.value } : x))
                )
              }
              placeholder="g"
              className={inputClass}
            />
            <input
              type="text"
              value={c.recycledPercent}
              onChange={(e) =>
                set(
                  "components",
                  layer.components.map((x) => (x.id === c.id ? { ...x, recycledPercent: e.target.value } : x))
                )
              }
              placeholder="%"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => set("components", layer.components.filter((x) => x.id !== c.id))}
              className="shrink-0 text-(--ds-text-muted) hover:text-red-500 transition-colors"
              aria-label="Remove component"
            >
              <X size={15} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => set("components", [...layer.components, createEmptyPackagingComponent()])}
          className="inline-flex items-center gap-1 text-[12px] font-medium text-(--ds-accent) hover:opacity-80 transition-opacity"
        >
          <Plus size={13} /> Add component
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Recyclability grade (Art. 6-11)" required>
          <select value={layer.recyclabilityGrade} onChange={(e) => set("recyclabilityGrade", e.target.value)} className={selectClass}>
            <option value="">— Select —</option>
            {PACKAGING_RECYCLABILITY_GRADE_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Reusable">
          <select value={layer.reusable} onChange={(e) => set("reusable", e.target.value)} className={selectClass}>
            <option value="">— Select —</option>
            {PACKAGING_YES_NO_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="p-3 rounded-lg bg-(--ds-surface-2) border border-(--ds-border) space-y-2">
        <p className="text-[12px] font-semibold text-(--ds-text-primary)">EPR registration</p>
        <p className="text-[11px] text-(--ds-text-muted)">
          Extended Producer Responsibility registration(s) — one row per country.
        </p>
        {layer.eprRegistrations.map((e) => (
          <div key={e.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
            <SearchableSelect
              options={COUNTRY_OPTIONS}
              value={e.country}
              onChange={(v) =>
                set(
                  "eprRegistrations",
                  layer.eprRegistrations.map((x) => (x.id === e.id ? { ...x, country: v } : x))
                )
              }
              placeholder="— Country —"
              searchPlaceholder="Search countries…"
            />
            <input
              type="text"
              value={e.schemeName}
              onChange={(ev) =>
                set(
                  "eprRegistrations",
                  layer.eprRegistrations.map((x) => (x.id === e.id ? { ...x, schemeName: ev.target.value } : x))
                )
              }
              placeholder="Scheme name"
              className={inputClass}
            />
            <input
              type="text"
              value={e.registrationNumber}
              onChange={(ev) =>
                set(
                  "eprRegistrations",
                  layer.eprRegistrations.map((x) => (x.id === e.id ? { ...x, registrationNumber: ev.target.value } : x))
                )
              }
              placeholder="Registration number"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => set("eprRegistrations", layer.eprRegistrations.filter((x) => x.id !== e.id))}
              className="shrink-0 text-(--ds-text-muted) hover:text-red-500 transition-colors"
              aria-label="Remove EPR registration"
            >
              <X size={15} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => set("eprRegistrations", [...layer.eprRegistrations, createEmptyEprRegistration()])}
          className="inline-flex items-center gap-1 text-[12px] font-medium text-(--ds-accent) hover:opacity-80 transition-opacity"
        >
          <Plus size={13} /> Add EPR registration
        </button>
      </div>

      <div className="pt-1 border-t border-(--ds-border)">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-(--ds-text-muted) mb-3 mt-4">
          Conformity &amp; Declaration of Conformity (Art 38/39)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="DoC number">
            <input type="text" value={layer.docNumber} onChange={(e) => set("docNumber", e.target.value)} placeholder="DoC-2026-001" className={inputClass} />
          </Field>
          <Field label="DoC issue date">
            <input type="date" value={layer.docIssueDate} onChange={(e) => set("docIssueDate", e.target.value)} className={inputClass} />
          </Field>
          <Field label="EU DoC exists" required>
            <select value={layer.euDocExists} onChange={(e) => set("euDocExists", e.target.value)} className={selectClass}>
              <option value="">— Select —</option>
              {PACKAGING_YES_NO_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label="REACH / SVHC compliant">
            <select value={layer.reachSvhcCompliant} onChange={(e) => set("reachSvhcCompliant", e.target.value)} className={selectClass}>
              <option value="">— Select —</option>
              {PACKAGING_YES_NO_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Declaration of Conformity URL">
            <input type="url" value={layer.docUrl} onChange={(e) => set("docUrl", e.target.value)} placeholder="https://..." className={inputClass} />
          </Field>
        </div>
      </div>

      {showOptional && (
        <div className="pt-1 border-t border-(--ds-border) space-y-5">
          <p className={`${groupHeadingClass} mt-4`}>More PPWR data (optional)</p>

          <div>
            <p className={groupHeadingClass}>Section 1 &amp; 3 - Classification &amp; minimisation (Art. 10)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Packaging category">
                <input type="text" value={layer.packagingCategory} onChange={(e) => set("packagingCategory", e.target.value)} placeholder="e-commerce / grouped / transport" className={inputClass} />
              </Field>
              <Field label="Packaging format">
                <input type="text" value={layer.packagingFormat} onChange={(e) => set("packagingFormat", e.target.value)} placeholder="bottle / carton / pallet" className={inputClass} />
              </Field>
              <Field label="Volume (l) — Art. 10">
                <input type="text" value={layer.volumeLitres} onChange={(e) => set("volumeLitres", e.target.value)} placeholder="0.5" className={inputClass} />
              </Field>
              <Field label="Dimensions — Art. 10">
                <input type="text" value={layer.dimensions} onChange={(e) => set("dimensions", e.target.value)} placeholder="200×120×80 mm" className={inputClass} />
              </Field>
              <Field label="Total weight (g)">
                <input type="text" value={layer.totalWeightGrams} onChange={(e) => set("totalWeightGrams", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Empty weight (g)">
                <input type="text" value={layer.emptyWeightGrams} onChange={(e) => set("emptyWeightGrams", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Packaging ratio">
                <input type="text" value={layer.packagingRatio} onChange={(e) => set("packagingRatio", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Mono-material">
                <select value={layer.monoMaterial} onChange={(e) => set("monoMaterial", e.target.value)} className={selectClass}>
                  <option value="">— Select —</option>
                  {PACKAGING_YES_NO_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <div>
            <p className={groupHeadingClass}>Section 2 - Economic operator (Art. 15/18)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Manufacturer role">
                <select value={layer.manufacturerRole} onChange={(e) => set("manufacturerRole", e.target.value)} className={selectClass}>
                  <option value="">— Select —</option>
                  {PACKAGING_MANUFACTURER_ROLE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Unique packaging identifier (Art 15(5))">
                <input type="text" value={layer.uniquePackagingIdentifier} onChange={(e) => set("uniquePackagingIdentifier", e.target.value)} placeholder="EPR reg / GLN" className={inputClass} />
              </Field>
              <Field label="Producer trademark">
                <input type="text" value={layer.producerTrademark} onChange={(e) => set("producerTrademark", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Importer">
                <input type="text" value={layer.importer} onChange={(e) => set("importer", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Importer address">
                <input type="text" value={layer.importerAddress} onChange={(e) => set("importerAddress", e.target.value)} className={inputClass} />
              </Field>
            </div>
          </div>

          <div>
            <p className={groupHeadingClass}>Section 4 : Substances (Art. 5)</p>
            <div className="rounded-xl border border-(--ds-border) bg-(--ds-surface-2) px-4 py-3 text-[12px] leading-relaxed text-(--ds-text-secondary) mb-4">
              No exact measured values in the source — substances are declared under the legal limits (heavy metals
              Σ ≤ 100 mg/kg; PFAS, BPA and total fluorine below limit). Enter a measured value only where a limit is
              exceeded.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Heavy metals Σ Pb+Cd+Hg+CrVI (ppm) - Art. 5">
                <input type="text" value={layer.heavyMetalsPpm} onChange={(e) => set("heavyMetalsPpm", e.target.value)} placeholder="≤ 100" className={inputClass} />
              </Field>
              <Field label="PFAS present - Art. 5">
                <select value={layer.pfasPresent} onChange={(e) => set("pfasPresent", e.target.value)} className={selectClass}>
                  <option value="">— Select —</option>
                  {PACKAGING_YES_NO_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Food-contact">
                <select value={layer.foodContact} onChange={(e) => set("foodContact", e.target.value)} className={selectClass}>
                  <option value="">— Select —</option>
                  {PACKAGING_YES_NO_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="PFAS-free">
                <select value={layer.pfasFree} onChange={(e) => set("pfasFree", e.target.value)} className={selectClass}>
                  <option value="">— Select —</option>
                  {PACKAGING_YES_NO_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Total fluorine (ppm)">
                <input type="text" value={layer.totalFluorinePpm} onChange={(e) => set("totalFluorinePpm", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Fluorine under limit">
                <select value={layer.fluorineUnderLimit} onChange={(e) => set("fluorineUnderLimit", e.target.value)} className={selectClass}>
                  <option value="">— Select —</option>
                  {PACKAGING_YES_NO_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Bisphenol-free (BPA)">
                <select value={layer.bisphenolFree} onChange={(e) => set("bisphenolFree", e.target.value)} className={selectClass}>
                  <option value="">— Select —</option>
                  {PACKAGING_YES_NO_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="SVHC present">
                <select value={layer.svhcPresent} onChange={(e) => set("svhcPresent", e.target.value)} className={selectClass}>
                  <option value="">— Select —</option>
                  {PACKAGING_YES_NO_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="SVHC details">
                <input type="text" value={layer.svhcDetails} onChange={(e) => set("svhcDetails", e.target.value)} placeholder="substance · CAS · %" className={inputClass} />
              </Field>
            </div>
          </div>

          <div>
            <p className={groupHeadingClass}>Section 5 : Recyclability (Art. 6-11)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Recycled content (%)">
                <input type="text" value={layer.recycledContentPercent} onChange={(e) => set("recycledContentPercent", e.target.value)} placeholder="30" className={inputClass} />
              </Field>
              <Field label="Recyclability (%)">
                <input type="text" value={layer.recyclabilityPercent} onChange={(e) => set("recyclabilityPercent", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Recycling stream">
                <input type="text" value={layer.recyclingStream} onChange={(e) => set("recyclingStream", e.target.value)} placeholder="PET bottles / paper / glass" className={inputClass} />
              </Field>
              <Field label="Separable components">
                <select value={layer.separableComponents} onChange={(e) => set("separableComponents", e.target.value)} className={selectClass}>
                  <option value="">— Select —</option>
                  {PACKAGING_YES_NO_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Compostable — Art. 9">
                <select value={layer.compostable} onChange={(e) => set("compostable", e.target.value)} className={selectClass}>
                  <option value="">— Select —</option>
                  {PACKAGING_YES_NO_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Compostability standard">
                <input type="text" value={layer.compostabilityStandard} onChange={(e) => set("compostabilityStandard", e.target.value)} placeholder="EN 13432" className={inputClass} />
              </Field>
              <Field label="Material label — Art. 12">
                <select value={layer.materialLabel} onChange={(e) => set("materialLabel", e.target.value)} className={selectClass}>
                  <option value="">— Select —</option>
                  {PACKAGING_YES_NO_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Separate-collection label (from 8/2028)">
                <select value={layer.separateCollectionLabel} onChange={(e) => set("separateCollectionLabel", e.target.value)} className={selectClass}>
                  <option value="">— Select —</option>
                  {PACKAGING_YES_NO_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="QR / digital carrier — Art. 12">
                <input type="text" value={layer.qrDigitalCarrier} onChange={(e) => set("qrDigitalCarrier", e.target.value)} placeholder="https://... / GS1 Digital Link" className={inputClass} />
              </Field>
            </div>
          </div>

          <div>
            <p className={groupHeadingClass}>Section 6 : Reuse (Art. 11)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Deposit scheme">
                <select value={layer.depositScheme} onChange={(e) => set("depositScheme", e.target.value)} className={selectClass}>
                  <option value="">— Select —</option>
                  {PACKAGING_YES_NO_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Deposit amount (€)">
                <input type="text" value={layer.depositAmount} onChange={(e) => set("depositAmount", e.target.value)} placeholder="0.15" className={inputClass} />
              </Field>
              <Field label="Designed reuse cycles">
                <input type="text" value={layer.designedReuseCycles} onChange={(e) => set("designedReuseCycles", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Reuse system URL">
                <input type="url" value={layer.reuseSystemUrl} onChange={(e) => set("reuseSystemUrl", e.target.value)} placeholder="https://..." className={inputClass} />
              </Field>
              <Field label="Return points URL">
                <input type="url" value={layer.returnPointsUrl} onChange={(e) => set("returnPointsUrl", e.target.value)} placeholder="https://..." className={inputClass} />
              </Field>
            </div>
          </div>

          <div>
            <p className={groupHeadingClass}>Section 8 : Conformity (extra) · footprint</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Conformity assessment date">
                <input type="date" value={layer.conformityAssessmentDate} onChange={(e) => set("conformityAssessmentDate", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Retention (years)">
                <input type="text" value={layer.retentionYears} onChange={(e) => set("retentionYears", e.target.value)} placeholder="10" className={inputClass} />
              </Field>
              <Field label="Test reports URL">
                <input type="url" value={layer.testReportsUrl} onChange={(e) => set("testReportsUrl", e.target.value)} placeholder="https://..." className={inputClass} />
              </Field>
              <Field label="DoC signed by">
                <input type="text" value={layer.docSignedBy} onChange={(e) => set("docSignedBy", e.target.value)} className={inputClass} />
              </Field>
              <Field label="EPR registration (single, legacy)">
                <input type="text" value={layer.eprRegistrationLegacy} onChange={(e) => set("eprRegistrationLegacy", e.target.value)} placeholder="SK-EPR-12345" className={inputClass} />
              </Field>
              <Field label="Carbon footprint (g CO₂e)">
                <input type="text" value={layer.carbonFootprint} onChange={(e) => set("carbonFootprint", e.target.value)} placeholder="120" className={inputClass} />
              </Field>
              <Field label="Carbon source">
                <select value={layer.carbonSource} onChange={(e) => set("carbonSource", e.target.value)} className={selectClass}>
                  <option value="">— Select —</option>
                  {PACKAGING_CARBON_SOURCE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PackagingLayersPanel({
  layers,
  onChange,
  productGtin = null,
  productGtinData = null,
  showOptional = false,
}: {
  layers: PackagingLayer[];
  onChange: (layers: PackagingLayer[]) => void;
  productGtin?: string | null;
  productGtinData?: Record<string, unknown> | null;
  showOptional?: boolean;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addLayer = () => {
    if (layers.length >= MAX_PACKAGING_LAYERS) return;
    const layer = createEmptyPackagingLayer();
    onChange([...layers, layer]);
    setExpandedId(layer.id);
  };

  const removeLayer = (id: string) => {
    onChange(layers.filter((l) => l.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const updateLayer = (id: string, next: PackagingLayer) => onChange(layers.map((l) => (l.id === id ? next : l)));

  return (
    <div className="space-y-3">
      {layers.length === 0 && (
        <p className="text-[13px] text-(--ds-text-muted)">No packaging layers yet.</p>
      )}

      {layers.map((layer, i) => {
        const isOpen = expandedId === layer.id;
        const missing = countMissingRequiredLayerFields(layer);

        return (
          <div key={layer.id} className="rounded-xl border border-(--ds-border) overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-(--ds-surface)">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--ds-surface-2) text-[11px] font-semibold text-(--ds-text-secondary)">
                {i + 1}
              </span>
              <span className="flex-1 text-[13px] font-medium text-(--ds-text-primary) truncate">
                {layer.label || `Layer ${i + 1}`}
              </span>
              {missing > 0 && (
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                  Missing: {missing}
                </span>
              )}
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : layer.id)}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-(--ds-accent) hover:opacity-80 transition-opacity"
              >
                {isOpen ? "Collapse" : "Edit"}
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <button
                type="button"
                onClick={() => removeLayer(layer.id)}
                className="text-(--ds-text-muted) hover:text-red-500 transition-colors"
                aria-label="Remove layer"
              >
                <X size={16} />
              </button>
            </div>
            {isOpen && (
              <div className="p-4 border-t border-(--ds-border)">
                <LayerForm
                  layer={layer}
                  onChange={(next) => updateLayer(layer.id, next)}
                  productGtin={productGtin}
                  productGtinData={productGtinData}
                  showOptional={showOptional}
                />
              </div>
            )}
          </div>
        );
      })}

      {layers.length < MAX_PACKAGING_LAYERS ? (
        <button
          type="button"
          onClick={addLayer}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-(--ds-accent) hover:opacity-80 transition-opacity"
        >
          <Plus size={14} /> Add packaging layer
        </button>
      ) : (
        <p className="text-[12px] text-(--ds-text-muted)">Maximum of {MAX_PACKAGING_LAYERS} layers reached.</p>
      )}
    </div>
  );
}
