// Read-only rendering of the DPP's repeatable packaging layers (PPWR Art.
// 12) for the public passport view - see
// apps/web/src/lib/dpp/packaging-layers.ts for the shared shape and why
// "packaging" isn't a flat field section like the rest of dpp-view.tsx.
// Server-rendered, same <details>/<summary> disclosure pattern as
// SectionCard so it sits consistently among the other sections.
import type { PackagingLayer } from "@/lib/dpp/packaging-layers";

function Row({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;
  return (
    <div style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
      <dt style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{label}</dt>
      <dd
        className="notranslate"
        translate="no"
        style={{ fontSize: 14, color: "#0f172a", margin: "2px 0 0", fontWeight: 500, wordBreak: "break-word" }}
      >
        {value}
      </dd>
    </div>
  );
}

/** A sub-group label for the "More PPWR data" rows below - only rendered
 * when at least one field in that group actually has a value, so an empty
 * optional group never leaves a dangling heading. */
function GroupHeading({ title, values }: { title: string; values: string[] }) {
  if (!values.some((v) => v.trim())) return null;
  return (
    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3, color: "#94a3b8", margin: "16px 0 4px" }}>
      {title}
    </p>
  );
}

function LayerCard({ layer, index }: { layer: PackagingLayer; index: number }) {
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
      <p className="notranslate" translate="no" style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>
        {layer.label || `Layer ${index + 1}`}
      </p>
      <dl style={{ margin: 0 }}>
        <Row label="Packaging name" value={layer.packagingName} />
        <Row label="Manufacturer" value={layer.manufacturer} />
        <Row label="Manufacturer country" value={layer.manufacturerCountry} />
        <Row label="Layer type (PPWR)" value={layer.layerType} />
        <Row label="Weight (g)" value={layer.weightGrams} />
        <Row label="Layer composition" value={componentRows.join("; ")} />
        <Row label="Recyclability grade" value={layer.recyclabilityGrade} />
        <Row label="Reusable" value={layer.reusable} />
        <Row
          label="EPR registration"
          value={eprRows
            .map((e) => [e.country, e.schemeName, e.registrationNumber].filter(Boolean).join(": "))
            .join(" · ")}
        />
        <Row label="DoC number" value={layer.docNumber} />
        <Row label="DoC issue date" value={layer.docIssueDate} />
        <Row label="EU DoC exists" value={layer.euDocExists} />
        <Row label="REACH / SVHC compliant" value={layer.reachSvhcCompliant} />
        <Row label="Declaration of Conformity" value={layer.docUrl} />

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
        />
        <Row label="Packaging category" value={layer.packagingCategory} />
        <Row label="Packaging format" value={layer.packagingFormat} />
        <Row label="Volume (l)" value={layer.volumeLitres} />
        <Row label="Dimensions" value={layer.dimensions} />
        <Row label="Total weight (g)" value={layer.totalWeightGrams} />
        <Row label="Empty weight (g)" value={layer.emptyWeightGrams} />
        <Row label="Packaging ratio" value={layer.packagingRatio} />
        <Row label="Mono-material" value={layer.monoMaterial} />

        <GroupHeading
          title="Economic operator"
          values={[layer.manufacturerRole, layer.uniquePackagingIdentifier, layer.producerTrademark, layer.importer, layer.importerAddress]}
        />
        <Row label="Manufacturer role" value={layer.manufacturerRole} />
        <Row label="Unique packaging identifier" value={layer.uniquePackagingIdentifier} />
        <Row label="Producer trademark" value={layer.producerTrademark} />
        <Row label="Importer" value={layer.importer} />
        <Row label="Importer address" value={layer.importerAddress} />

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
        />
        <Row label="Heavy metals Σ Pb+Cd+Hg+CrVI (ppm)" value={layer.heavyMetalsPpm} />
        <Row label="PFAS present" value={layer.pfasPresent} />
        <Row label="Food-contact" value={layer.foodContact} />
        <Row label="PFAS-free" value={layer.pfasFree} />
        <Row label="Total fluorine (ppm)" value={layer.totalFluorinePpm} />
        <Row label="Fluorine under limit" value={layer.fluorineUnderLimit} />
        <Row label="Bisphenol-free (BPA)" value={layer.bisphenolFree} />
        <Row label="SVHC present" value={layer.svhcPresent} />
        <Row label="SVHC details" value={layer.svhcDetails} />

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
        />
        <Row label="Recycled content (%)" value={layer.recycledContentPercent} />
        <Row label="Recyclability (%)" value={layer.recyclabilityPercent} />
        <Row label="Recycling stream" value={layer.recyclingStream} />
        <Row label="Separable components" value={layer.separableComponents} />
        <Row label="Compostable" value={layer.compostable} />
        <Row label="Compostability standard" value={layer.compostabilityStandard} />
        <Row label="Material label" value={layer.materialLabel} />
        <Row label="Separate-collection label" value={layer.separateCollectionLabel} />
        <Row label="QR / digital carrier" value={layer.qrDigitalCarrier} />

        <GroupHeading
          title="Reuse"
          values={[layer.depositScheme, layer.depositAmount, layer.designedReuseCycles, layer.reuseSystemUrl, layer.returnPointsUrl]}
        />
        <Row label="Deposit scheme" value={layer.depositScheme} />
        <Row label="Deposit amount (€)" value={layer.depositAmount} />
        <Row label="Designed reuse cycles" value={layer.designedReuseCycles} />
        <Row label="Reuse system URL" value={layer.reuseSystemUrl} />
        <Row label="Return points URL" value={layer.returnPointsUrl} />

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
        />
        <Row label="Conformity assessment date" value={layer.conformityAssessmentDate} />
        <Row label="Retention (years)" value={layer.retentionYears} />
        <Row label="Test reports URL" value={layer.testReportsUrl} />
        <Row label="DoC signed by" value={layer.docSignedBy} />
        <Row label="EPR registration (single, legacy)" value={layer.eprRegistrationLegacy} />
        <Row label="Carbon footprint (g CO₂e)" value={layer.carbonFootprint} />
        <Row label="Carbon source" value={layer.carbonSource} />
      </dl>
    </div>
  );
}

export function PackagingLayersView({
  layers,
  title,
  directive,
  defaultOpen,
}: {
  layers: PackagingLayer[];
  title: string;
  directive: string;
  defaultOpen: boolean;
}) {
  if (layers.length === 0) return null;

  return (
    <details
      open={defaultOpen}
      style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}
    >
      <summary
        style={{ padding: "14px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#0f172a", listStyle: "none" }}
      >
        {title}
      </summary>
      <div style={{ padding: "0 18px 16px" }}>
        {layers.map((layer, i) => (
          <LayerCard key={layer.id} layer={layer} index={i} />
        ))}
        <p style={{ fontSize: 11, color: "#cbd5e1", margin: "10px 0 0" }}>{directive}</p>
      </div>
    </details>
  );
}
