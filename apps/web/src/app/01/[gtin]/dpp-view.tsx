// Public "DPP" view offered alongside the GS1 showcase at /01/{gtin} (see
// gtin-mode-switcher.tsx). Renders the product's Digital Product Passport -
// identity + every filled-in compliance section - in a read-only, document-
// style layout modeled on GS1's own dpp.gs passport pages (single-line
// label/value rows, a mandatory-field legend, a section info icon in place
// of printed small print, a dark identity header with an on-page QR code).
// Server-rendered; section disclosure uses native <details>/<summary> and
// the info icon's tooltip is a native `title` attribute, so the only client
// JS on the page is the gallery carousel, QR badge, copy-link row and
// language picker (each its own small "use client" component).
import { Fragment, type CSSProperties } from "react";
import type { DppSector } from "@productix/db";
import { getIdentificationExtraFields, getOrderedDppSections, isFieldRequired, type DppSectionField, type DppSectionSpec } from "@/lib/dpp/dpp-sections";
import { DPP_SECTOR_LABELS, trimFieldLabel } from "@/lib/dpp/sector-sections";
import type { PackagingLayer } from "@/lib/dpp/packaging-layers";
import type { Row } from "@/lib/dpp/repeatable-rows";
import type { PublicDppVersionSummary } from "@/lib/dashboard/actions";
import { translateDpp } from "@/lib/dpp/i18n/translate";
import { GalleryCarousel } from "./gallery-carousel";
import { PackagingLayersView } from "./packaging-layers-view";
import { RepeatableRowsView } from "./repeatable-rows-view";
import { DppLanguagePicker } from "./dpp-language-picker";
import { SectionChevron, SectionChevronStyle, SectionInfoIcon } from "./summary-chevron";
import { PassportQrCode } from "./passport-qr-code";
import { CopyLinkRow } from "./copy-link-row";

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
  /** Company-wide setting (Company.showDppTranslation) - see DppTranslationCard. */
  translationEnabled: boolean;
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

/** Small colored dot before a `type: "toggle"` field's Yes/No value -
 * matches the reference layout's checkmark/cross treatment for compliance
 * booleans, without implying pass/fail for non-compliance toggles (e.g.
 * "Reusable") - green only marks "Yes", "No" stays a neutral gray. */
function ToggleDot({ value }: { value: string }) {
  return (
    <span
      aria-hidden
      style={{ width: 7, height: 7, borderRadius: 999, flexShrink: 0, background: value.trim().toLowerCase() === "yes" ? "#059669" : "#94a3b8" }}
    />
  );
}

function FieldRow({ field, value, required, lang }: { field: DppSectionField; value: string; required: boolean; lang: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
      <dt style={{ fontSize: 12, color: "#64748b", margin: 0, flex: "0 1 auto", maxWidth: "45%" }}>
        {trimFieldLabel(translateDpp(field.text, lang))}
        {required && (
          <span aria-hidden style={{ color: "#f59e0b", marginLeft: 4 }}>
            •
          </span>
        )}
      </dt>
      <dd style={{ fontSize: 13, color: "#0f172a", margin: 0, fontWeight: 600, flex: "1 1 auto", minWidth: 0, textAlign: "right", wordBreak: "break-word" }}>
        {field.type === "upload" ? (
          // "View document ↗" is our own system-generated label, not user
          // data - translated. Only the href (an attribute, never
          // translated regardless) carries the actual uploaded file's data.
          <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: "#0284c7", wordBreak: "break-word" }}>
            {translateDpp("View document ↗", lang)}
          </a>
        ) : field.type === "url" ? (
          <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: "#0284c7", wordBreak: "break-word" }}>
            {value}
          </a>
        ) : field.type === "toggle" ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
            <ToggleDot value={value} />
            <span>{value}</span>
          </span>
        ) : (
          <span>{value}</span>
        )}
      </dd>
    </div>
  );
}

function SectionCard({
  spec,
  answers,
  defaultOpen,
  lang,
}: {
  spec: DppSectionSpec;
  answers: Record<string, string>;
  defaultOpen: boolean;
  lang: string;
}) {
  if (spec.groups) {
    const groups = spec.groups
      .map((g) => ({ label: g.label, fields: g.fields.filter((f) => answers[f.text]?.trim()) }))
      .filter((g) => g.fields.length > 0);
    if (groups.length === 0) return null;

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
          <span style={{ flex: 1, minWidth: 0 }}>{translateDpp(spec.title, lang)}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <SectionInfoIcon directive={spec.directive} />
            <SectionChevron />
          </span>
        </summary>
        <div style={{ padding: "0 18px 16px" }}>
          {groups.map((g) => (
            <div key={g.label} style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#94a3b8", margin: "8px 0 2px" }}>
                {translateDpp(g.label, lang)}
              </p>
              <dl style={{ margin: 0 }}>
                {g.fields.map((f) => (
                  <FieldRow key={f.text} field={f} value={answers[f.text]!} required={isFieldRequired(f, answers)} lang={lang} />
                ))}
              </dl>
            </div>
          ))}
        </div>
      </details>
    );
  }

  const fields = flattenFields(spec).filter((f) => answers[f.text]?.trim());
  if (fields.length === 0) return null;

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
        <span style={{ flex: 1, minWidth: 0 }}>{translateDpp(spec.title, lang)}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <SectionInfoIcon directive={spec.directive} />
          <SectionChevron />
        </span>
      </summary>
      <div style={{ padding: "0 18px 16px" }}>
        <dl style={{ margin: 0 }}>
          {fields.map((f) => (
            <FieldRow key={f.text} field={f} value={answers[f.text]!} required={isFieldRequired(f, answers)} lang={lang} />
          ))}
        </dl>
      </div>
    </details>
  );
}

export function DppPassportView({
  data,
  batch,
  versions,
  viewingVersion,
  lang = "en",
}: {
  data: PublicDppData;
  batch: string | null;
  /** Public version history list - omitted/empty when the owning company has it turned off. */
  versions?: PublicDppVersionSummary[];
  /** Set when rendering a past version's snapshot instead of the live passport. */
  viewingVersion?: number | null;
  /** Selected UI language for fixed copy (labels/titles/static strings) -
   * see translateDpp/DppLanguagePicker. Defaults to English for callers
   * (e.g. gtin-mode-switcher's static-generation paths) that don't pass one. */
  lang?: string;
}) {
  const sections = [buildIdentificationSectionSpec(data.sector), ...getOrderedDppSections(data.sector)];
  const logoUrl = data.logoUrl || data.brand?.logoUrl || data.company.logoUrl;
  const isVerified = data.gtinStatus === "GS1_VERIFIED";
  const t = (text: string) => translateDpp(text, lang);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "var(--font-sans)" }}>
      <SectionChevronStyle />
      {data.translationEnabled && <DppLanguagePicker lang={lang} />}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 56px" }}>
        {/* Header / identity */}
        <div
          style={{
            background: "#0f172a",
            borderRadius: 20,
            padding: "24px",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: "0 0 12px" }}>
                {t("Digital Product Passport")}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                {logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={data.productName}
                    style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 8, background: "#fff", flexShrink: 0 }}
                  />
                )}
                <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0, wordBreak: "break-word" }}>{data.productName}</h1>
              </div>
              {data.tagline && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 4px" }}>{data.tagline}</p>}
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 14px" }}>{data.brand?.name ?? data.company.name}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span style={darkChipStyle}>
                  {t("GTIN")} {formatGtinDisplay(data.gtin)}
                </span>
                {isVerified && (
                  <span style={{ ...darkChipStyle, color: "#6ee7b7", background: "rgba(5,150,105,0.2)" }}>
                    {t("✓ Verified via GS1 Registry")}
                  </span>
                )}
                {batch && (
                  <span style={darkChipStyle}>
                    {t("Batch")} {batch}
                  </span>
                )}
                {data.sector && <span style={darkChipStyle}>{t(DPP_SECTOR_LABELS[data.sector])}</span>}
              </div>
            </div>
            <PassportQrCode gtin={data.gtin} />
          </div>
        </div>

        {viewingVersion != null && (
          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: 12,
              padding: "10px 16px",
              marginBottom: 16,
              fontSize: 12,
              color: "#92400e",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span>{translateDpp("Viewing version {n} — historical data, not the current passport.", lang).replace("{n}", String(viewingVersion))}</span>
            <a
              href={`/01/${data.gtin}`}
              style={{ color: "#92400e", fontWeight: 600, textDecoration: "underline", whiteSpace: "nowrap" }}
            >
              {t("Back to current")}
            </a>
          </div>
        )}

        {/* Gallery */}
        <GalleryCarousel images={data.gallery} />
        <CopyLinkRow gtin={data.gtin} lang={lang} />

        <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 10px", textAlign: "center" }}>
          {t("Fields marked")}{" "}
          <span aria-hidden style={{ color: "#f59e0b" }}>
            •
          </span>{" "}
          {t("are mandatory under EU regulation.")}
        </p>

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
                  lang={lang}
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
            const sectionCard = <SectionCard spec={spec} answers={answers} defaultOpen={i === 0} lang={lang} />;
            const repeatableCards = spec.repeatable?.map((block) => (
              <RepeatableRowsView
                key={block.key}
                fields={block.fields}
                rows={rowsByBlock[block.key] ?? []}
                title={spec.repeatable!.length > 1 && block.label ? `${t(spec.title)} — ${t(block.label)}` : t(spec.title)}
                directive={spec.directive}
                defaultOpen={false}
                explainerText={block.explainerText}
                explainerText2={block.explainerText2}
                lang={lang}
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

        {versions && versions.length > 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              padding: 20,
              marginTop: 10,
            }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 12px" }}>{t("Version history")}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {versions.map((v, i) => (
                <div
                  key={v.versionNumber}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 10,
                    fontSize: 12,
                    borderBottom: i === versions.length - 1 ? "none" : "1px solid #f1f5f9",
                    paddingBottom: 8,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontWeight: 700, color: "#0f172a" }}>v{v.versionNumber}</span>
                    <span style={{ color: "#94a3b8", marginLeft: 6 }}>{new Date(v.createdAt).toLocaleString()}</span>
                    {v.summary && <div style={{ color: "#64748b", marginTop: 2 }}>{v.summary}</div>}
                  </div>
                  {v.versionNumber === viewingVersion ? (
                    <span style={{ color: "#92400e", fontWeight: 600, whiteSpace: "nowrap" }}>{t("Viewing")}</span>
                  ) : i === 0 && viewingVersion == null ? (
                    <span style={{ color: "#059669", fontWeight: 600, whiteSpace: "nowrap" }}>{t("Current")}</span>
                  ) : (
                    <a
                      href={`/01/${data.gtin}?version=${v.versionNumber}${lang !== "en" ? `&lang=${lang}` : ""}`}
                      style={{ color: data.themeColor, fontWeight: 600, whiteSpace: "nowrap", textDecoration: "none" }}
                    >
                      {t("View")}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <footer style={{ marginTop: 32, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#cbd5e1", margin: "0 0 8px" }}>
            {t("Passport data provided by")} {data.company.name}
            {t(", per EU Regulation 2024/1781 (ESPR).")}
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
            {t("Powered by")}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-light.png" alt="Productix" style={{ height: 12, width: "auto", display: "block" }} />
          </a>
        </footer>
      </div>
    </div>
  );
}

const darkChipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "5px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.1)",
  fontSize: 11,
  fontWeight: 600,
  color: "rgba(255,255,255,0.85)",
};
