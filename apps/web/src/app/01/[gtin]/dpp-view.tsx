// Public "DPP" view offered alongside the GS1 showcase at /01/{gtin} (see
// gtin-mode-switcher.tsx). Renders the product's Digital Product Passport -
// identity + every filled-in compliance section - in a read-only, document-
// style layout modeled on GS1's own dpp.gs passport pages. Server-rendered;
// section disclosure uses native <details>/<summary>, so the only client JS
// on the page is the gallery carousel (see gallery-carousel.tsx).
import { Fragment, type CSSProperties } from "react";
import type { DppSector } from "@productix/db";
import { getIdentificationExtraFields, getOrderedDppSections, type DppSectionField, type DppSectionSpec } from "@/lib/dpp/dpp-sections";
import { DPP_SECTOR_LABELS, trimFieldLabel } from "@/lib/dpp/sector-sections";
import type { PackagingLayer } from "@/lib/dpp/packaging-layers";
import type { Row } from "@/lib/dpp/repeatable-rows";
import { GalleryCarousel } from "./gallery-carousel";
import { PackagingLayersView } from "./packaging-layers-view";
import { RepeatableRowsView } from "./repeatable-rows-view";

export interface PublicDppData {
  productName: string;
  tagline: string | null;
  logoUrl: string | null;
  themeColor: string;
  company: { name: string; logoUrl: string | null };
  brand: { name: string; logoUrl: string | null } | null;
  gtin: string;
  gtinStatus: string;
  gtinVerifiedAt: string | null;
  identifierType: string;
  sector: DppSector | null;
  // "packaging" holds `{ layers: PackagingLayer[] }` instead of the flat
  // field map every other section uses - see packaging-layers.ts.
  sectionAnswers: Record<string, unknown>;
  gallery: { url: string; name: string }[];
}

/** "08523456790018" -> "0852 3456 7900 18" - purely cosmetic grouping. */
function formatGtinDisplay(gtin: string): string {
  return gtin.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function flattenFields(spec: DppSectionSpec): DppSectionField[] {
  return spec.fields ?? spec.groups?.flatMap((g) => g.fields) ?? [];
}

/** Brand name / Model number / Product category / HS Code (sector-dependent -
 * see getIdentificationExtraFields in dpp-sections.ts) live under "Product
 * identification" in the dashboard editor but are stored under the
 * `specifications` answers key - this page previously didn't render an
 * "identification" card at all (identity was just the header chips above),
 * so synthesize a section spec for them to render as the first card. Key is
 * deliberately not "specifications" or "identification" to avoid colliding
 * with either the real specifications section or the dashboard editor's own
 * sidebar key - see the answers lookup in DppPassportView below. */
function buildIdentificationSectionSpec(sector: DppSector | null): DppSectionSpec {
  return {
    key: "identification-extra",
    sidebarLabel: "Product identification",
    icon: "Package",
    title: "Product Identification",
    directive: "EU Regulation 2024/1781 (ESPR) · Art. 7, Annex I",
    fields: getIdentificationExtraFields(sector),
  };
}

function FieldRow({ field, value }: { field: DppSectionField; value: string }) {
  return (
    <div style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
      <dt style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{trimFieldLabel(field.text)}</dt>
      <dd style={{ fontSize: 14, color: "#0f172a", margin: "2px 0 0", fontWeight: 500, wordBreak: "break-word" }}>
        {field.type === "upload" ? (
          <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: "#0284c7", wordBreak: "break-word" }}>
            View document ↗
          </a>
        ) : field.type === "url" ? (
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

function SectionCard({
  spec,
  answers,
  defaultOpen,
}: {
  spec: DppSectionSpec;
  answers: Record<string, string>;
  defaultOpen: boolean;
}) {
  if (spec.groups) {
    const groups = spec.groups
      .map((g) => ({ label: g.label, fields: g.fields.filter((f) => answers[f.text]?.trim()) }))
      .filter((g) => g.fields.length > 0);
    if (groups.length === 0) return null;

    return (
      <details
        open={defaultOpen}
        style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}
      >
        <summary
          style={{
            padding: "14px 18px",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            color: "#0f172a",
            listStyle: "none",
          }}
        >
          {spec.title}
        </summary>
        <div style={{ padding: "0 18px 16px" }}>
          {groups.map((g) => (
            <div key={g.label} style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#94a3b8", margin: "8px 0 2px" }}>
                {g.label}
              </p>
              <dl style={{ margin: 0 }}>
                {g.fields.map((f) => (
                  <FieldRow key={f.text} field={f} value={answers[f.text]!} />
                ))}
              </dl>
            </div>
          ))}
          {spec.directive && (
            <p style={{ fontSize: 11, color: "#cbd5e1", margin: "10px 0 0" }}>{spec.directive}</p>
          )}
        </div>
      </details>
    );
  }

  const fields = flattenFields(spec).filter((f) => answers[f.text]?.trim());
  if (fields.length === 0) return null;

  return (
    <details
      open={defaultOpen}
      style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}
    >
      <summary
        style={{
          padding: "14px 18px",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          color: "#0f172a",
          listStyle: "none",
        }}
      >
        {spec.title}
      </summary>
      <div style={{ padding: "0 18px 16px" }}>
        <dl style={{ margin: 0 }}>
          {fields.map((f) => (
            <FieldRow key={f.text} field={f} value={answers[f.text]!} />
          ))}
        </dl>
        {spec.directive && <p style={{ fontSize: 11, color: "#cbd5e1", margin: "10px 0 0" }}>{spec.directive}</p>}
      </div>
    </details>
  );
}

export function DppPassportView({ data, batch }: { data: PublicDppData; batch: string | null }) {
  const sections = [buildIdentificationSectionSpec(data.sector), ...getOrderedDppSections(data.sector)];
  const logoUrl = data.logoUrl || data.brand?.logoUrl || data.company.logoUrl;
  const isVerified = data.gtinStatus === "GS1_VERIFIED";

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "var(--font-sans)" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 56px" }}>
        {/* Header / identity */}
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            border: "1px solid #e2e8f0",
            padding: "28px 24px",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: data.themeColor, margin: "0 0 14px" }}>
            Digital Product Passport
          </p>
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={data.productName}
              style={{ width: 72, height: 72, objectFit: "contain", borderRadius: 16, margin: "0 auto 14px" }}
            />
          )}
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>{data.productName}</h1>
          {data.tagline && <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 10px" }}>{data.tagline}</p>}
          <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 16px" }}>
            {data.brand?.name ?? data.company.name}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            <span style={chipStyle}>
              GTIN {formatGtinDisplay(data.gtin)}
            </span>
            {isVerified && (
              <span style={{ ...chipStyle, color: "#059669", background: "#ecfdf5", borderColor: "#a7f3d0" }}>
                ✓ Verified via GS1 Registry
              </span>
            )}
            {batch && <span style={chipStyle}>Batch {batch}</span>}
            {data.sector && <span style={chipStyle}>{DPP_SECTOR_LABELS[data.sector]}</span>}
          </div>
        </div>

        {/* Gallery */}
        <GalleryCarousel images={data.gallery} />

        {/* Compliance sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sections.map((spec, i) => {
            if (spec.key === "packaging") {
              return (
                <PackagingLayersView
                  key={spec.key}
                  title={spec.title}
                  directive={spec.directive}
                  layers={(data.sectionAnswers.packaging as { layers?: PackagingLayer[] } | undefined)?.layers ?? []}
                  defaultOpen={i === 0}
                />
              );
            }

            const answersKey = spec.key === "identification-extra" ? "specifications" : spec.key;
            const { __rows, ...answers } = (data.sectionAnswers[answersKey] as
              | (Record<string, string> & { __rows?: Record<string, Row[]> })
              | undefined) ?? {};
            const rowsByBlock = __rows ?? {};

            // A repeatable-table section (Materials, Substances, End of
            // life, Repair & usage history) renders its flat fields/groups
            // (if any) in one card via SectionCard, then one extra card per
            // repeatable block - see repeatable-rows-view.tsx. Substances of
            // concern (SVHC) reverses this: its SVHC substance table card
            // comes before its Compliance & certifications card.
            const sectionCard = <SectionCard spec={spec} answers={answers} defaultOpen={i === 0} />;
            const repeatableCards = spec.repeatable?.map((block) => (
              <RepeatableRowsView
                key={block.key}
                fields={block.fields}
                rows={rowsByBlock[block.key] ?? []}
                title={spec.repeatable!.length > 1 && block.label ? `${spec.title} — ${block.label}` : spec.title}
                directive={spec.directive}
                defaultOpen={false}
                explainerText={block.explainerText}
                explainerText2={block.explainerText2}
              />
            ));

            return (
              <Fragment key={spec.key}>
                {spec.key === "substances" ? (
                  <>
                    {repeatableCards}
                    {sectionCard}
                  </>
                ) : (
                  <>
                    {sectionCard}
                    {repeatableCards}
                  </>
                )}
              </Fragment>
            );
          })}
        </div>

        <footer style={{ marginTop: 32, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#cbd5e1", margin: "0 0 8px" }}>
            Passport data provided by {data.company.name}, per EU Regulation 2024/1781 (ESPR).
          </p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "#94a3b8",
              textDecoration: "none",
            }}
          >
            Powered by
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-light.png" alt="Productix" style={{ height: 12, width: "auto", display: "block" }} />
          </a>
        </footer>
      </div>
    </div>
  );
}

const chipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "6px 12px",
  borderRadius: 999,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  fontSize: 12,
  fontWeight: 600,
  color: "#334155",
};
