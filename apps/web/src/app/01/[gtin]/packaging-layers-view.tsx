// Read-only rendering of the DPP's repeatable packaging layers (PPWR Art.
// 12) for the public passport view - see
// apps/web/src/lib/dpp/packaging-layers.ts for the shared shape and why
// "packaging" isn't a flat field section like the rest of dpp-view.tsx.
// Server-rendered, same <details>/<summary> disclosure pattern as
// SectionCard so it sits consistently among the other sections.
import type { PackagingLayer } from "@/lib/dpp/packaging-layers";
import { translateDpp, translateDppTemplate } from "@/lib/dpp/i18n/translate";
import { SectionChevron, SectionInfoIcon } from "./summary-chevron";

/** PackagingLayer's fields aren't typed (unlike DppSectionField/RowFieldDef
 * elsewhere), so a toggle-style field can't be detected up front - a value
 * that's exactly "Yes"/"No" (this schema has no free-text field a producer
 * could coincidentally type either into) gets the same dot treatment as the
 * other sections' `type: "toggle"` fields instead. */
function ToggleDot({ value }: { value: string }) {
  return (
    <span
      aria-hidden
      style={{ width: 7, height: 7, borderRadius: 999, flexShrink: 0, background: value.trim().toLowerCase() === "yes" ? "#059669" : "#94a3b8" }}
    />
  );
}

function Row({ label, value, lang }: { label: string; value: string; lang: string }) {
  if (!value.trim()) return null;
  const normalized = value.trim().toLowerCase();
  const isToggle = normalized === "yes" || normalized === "no";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
      <dt style={{ fontSize: 12, color: "#64748b", margin: 0, flex: "0 1 auto", maxWidth: "45%" }}>{translateDpp(label, lang)}</dt>
      <dd style={{ fontSize: 13, color: "#0f172a", margin: 0, fontWeight: 600, flex: "1 1 auto", minWidth: 0, textAlign: "right", wordBreak: "break-word" }}>
        {isToggle ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
            <ToggleDot value={value} />
            {value}
          </span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

/** A sub-group label for the "More PPWR data" rows below - only rendered
 * when at least one field in that group actually has a value, so an empty
 * optional group never leaves a dangling heading. */
function GroupHeading({ title, values, lang }: { title: string; values: string[]; lang: string }) {
  if (!values.some((v) => v.trim())) return null;
  return (
    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3, color: "#94a3b8", margin: "16px 0 4px" }}>
      {translateDpp(title, lang)}
    </p>
  );
}

function LayerCard({ layer, index, lang }: { layer: PackagingLayer; index: number; lang: string }) {
  const componentRows = layer.components
    .map((c) =>
      [c.component, c.material, c.weightGrams && `${c.weightGrams} g`, c.recycledPercent && `${c.recycledPercent}% recycled`]
        .filter(Boolean)
        .join(" · ")
    )
    .filter(Boolean);
  const eprRows = layer.eprRegistrations.filter((e) => e.country || e.schemeName || e.registrationNumber);

  return (
    <div style={{ padding: "14px 0", borderTop: index > 0 ? "1px solid #f1f5f9" : undefined }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>
        {layer.label || translateDppTemplate("Layer {n}", lang, index + 1)}
      </p>
      <dl style={{ margin: 0 }}>
        <Row label="Packaging name" value={layer.packagingName} lang={lang} />
        <Row label="Manufacturer" value={layer.manufacturer} lang={lang} />
        <Row label="Manufacturer country" value={layer.manufacturerCountry} lang={lang} />
        <Row label="Layer type (PPWR)" value={layer.layerType} lang={lang} />
        <Row label="Weight (g)" value={layer.weightGrams} lang={lang} />
        <Row label="Layer composition" value={componentRows.join("; ")} lang={lang} />
        <Row label="Recyclability grade" value={layer.recyclabilityGrade} lang={lang} />
        <Row label="Reusable" value={layer.reusable} lang={lang} />
        <Row
          label="EPR registration"
          value={eprRows
            .map((e) => [e.country, e.schemeName, e.registrationNumber].filter(Boolean).join(": "))
            .join(" · ")}
          lang={lang}
        />
        <Row label="DoC number" value={layer.docNumber} lang={lang} />
        <Row label="DoC issue date" value={layer.docIssueDate} lang={lang} />
        <Row label="EU DoC exists" value={layer.euDocExists} lang={lang} />
        <Row label="REACH / SVHC compliant" value={layer.reachSvhcCompliant} lang={lang} />
        <Row label="Declaration of Conformity" value={layer.docUrl} lang={lang} />

        <GroupHeading
          title="Classification & minimisation"
          values={[
            layer.packagingCategory,
            layer.packagingFormat,
            layer.volumeLitres,
            layer.dimensions,
            layer.totalWeightGrams,
            layer.emptyWeightGrams,
            layer.packagingRatio,
            layer.monoMaterial,
          ]}
        lang={lang}
        />
        <Row label="Packaging category" value={layer.packagingCategory} lang={lang} />
        <Row label="Packaging format" value={layer.packagingFormat} lang={lang} />
        <Row label="Volume (l)" value={layer.volumeLitres} lang={lang} />
        <Row label="Dimensions" value={layer.dimensions} lang={lang} />
        <Row label="Total weight (g)" value={layer.totalWeightGrams} lang={lang} />
        <Row label="Empty weight (g)" value={layer.emptyWeightGrams} lang={lang} />
        <Row label="Packaging ratio" value={layer.packagingRatio} lang={lang} />
        <Row label="Mono-material" value={layer.monoMaterial} lang={lang} />

        <GroupHeading
          title="Economic operator"
          values={[layer.manufacturerRole, layer.uniquePackagingIdentifier, layer.producerTrademark, layer.importer, layer.importerAddress]}
        lang={lang}
        />
        <Row label="Manufacturer role" value={layer.manufacturerRole} lang={lang} />
        <Row label="Unique packaging identifier" value={layer.uniquePackagingIdentifier} lang={lang} />
        <Row label="Producer trademark" value={layer.producerTrademark} lang={lang} />
        <Row label="Importer" value={layer.importer} lang={lang} />
        <Row label="Importer address" value={layer.importerAddress} lang={lang} />

        <GroupHeading
          title="Substances"
          values={[
            layer.heavyMetalsPpm,
            layer.pfasPresent,
            layer.foodContact,
            layer.pfasFree,
            layer.totalFluorinePpm,
            layer.fluorineUnderLimit,
            layer.bisphenolFree,
            layer.svhcPresent,
            layer.svhcDetails,
          ]}
        lang={lang}
        />
        <Row label="Heavy metals Σ Pb+Cd+Hg+CrVI (ppm)" value={layer.heavyMetalsPpm} lang={lang} />
        <Row label="PFAS present" value={layer.pfasPresent} lang={lang} />
        <Row label="Food-contact" value={layer.foodContact} lang={lang} />
        <Row label="PFAS-free" value={layer.pfasFree} lang={lang} />
        <Row label="Total fluorine (ppm)" value={layer.totalFluorinePpm} lang={lang} />
        <Row label="Fluorine under limit" value={layer.fluorineUnderLimit} lang={lang} />
        <Row label="Bisphenol-free (BPA)" value={layer.bisphenolFree} lang={lang} />
        <Row label="SVHC present" value={layer.svhcPresent} lang={lang} />
        <Row label="SVHC details" value={layer.svhcDetails} lang={lang} />

        <GroupHeading
          title="Recyclability"
          values={[
            layer.recycledContentPercent,
            layer.recyclabilityPercent,
            layer.recyclingStream,
            layer.separableComponents,
            layer.compostable,
            layer.compostabilityStandard,
            layer.materialLabel,
            layer.separateCollectionLabel,
            layer.qrDigitalCarrier,
          ]}
        lang={lang}
        />
        <Row label="Recycled content (%)" value={layer.recycledContentPercent} lang={lang} />
        <Row label="Recyclability (%)" value={layer.recyclabilityPercent} lang={lang} />
        <Row label="Recycling stream" value={layer.recyclingStream} lang={lang} />
        <Row label="Separable components" value={layer.separableComponents} lang={lang} />
        <Row label="Compostable" value={layer.compostable} lang={lang} />
        <Row label="Compostability standard" value={layer.compostabilityStandard} lang={lang} />
        <Row label="Material label" value={layer.materialLabel} lang={lang} />
        <Row label="Separate-collection label" value={layer.separateCollectionLabel} lang={lang} />
        <Row label="QR / digital carrier" value={layer.qrDigitalCarrier} lang={lang} />

        <GroupHeading
          title="Reuse"
          values={[layer.depositScheme, layer.depositAmount, layer.designedReuseCycles, layer.reuseSystemUrl, layer.returnPointsUrl]}
        lang={lang}
        />
        <Row label="Deposit scheme" value={layer.depositScheme} lang={lang} />
        <Row label="Deposit amount (€)" value={layer.depositAmount} lang={lang} />
        <Row label="Designed reuse cycles" value={layer.designedReuseCycles} lang={lang} />
        <Row label="Reuse system URL" value={layer.reuseSystemUrl} lang={lang} />
        <Row label="Return points URL" value={layer.returnPointsUrl} lang={lang} />

        <GroupHeading
          title="Conformity (extra) & footprint"
          values={[
            layer.conformityAssessmentDate,
            layer.retentionYears,
            layer.testReportsUrl,
            layer.docSignedBy,
            layer.eprRegistrationLegacy,
            layer.carbonFootprint,
            layer.carbonSource,
          ]}
        lang={lang}
        />
        <Row label="Conformity assessment date" value={layer.conformityAssessmentDate} lang={lang} />
        <Row label="Retention (years)" value={layer.retentionYears} lang={lang} />
        <Row label="Test reports URL" value={layer.testReportsUrl} lang={lang} />
        <Row label="DoC signed by" value={layer.docSignedBy} lang={lang} />
        <Row label="EPR registration (single, legacy)" value={layer.eprRegistrationLegacy} lang={lang} />
        <Row label="Carbon footprint (g CO₂e)" value={layer.carbonFootprint} lang={lang} />
        <Row label="Carbon source" value={layer.carbonSource} lang={lang} />
      </dl>
    </div>
  );
}

export function PackagingLayersView({
  layers,
  title,
  directive,
  defaultOpen,
  lang,
}: {
  layers: PackagingLayer[];
  title: string;
  directive: string;
  defaultOpen: boolean;
  lang: string;
}) {
  if (layers.length === 0) return null;

  return (
    <details
      name="dpp-section"
      open={defaultOpen}
      style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}
    >
      <summary
        className="dpp-summary"
        style={{
          padding: "14px 18px",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          color: "#0f172a",
          listStyle: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span style={{ flex: 1, minWidth: 0 }}>{translateDpp(title, lang)}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <SectionInfoIcon directive={directive} />
          <SectionChevron />
        </span>
      </summary>
      <div style={{ padding: "0 18px 16px" }}>
        {layers.map((layer, i) => (
          <LayerCard key={layer.id} layer={layer} index={i} lang={lang} />
        ))}
      </div>
    </details>
  );
}
