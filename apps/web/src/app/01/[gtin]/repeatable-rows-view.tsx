// Read-only rendering of a repeatable-row DPP section (Material composition,
// Substances' SVHC list, End-of-life assessment records, Repair & usage
// history's two logs, Product specifications) for the public passport view -
// see apps/web/src/lib/dpp/repeatable-rows.ts and the dashboard's
// repeatable-rows-panel.tsx editor counterpart. Same <details>/<summary>
// disclosure pattern as SectionCard/PackagingLayersView. Each entry just
// lists its filled fields directly (no synthetic "Row N" heading) - a
// divider between entries is enough to tell them apart.
import type { Row, RowFieldDef } from "@/lib/dpp/repeatable-rows";
import { translateDpp } from "@/lib/dpp/i18n/translate";
import { SectionChevron, SectionInfoIcon } from "./summary-chevron";

/** Small colored dot before a `type: "toggle"` field's Yes/No value - "Yes"
 * marked green, "No" a neutral gray (not red - a "No" isn't necessarily a
 * failure, e.g. "Reusable: No" is just a fact, not non-compliance). */
function ToggleDot({ value }: { value: string }) {
  return (
    <span
      aria-hidden
      style={{ width: 7, height: 7, borderRadius: 999, flexShrink: 0, background: value.trim().toLowerCase() === "yes" ? "#059669" : "#94a3b8" }}
    />
  );
}

/** Shared value rendering for a row field - a url link, a toggle's dot +
 * Yes/No, or the plain value - used by both FieldRow (stacked entries) and
 * CompactRowsTable (a real <table>, see isCompactTable below). */
function FieldValue({ field, value }: { field: RowFieldDef; value: string }) {
  if (field.type === "url") {
    return (
      <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: "#0284c7", wordBreak: "break-word" }}>
        {value}
      </a>
    );
  }
  if (field.type === "toggle") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
        <ToggleDot value={value} />
        {value}
      </span>
    );
  }
  return <>{value}</>;
}

function FieldRow({ field, value, lang }: { field: RowFieldDef; value: string; lang: string }) {
  if (!value.trim()) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
      <dt style={{ fontSize: 12, color: "#64748b", margin: 0, flex: "0 1 auto", maxWidth: "45%" }}>{translateDpp(field.label, lang)}</dt>
      <dd style={{ fontSize: 13, color: "#0f172a", margin: 0, fontWeight: 600, flex: "1 1 auto", minWidth: 0, textAlign: "right", wordBreak: "break-word" }}>
        <FieldValue field={field} value={value} />
      </dd>
    </div>
  );
}

/** Product specifications' custom rows are a free-form key/value pair - the
 * JSON names its two columns "Field Title"/"Field Content" ("Spec
 * Title"/"Spec Content" for every non-food sector, see sector-requirements
 * JSON) purely as input-form guidance for the dashboard editor. Showing those
 * generic captions on the public passport too would print "Field Title:
 * Volume" / "Field Content: 500 ml" instead of the intended "Volume: 500 ml"
 * - so a two-field title/content row uses the merchant's own title text as
 * the label instead of the schema's static caption. */
function isTitleContentPair(fields: RowFieldDef[]): boolean {
  return fields.length === 2 && /title$/i.test(fields[0]!.label) && /content$/i.test(fields[1]!.label);
}

/** A short, same-shape row schema (e.g. Food's QUID "Ingredient"/"%" list)
 * reads better as an actual table - one header row, one line per entry -
 * than as N stacked label/value pairs per entry. Wider row schemas
 * (Materials, SVHC, End-of-life, Repair history: 4+ columns, some holding
 * long free text/URLs) stay in the stacked FieldRow layout, where they don't
 * have to fight for horizontal space on a phone screen. */
function isCompactTable(fields: RowFieldDef[]): boolean {
  return fields.length >= 2 && fields.length <= 3 && !isTitleContentPair(fields);
}

function CompactRowsTable({ fields, rows, lang }: { fields: RowFieldDef[]; rows: Row[]; lang: string }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {fields.map((f, i) => (
              <th
                key={f.key}
                style={{
                  textAlign: i === 0 ? "left" : "right",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  color: "#94a3b8",
                  padding: "0 0 8px",
                  borderBottom: "1px solid #e2e8f0",
                  whiteSpace: "nowrap",
                }}
              >
                {translateDpp(f.label, lang)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {fields.map((f, j) => (
                <td
                  key={f.key}
                  style={{
                    textAlign: j === 0 ? "left" : "right",
                    padding: "8px 0",
                    borderBottom: "1px solid #f1f5f9",
                    fontSize: 13,
                    color: "#0f172a",
                    fontWeight: j === 0 ? 500 : 600,
                    wordBreak: "break-word",
                  }}
                >
                  <FieldValue field={f} value={row[f.key] ?? ""} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RowCard({ fields, row, index, lang }: { fields: RowFieldDef[]; row: Row; index: number; lang: string }) {
  const border = { borderTop: index > 0 ? "1px solid #f1f5f9" : undefined };

  if (isTitleContentPair(fields)) {
    const [titleField, contentField] = fields as [RowFieldDef, RowFieldDef];
    const title = row[titleField.key]?.trim();
    const content = row[contentField.key]?.trim();
    if (!title || !content) return null;
    return (
      <div style={{ padding: "14px 0", ...border }}>
        <dl
          style={{
            margin: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: "4px 16px",
          }}
        >
          <dt style={{ fontSize: 13, color: "#64748b", margin: 0, wordBreak: "break-word" }}>{title}</dt>
          <dd style={{ fontSize: 13, color: "#0f172a", margin: 0, fontWeight: 600, wordBreak: "break-word", textAlign: "right" }}>{content}</dd>
        </dl>
      </div>
    );
  }

  const filled = fields.filter((f) => row[f.key]?.trim());
  if (filled.length === 0) return null;

  return (
    <div style={{ padding: "14px 0", ...border }}>
      <dl style={{ margin: 0 }}>
        {filled.map((f) => (
          <FieldRow key={f.key} field={f} value={row[f.key]!} lang={lang} />
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
  explainerText,
  explainerText2,
  lang,
}: {
  fields: RowFieldDef[];
  rows: Row[];
  title: string;
  directive: string;
  defaultOpen: boolean;
  explainerText?: string;
  explainerText2?: string;
  lang: string;
}) {
  const nonEmptyRows = rows.filter((row) => fields.some((f) => row[f.key]?.trim()));
  if (nonEmptyRows.length === 0) return null;

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
        <span style={{ flex: 1, minWidth: 0 }}>{title}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <SectionInfoIcon directive={directive} />
          <SectionChevron />
        </span>
      </summary>
      <div style={{ padding: "0 18px 16px" }}>
        {explainerText && <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 8px" }}>{translateDpp(explainerText, lang)}</p>}
        {explainerText2 && <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 8px" }}>{translateDpp(explainerText2, lang)}</p>}
        {isCompactTable(fields) ? (
          <CompactRowsTable fields={fields} rows={nonEmptyRows} lang={lang} />
        ) : (
          nonEmptyRows.map((row, i) => <RowCard key={i} fields={fields} row={row} index={i} lang={lang} />)
        )}
      </div>
    </details>
  );
}
