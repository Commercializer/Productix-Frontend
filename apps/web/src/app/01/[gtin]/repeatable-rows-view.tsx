// Read-only rendering of a repeatable-row DPP section (Material composition,
// Substances' SVHC list, End-of-life assessment records, Repair & usage
// history's two logs, Product specifications) for the public passport view -
// see apps/web/src/lib/dpp/repeatable-rows.ts and the dashboard's
// repeatable-rows-panel.tsx editor counterpart. Same <details>/<summary>
// disclosure pattern as SectionCard/PackagingLayersView. Each entry just
// lists its filled fields directly (no synthetic "Row N" heading) - a
// divider between entries is enough to tell them apart.
import type { Row, RowFieldDef } from "@/lib/dpp/repeatable-rows";

function FieldRow({ field, value }: { field: RowFieldDef; value: string }) {
  if (!value.trim()) return null;
  return (
    <div style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
      <dt style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{field.label}</dt>
      <dd style={{ fontSize: 14, color: "#0f172a", margin: "2px 0 0", fontWeight: 500, wordBreak: "break-word" }}>
        {field.type === "url" ? (
          <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: "#0284c7", wordBreak: "break-word" }}>
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function RowCard({ fields, row, index }: { fields: RowFieldDef[]; row: Row; index: number }) {
  const filled = fields.filter((f) => row[f.key]?.trim());
  if (filled.length === 0) return null;

  return (
    <div style={{ padding: "14px 0", borderTop: index > 0 ? "1px solid #f1f5f9" : undefined }}>
      <dl style={{ margin: 0 }}>
        {filled.map((f) => (
          <FieldRow key={f.key} field={f} value={row[f.key]!} />
        ))}
      </dl>
    </div>
  );
}

export function RepeatableRowsView({
  fields,
  rows,
  title,
  directive,
  defaultOpen,
}: {
  fields: RowFieldDef[];
  rows: Row[];
  title: string;
  directive: string;
  defaultOpen: boolean;
}) {
  const nonEmptyRows = rows.filter((row) => fields.some((f) => row[f.key]?.trim()));
  if (nonEmptyRows.length === 0) return null;

  return (
    <details open={defaultOpen} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <summary style={{ padding: "14px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#0f172a", listStyle: "none" }}>
        {title}
      </summary>
      <div style={{ padding: "0 18px 16px" }}>
        {nonEmptyRows.map((row, i) => (
          <RowCard key={i} fields={fields} row={row} index={i} />
        ))}
        {directive && <p style={{ fontSize: 11, color: "#cbd5e1", margin: "10px 0 0" }}>{directive}</p>}
      </div>
    </details>
  );
}
