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
      <dd style={{ fontSize: 14, color: "#0f172a", margin: "2px 0 0", fontWeight: 500, wordBreak: "break-word" }}>{value}</dd>
    </div>
  );
}

function LayerCard({ layer, index }: { layer: PackagingLayer; index: number }) {
  const componentNames = layer.components.map((c) => c.material).filter(Boolean);
  const eprRows = layer.eprRegistrations.filter((e) => e.country || e.registrationNumber);

  return (
    <div style={{ padding: "14px 0", borderTop: index > 0 ? "1px solid #f1f5f9" : undefined }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>
        {layer.label || `Layer ${index + 1}`}
      </p>
      <dl style={{ margin: 0 }}>
        <Row label="Packaging name" value={layer.packagingName} />
        <Row label="Manufacturer" value={layer.manufacturer} />
        <Row label="Manufacturer country" value={layer.manufacturerCountry} />
        <Row label="Layer type (PPWR)" value={layer.layerType} />
        <Row label="Weight (g)" value={layer.weightGrams} />
        <Row label="Layer composition" value={componentNames.join(", ")} />
        <Row label="Recyclability grade" value={layer.recyclabilityGrade} />
        <Row label="Reusable" value={layer.reusable} />
        <Row
          label="EPR registration"
          value={eprRows.map((e) => [e.country, e.registrationNumber].filter(Boolean).join(": ")).join(" · ")}
        />
        <Row label="DoC number" value={layer.docNumber} />
        <Row label="DoC issue date" value={layer.docIssueDate} />
        <Row label="EU DoC exists" value={layer.euDocExists} />
        <Row label="REACH / SVHC compliant" value={layer.reachSvhcCompliant} />
        <Row label="Declaration of Conformity" value={layer.docUrl} />
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
