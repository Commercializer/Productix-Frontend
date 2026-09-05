"use client";

import { use, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Package,
  Building2,
  ClipboardList,
  Ruler,
  Cloud,
  Recycle,
  Layers,
  FlaskConical,
  PackageCheck,
  Wrench,
  Trash2,
  FileText,
  Boxes,
  Image as ImageIcon,
  ScanBarcode,
  BadgeCheck,
  Hash,
  Loader2,
  UploadCloud,
  BatteryFull,
  Cpu,
  Shirt,
  CircleDot,
  Armchair,
  HardHat,
  TestTube,
  ToyBrick,
  Cog,
  Car,
  Sparkles,
  UtensilsCrossed,
  Stethoscope,
  Factory,
  MoreHorizontal,
  History,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { getProductForDppAction, createProductDppAction } from "@/lib/dashboard/actions";
import { GtinField, type GtinCheckState } from "@/components/dashboard/gtin-field";
import { IconSelect, type IconSelectOption } from "@/components/dashboard/icon-select";
import { SearchableSelect } from "@/components/dashboard/searchable-select";
import { ProductGallery } from "@/components/dashboard/product-gallery";
import { PackagingLayersPanel } from "@/components/dashboard/packaging-layers-panel";
import { RepeatableRowsPanel } from "@/components/dashboard/repeatable-rows-panel";
import { trimFieldLabel, isLongTextField, isFullWidthField, type DppSectionField } from "@/lib/dpp/sector-sections";
import {
  getIdentificationExtraFields,
  getOrderedDppSections,
  getSectorDataGroups,
  isFieldVisible,
  isFieldRequired,
  isFieldDisabled,
  type DppSectionSpec,
  type RequirementCallout,
} from "@/lib/dpp/dpp-sections";
import { COUNTRY_OPTIONS } from "@/lib/dpp/countries";
import { countMissingRequiredLayerFields, type PackagingLayer } from "@/lib/dpp/packaging-layers";
import type { Row } from "@/lib/dpp/repeatable-rows";
import type { DppIdentifierType, DppSector } from "@productix/db";

interface PageProps {
  params: Promise<{ productId: string }>;
}

const IDENTIFIER_TYPE_OPTIONS: { value: DppIdentifierType; label: string }[] = [
  { value: "GS1_GTIN", label: "GS1 / GTIN" },
  { value: "MA_DPP", label: "MA-DPP" },
  { value: "EPC", label: "EPC" },
  { value: "UUID", label: "UUID" },
  { value: "DID", label: "DID" },
];

const SECTOR_OPTIONS: IconSelectOption<DppSector>[] = [
  { value: "BATTERY", label: "Battery", icon: BatteryFull },
  { value: "ELECTRONICS", label: "Electronics", icon: Cpu },
  { value: "TEXTILE", label: "Textile", icon: Shirt },
  { value: "TYRE", label: "Tyre", icon: CircleDot },
  { value: "FURNITURE", label: "Furniture", icon: Armchair },
  { value: "CONSTRUCTION", label: "Construction", icon: HardHat },
  { value: "CHEMICALS", label: "Chemicals", icon: TestTube },
  { value: "TOYS", label: "Toys", icon: ToyBrick },
  { value: "MACHINERY", label: "Machinery", icon: Cog },
  { value: "VEHICLES", label: "Vehicles", icon: Car },
  { value: "PACKAGING", label: "Packaging", icon: Package },
  { value: "COSMETICS", label: "Cosmetics", icon: Sparkles },
  { value: "FOOD", label: "Food & Beverages", icon: UtensilsCrossed },
  { value: "MEDICAL", label: "Medical", icon: Stethoscope },
  { value: "INTERMEDIATE_PRODUCTS", label: "Intermediate Products", icon: Factory },
  { value: "OTHER", label: "Other", icon: MoreHorizontal },
];

const SECTOR_ICON_MAP: Record<DppSector, React.ComponentType<{ size?: number; className?: string }>> = Object.fromEntries(
  SECTOR_OPTIONS.map((o) => [o.value, o.icon])
) as Record<DppSector, React.ComponentType<{ size?: number; className?: string }>>;

const SECTION_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Building2,
  ClipboardList,
  Ruler,
  Cloud,
  Recycle,
  Layers,
  FlaskConical,
  PackageCheck,
  Wrench,
  Trash2,
  FileText,
  History,
};

const selectClass =
  "w-full h-[44px] px-4 rounded-xl border border-(--ds-border) bg-(--ds-bg) text-[14px] text-(--ds-text-primary) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all disabled:opacity-60 disabled:cursor-not-allowed";
const inputClass =
  "w-full h-[44px] px-4 rounded-xl border border-(--ds-border) bg-(--ds-bg) text-[14px] text-(--ds-text-primary) placeholder-(--ds-text-muted) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all";

type SidebarItem =
  | { key: "identification"; kind: "identification" }
  | { key: "gallery"; kind: "gallery" }
  // answersKey defaults to `key` when absent - only set (to "sector") for a
  // sector sub-section item, whose several sidebar rows all read/write the
  // same underlying sectionAnswers.sector map (see sidebarItems below).
  | { key: string; kind: "section"; spec: DppSectionSpec; answersKey?: string }
  // The sector's own row - toggles whether its §N sub-items (kind
  // "section", key "sector:0" etc.) are shown at all, rather than a panel
  // of its own.
  | { key: "sector"; kind: "sector-parent"; title: string };

function flattenFields(spec: { fields?: DppSectionField[]; groups?: { fields: DppSectionField[] }[] }): DppSectionField[] {
  return spec.fields ?? spec.groups?.flatMap((g) => g.fields) ?? [];
}

/** Sector sub-section labels are "§3 Critical Raw Materials (...)" - fine as
 * a citation-style heading in the read-only public passport, but "§3" reads
 * as a stray symbol in a clickable sidebar row. Split it into a step number
 * (rendered as a numbered badge, matching the packaging layers list) and the
 * plain label text. */
function splitSubSectionLabel(label: string): { number: string | null; text: string } {
  const match = label.match(/^§(\d+)\s+(.*)$/);
  return match ? { number: match[1]!, text: match[2]! } : { number: null, text: label };
}

/** A Yes/No switch for `type: "toggle"` fields - same visual as the
 * "Show optional fields" switch elsewhere on this page, bound to the field's
 * string value ("Yes" | "No") rather than a boolean, so it stores the same
 * way every other field does. */
function ToggleFieldInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const isYes = value === "Yes";
  return (
    <button
      type="button"
      onClick={() => onChange(isYes ? "No" : "Yes")}
      className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isYes ? "bg-(--ds-accent)" : "bg-[#cbd5e1] dark:bg-[#475569]"
      }`}
      aria-pressed={isYes}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
          isYes ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/** A `type: "upload"` field's control - a paste-a-link input (kept, so a
 * manually-entered link never breaks) plus a real upload button backed by
 * the same /api/media/upload route ProductGallery uses. The document is
 * still stored as a bare URL string, same as before uploads existed - the
 * upload button just fills that string with a real R2-hosted PDF's URL
 * instead of requiring the producer to host the file elsewhere first. */
function DocumentUploadInput({
  productId,
  value,
  onChange,
}: {
  productId: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("productId", productId);
      const res = await fetch("/api/media/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e: any) {
      setError(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <div className="flex items-center gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste a link, or upload a PDF"
          className={`${inputClass} h-[38px] text-[13px] flex-1`}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          title="Upload PDF"
          className="shrink-0 h-[38px] w-[38px] flex items-center justify-center rounded-xl border border-(--ds-border) bg-(--ds-bg) hover:bg-(--ds-surface-2) transition-colors disabled:opacity-60"
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
        </button>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            title="View file"
            className="shrink-0 h-[38px] w-[38px] flex items-center justify-center rounded-xl border border-(--ds-border) bg-(--ds-bg) hover:bg-(--ds-surface-2) transition-colors"
          >
            <FileText size={15} />
          </a>
        )}
      </div>
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

/** One field from a section's data. Label is a trimmed version of the raw
 * compliance text; when trimming actually changed something, the full
 * original text is kept visible as a caption so nothing is lost. The input
 * control itself branches on `field.type` - defaulting to a plain text input
 * for fields that don't set one, so every pre-existing field keeps working
 * unchanged. */
function DppFieldInput({
  field,
  value,
  onChange,
  productId,
  className,
  required,
  disabled,
}: {
  field: DppSectionField;
  value: string;
  onChange: (value: string) => void;
  productId: string;
  className?: string;
  /** Overrides field.required - e.g. requiredWhen only holds while a sibling
   * field matches (see isFieldRequired in dpp-sections.ts). */
  required?: boolean;
  /** disabledWhen currently matching its sibling field (see isFieldDisabled)
   * - only the plain select/textarea/input controls honor this today; no
   * current field needs it on the richer controls below. */
  disabled?: boolean;
}) {
  const label = trimFieldLabel(field.text);
  const wasTrimmed = label !== field.text;
  const isRequired = required ?? field.required;

  return (
    <div className={className}>
      <label className="block text-[12px] font-medium text-(--ds-text-primary) mb-1">
        {label} {isRequired && <span className="text-red-400">*</span>}
      </label>
      {field.type === "toggle" ? (
        <ToggleFieldInput value={value} onChange={onChange} />
      ) : field.type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${selectClass} h-[38px] text-[13px]`}
        >
          <option value="">— Select —</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : field.type === "tags" ? (
        <TagsFieldInput options={field.options ?? []} value={value} onChange={onChange} />
      ) : field.type === "country-picker" ? (
        <SearchableSelect options={COUNTRY_OPTIONS} value={value} onChange={onChange} searchPlaceholder="Search countries…" />
      ) : field.type === "upload" ? (
        <DocumentUploadInput productId={productId} value={value} onChange={onChange} />
      ) : isLongTextField(field) ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={field.placeholder}
          disabled={disabled}
          className={`${inputClass} h-auto py-2.5 text-[13px] resize-y disabled:opacity-60 disabled:cursor-not-allowed`}
        />
      ) : (
        <input
          type={field.type === "number" || field.type === "date" ? field.type : field.type === "url" ? "url" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          disabled={disabled}
          className={`${inputClass} h-[38px] text-[13px] disabled:opacity-60 disabled:cursor-not-allowed`}
        />
      )}
      {field.helperText && (
        <p className={`mt-1 text-[11px] ${field.helperTextStyle === "lite" ? "text-(--ds-text-muted)/70" : "text-(--ds-text-muted)"}`}>
          {field.helperText}
        </p>
      )}
      {wasTrimmed && <p className="mt-1 text-[11px] text-(--ds-text-muted)">{field.text}</p>}
    </div>
  );
}

/** A `type: "tags"` field's control - toggleable pill buttons over a fixed
 * option list (e.g. Food's "Quality & sustainability certifications"),
 * stored as one comma-joined string like every other flat field (no schema
 * change) - same storage convention as repeatable-rows-panel.tsx's
 * "checkbox"-with-options control. */
function TagsFieldInput({ options, value, onChange }: { options: string[]; value: string; onChange: (value: string) => void }) {
  const selected = new Set(
    value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
  const toggle = (option: string) => {
    const next = new Set(selected);
    if (next.has(option)) next.delete(option);
    else next.add(option);
    onChange([...next].join(", "));
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected.has(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => toggle(o)}
            aria-pressed={active}
            className={`px-3 h-[32px] rounded-full border text-[12px] font-medium transition-colors ${
              active
                ? "bg-(--ds-accent) border-(--ds-accent) text-white"
                : "border-(--ds-border) bg-(--ds-bg) text-(--ds-text-primary) hover:bg-(--ds-surface-2)"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

const CALLOUT_STYLE: Record<RequirementCallout["variant"], string> = {
  success: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400",
  danger: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400",
  neutral: "bg-(--ds-surface-2) border-(--ds-border) text-(--ds-text-secondary)",
};

/** A regulatory/informational callout box (e.g. Battery's "2031 targets ≥16%
 * cobalt..." or Packaging's SVHC declaration threshold) - the spreadsheet's
 * `component: "info_banner"`/`type: "info-banner"` fields, which carry
 * nothing for the producer to answer (see isCalloutField in
 * sector-requirements.ts) but are still real content worth showing. */
function InfoBanner({ callout }: { callout: RequirementCallout }) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-[12px] leading-relaxed ${CALLOUT_STYLE[callout.variant]}`}>
      {callout.title && <p className="font-semibold">{callout.title}</p>}
      {callout.text && <p className={callout.title ? "mt-1" : undefined}>{callout.text}</p>}
      {callout.items && callout.items.length > 0 && (
        <ul className="mt-1 list-disc list-inside space-y-0.5">
          {callout.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CalloutList({ callouts }: { callouts?: RequirementCallout[] }) {
  if (!callouts || callouts.length === 0) return null;
  return (
    <div className="space-y-2">
      {callouts.map((c, i) => (
        <InfoBanner key={i} callout={c} />
      ))}
    </div>
  );
}

export default function ProductDppPage({ params }: PageProps) {
  const { productId } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [productName, setProductName] = useState("");
  const [existingGtin, setExistingGtin] = useState<string | null>(null);
  const [existingGtinVerified, setExistingGtinVerified] = useState(false);
  const [existingGtinData, setExistingGtinData] = useState<Record<string, unknown> | null>(null);

  const [identifierType, setIdentifierType] = useState<DppIdentifierType>("GS1_GTIN");
  const [gtin, setGtin] = useState("");
  const [gtinCheck, setGtinCheck] = useState<GtinCheckState>({ status: "idle" });
  const [identifierValue, setIdentifierValue] = useState("");
  const [sector, setSector] = useState<DppSector | null>(null);

  const [sectionAnswers, setSectionAnswers] = useState<Record<string, Record<string, string>>>({});
  // Repeatable-table rows (Materials, Substances' SVHC list, End-of-life
  // assessment records, Repair & usage history's two logs, Product
  // specifications) - kept separate from the flat sectionAnswers map, same
  // idea as packagingLayers' own state below. Persisted under each section's
  // reserved "__rows" key - see pruneSectionAnswers in dpp-sections.ts.
  const [sectionRows, setSectionRows] = useState<Record<string, Record<string, Row[]>>>({});
  const [packagingLayers, setPackagingLayers] = useState<PackagingLayer[]>([]);
  // One global switch for every section's optional fields, rather than a
  // per-section toggle you'd have to flip again on every tab - see the
  // header where it renders.
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [activeKey, setActiveKey] = useState<string>("identification");
  // Whether the sector's §N sub-sections are expanded in the sidebar -
  // collapsed by default; clicking the sector's own row reveals them (see
  // sidebarItems / the sidebar's onClick below).
  const [sectorGroupOpen, setSectorGroupOpen] = useState(false);

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const res = await getProductForDppAction(productId);
      if (!active) return;
      if (!("success" in res) || !res.success) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { product } = res;
      setProductName(product.productName);

      let loadedSector: DppSector | null = null;
      if (product.gtin) {
        setExistingGtin(product.gtin);
        setExistingGtinVerified(product.gtinStatus === "GS1_VERIFIED");
        setExistingGtinData((product.gtinData as Record<string, unknown> | null) ?? null);
        setIdentifierType("GS1_GTIN");
      } else if (product.dpp) {
        setIdentifierType(product.dpp.identifierType);
        if (product.dpp.identifierType !== "GS1_GTIN") {
          setIdentifierValue(product.dpp.identifierValue ?? "");
        }
      }
      if (product.dpp?.sector) {
        loadedSector = product.dpp.sector;
        setSector(loadedSector);
      }

      if (product.dpp?.sectionAnswers) {
        const raw = product.dpp.sectionAnswers as Record<string, unknown>;
        // "packaging" isn't a flat field map like every other section (see
        // packaging-layers.ts) - it gets its own state, loaded separately.
        const { packaging, ...rest } = raw as Record<string, unknown> & {
          packaging?: { layers?: PackagingLayer[] };
        };
        if (Array.isArray(packaging?.layers)) setPackagingLayers(packaging.layers);

        // Every other section may additionally carry a reserved "__rows" key
        // for its repeatable tables (see DppRepeatableBlock in
        // dpp-sections.ts) alongside the flat field map every section has
        // always used - split them into their own state, same idea as
        // packaging above.
        const answers: Record<string, Record<string, string>> = {};
        const rows: Record<string, Record<string, Row[]>> = {};
        for (const [key, value] of Object.entries(rest)) {
          const { __rows, ...flat } = (value ?? {}) as Record<string, unknown> & { __rows?: Record<string, Row[]> };
          answers[key] = flat as Record<string, string>;
          if (__rows) rows[key] = __rows;
        }
        setSectionAnswers(answers);
        setSectionRows(rows);

        // Auto-reveal optional fields globally if anything already has one
        // filled in, so returning to edit doesn't hide existing answers.
        // Sourced from getOrderedDppSections so a sector-specific field
        // resolution is checked against the right field list, not a stale
        // generic default.
        const orderedSections = loadedSector ? getOrderedDppSections(loadedSector) : [];
        const hasAnyOptionalAnswered = Object.entries(answers).some(([key, ans]) => {
          // "sector" needs no special case here - orderedSections already
          // carries its groups (see getOrderedDppSections' "sector" push),
          // and flattenFields below already flattens groups as well as
          // fields, so it falls straight through the generic branch.
          if (key === "specifications" && getIdentificationExtraFields(loadedSector).some((f) => ans[f.text]?.trim()))
            return true;
          const spec = orderedSections.find((s) => s.key === key);
          return !!spec && flattenFields(spec).some((f) => !f.required && ans[f.text]?.trim());
        });
        if (hasAnyOptionalAnswered) setShowOptionalFields(true);
      }

      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [productId]);

  const gtinLocked = !!existingGtin;
  const gtinSatisfiesPolicy = ["valid_format", "gs1_not_found", "gs1_verified"].includes(gtinCheck.status);

  const canSubmit =
    identifierType === "GS1_GTIN"
      ? gtinLocked || (gtin.trim() !== "" && gtinCheck.status !== "checking" && gtinSatisfiesPolicy)
      : identifierValue.trim() !== "";

  const sidebarItems: SidebarItem[] = useMemo(() => {
    const identification: SidebarItem = { key: "identification", kind: "identification" };
    const gallery: SidebarItem = { key: "gallery", kind: "gallery" };
    // Nothing else is relevant until a sector is chosen - which sections
    // even apply (and the sector-specific one's identity) depend on it.
    // Product gallery is the exception - photos aren't sector-dependent, and
    // uploads already persist against the product regardless of whether the
    // rest of the DPP has been saved yet, so it stays reachable either way.
    if (!sector) return [identification, gallery];

    // getOrderedDppSections already drops the generic ESPR sections that
    // don't apply to this sector (food/cosmetics/medical) and splices in the
    // sector-specific section - see its doc comment. Gallery goes right
    // before "documents" (or at the end, for sectors where "documents" was
    // dropped too), matching where it always sat before this was shared.
    const ordered = getOrderedDppSections(sector);
    const documentsIdx = ordered.findIndex((s) => s.key === "documents");
    const before = documentsIdx === -1 ? ordered : ordered.slice(0, documentsIdx);
    const after = documentsIdx === -1 ? [] : ordered.slice(documentsIdx);

    // The sector section's own numbered sub-sections (§1, §2...) each get
    // their own sidebar row instead of being stacked in one long panel -
    // matching the reference editor's per-§ navigation. They all still read/
    // write the single flat sectionAnswers.sector map (answersKey), so this
    // is purely a navigation split, not a data-model one. The sector's own
    // row is a toggle - its sub-items only appear while sectorGroupOpen.
    const pushSpec = (items: SidebarItem[], spec: DppSectionSpec) => {
      if (spec.key === "sector" && spec.groups && spec.groups.length > 0) {
        items.push({ key: "sector", kind: "sector-parent", title: spec.title });
        if (sectorGroupOpen) {
          spec.groups.forEach((g, i) => {
            items.push({
              key: `sector:${i}`,
              kind: "section",
              spec: {
                key: `sector:${i}`,
                sidebarLabel: g.label,
                icon: spec.icon,
                title: g.label,
                directive: spec.directive,
                fields: g.fields,
                repeatable: g.repeatable,
                callouts: g.callouts,
              },
              answersKey: "sector",
            });
          });
        }
        return;
      }
      items.push({ key: spec.key, kind: "section", spec });
    };

    const items: SidebarItem[] = [identification];
    for (const spec of before) pushSpec(items, spec);
    items.push(gallery);
    for (const spec of after) pushSpec(items, spec);
    return items;
  }, [sector, sectorGroupOpen]);

  const setFieldAnswer = (sectionKey: string, fieldText: string, value: string) => {
    setSectionAnswers((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], [fieldText]: value },
    }));
  };

  const setBlockRows = (sectionKey: string, blockKey: string, rows: Row[]) => {
    setSectionRows((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], [blockKey]: rows },
    }));
  };

  // A field only counts as "missing" while it's actually visible (its own
  // `conditional`, if any, currently matches) and required (plain `required`,
  // or `requiredWhen` currently matching) - see isFieldVisible/isFieldRequired
  // in dpp-sections.ts.
  const isMissing = (f: DppSectionField, answers: Record<string, string>) =>
    isFieldVisible(f, answers) && isFieldRequired(f, answers) && !answers[f.text]?.trim();

  const hasMissingRequired = (item: SidebarItem): boolean => {
    if (item.kind === "identification") {
      const identifierMissing = identifierType === "GS1_GTIN" ? !gtinLocked && !gtin.trim() : !identifierValue.trim();
      const extraAnswers = sectionAnswers.specifications ?? {};
      const extraMissing = getIdentificationExtraFields(sector).some((f) => isMissing(f, extraAnswers));
      return identifierMissing || !sector || extraMissing;
    }
    if (item.kind === "gallery") return false;
    if (item.kind === "sector-parent") {
      const groups = sector ? getSectorDataGroups(sector) : undefined;
      const answers = sectionAnswers.sector ?? {};
      return !!groups?.some((g) => g.fields.some((f) => isMissing(f, answers)));
    }
    if (item.key === "packaging") {
      return packagingLayers.length === 0 || packagingLayers.some((l) => countMissingRequiredLayerFields(l) > 0);
    }
    const answers = sectionAnswers[item.answersKey ?? item.key] ?? {};
    return flattenFields(item.spec).some((f) => isMissing(f, answers));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!canSubmit) {
      setError(identifierType === "GS1_GTIN" ? "Enter a valid GTIN to continue." : "Identifier is required.");
      return;
    }

    startTransition(async () => {
      // Merge each section's flat field answers back together with its
      // repeatable-table rows (see sectionRows above) under the reserved
      // "__rows" key - createProductDppAction/pruneSectionAnswers expects
      // both on the same per-section object.
      const mergedSectionAnswers: Record<string, unknown> = { ...sectionAnswers };
      for (const [key, rows] of Object.entries(sectionRows)) {
        mergedSectionAnswers[key] = { ...(mergedSectionAnswers[key] as Record<string, string> | undefined), __rows: rows };
      }

      const result = await createProductDppAction({
        productId,
        identifierType,
        identifierValue: identifierType === "GS1_GTIN" ? gtin.trim() : identifierValue.trim(),
        sector,
        sectionAnswers: {
          ...mergedSectionAnswers,
          ...(packagingLayers.length > 0 ? { packaging: { layers: packagingLayers } } : {}),
        },
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push("/dashboard/products");
    });
  };

  if (loading) {
    return (
      <div className="page-content bg-(--ds-bg) min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-(--ds-text-muted)" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="page-content bg-(--ds-bg) min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-(--ds-text-primary) mb-2">Product Not Found</h2>
          <p className="text-(--ds-text-secondary) text-sm">
            This product doesn&apos;t exist or you don&apos;t have access to it.
          </p>
        </div>
      </div>
    );
  }

  const activeItem = sidebarItems.find((i) => i.key === activeKey) ?? sidebarItems[0];
  if (!activeItem) return null;

  return (
    <div className="page-content bg-(--ds-bg)">
      <DashboardHeader />
      <section className="section mt-0!">
        <Link
          href="/dashboard/products"
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-(--ds-text-secondary) transition-colors hover:text-(--ds-text-primary)"
        >
          <ArrowLeft size={15} />
          Back to products
        </Link>

        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--ds-surface-2) text-(--ds-text-secondary)">
            <Package size={18} />
          </span>
          <h1 className="text-xl font-bold tracking-tight text-(--ds-text-primary) flex-1">Digital Product Passport</h1>
          <label className="flex items-center gap-2 text-[12px] text-(--ds-text-secondary) cursor-pointer select-none shrink-0">
            Show optional fields
            <span
              onClick={() => setShowOptionalFields((v) => !v)}
              className={`inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                showOptionalFields ? "bg-(--ds-accent)" : "bg-[#cbd5e1] dark:bg-[#475569]"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  showOptionalFields ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-start">
          {/* Sidebar */}
          <div className="w-full md:w-[220px] shrink-0 flex flex-col gap-1.5">
            {sidebarItems.map((item) => {
              if (item.kind === "sector-parent") {
                const Icon = sector ? SECTOR_ICON_MAP[sector] : Boxes;
                const missing = hasMissingRequired(item);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setSectorGroupOpen((open) => {
                        const next = !open;
                        if (next) setActiveKey("sector:0");
                        return next;
                      });
                    }}
                    aria-expanded={sectorGroupOpen}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-[13px] font-medium transition-colors ${
                      sectorGroupOpen
                        ? "bg-[#0284c7] text-white"
                        : "text-(--ds-text-primary) hover:bg-(--ds-surface-2) border border-(--ds-border)"
                    }`}
                  >
                    <Icon size={16} className={sectorGroupOpen ? "text-white" : "text-(--ds-text-muted)"} />
                    <span className="flex-1">{item.title}</span>
                    {missing && (
                      <span className={`h-1.5 w-1.5 rounded-full ${sectorGroupOpen ? "bg-white" : "bg-amber-500"}`} />
                    )}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${sectorGroupOpen ? "rotate-180 text-white" : "text-(--ds-text-muted)"}`}
                    />
                  </button>
                );
              }

              const isActive = item.key === activeKey;
              // A sector sub-section's own row (e.g. "§3 Critical Raw
              // Materials") - indented under the sector's own row above it,
              // with a numbered badge instead of the raw "§N" text.
              const isSectorSub = item.key.startsWith("sector:");
              const subLabel = isSectorSub && item.kind === "section" ? splitSubSectionLabel(item.spec.sidebarLabel) : null;
              const label =
                item.kind === "identification"
                  ? "Product identification"
                  : item.kind === "gallery"
                    ? "Product gallery"
                    : subLabel
                      ? subLabel.text
                      : item.spec.sidebarLabel;
              const Icon =
                item.kind === "identification"
                  ? Package
                  : item.kind === "gallery"
                    ? ImageIcon
                    : item.kind === "section"
                      ? SECTION_ICONS[item.spec.icon] ?? Boxes
                      : Boxes;
              const missing = hasMissingRequired(item);

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveKey(item.key)}
                  className={`flex items-center rounded-xl text-left transition-colors animate-in fade-in slide-in-from-left-2 duration-200 ${
                    isSectorSub ? "gap-1.5 pl-9 pr-2.5 py-2 text-[11px]" : "gap-2 px-3 py-2.5 text-[13px] font-medium"
                  } ${
                    isActive
                      ? "bg-[#0284c7] text-white"
                      : "text-(--ds-text-primary) hover:bg-(--ds-surface-2) border border-(--ds-border)"
                  }`}
                >
                  {isSectorSub && subLabel?.number ? (
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${
                        isActive ? "bg-white/20 text-white" : "bg-(--ds-surface-2) text-(--ds-text-secondary)"
                      }`}
                    >
                      {subLabel.number}
                    </span>
                  ) : (
                    !isSectorSub && <Icon size={16} className={isActive ? "text-white" : "text-(--ds-text-muted)"} />
                  )}
                  <span className="flex-1">{label}</span>
                  {missing && (
                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : "bg-amber-500"}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div className="flex-1 w-full bg-(--ds-surface) border border-(--ds-border) rounded-2xl p-6 sm:p-8">
            {activeItem.kind === "identification" && (
              <div className="space-y-6">
                <SectionHeading title="Product identification" directive="ESPR 2024/1781 · Art. 7, Annex I" />

                <div>
                  <label className="block text-[13px] font-semibold text-(--ds-text-primary) mb-2">Product name</label>
                  <div className="w-full h-[44px] px-4 rounded-xl border border-(--ds-border) bg-(--ds-bg) flex items-center text-[14px] text-(--ds-text-secondary)">
                    {productName || "—"}
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-(--ds-text-primary) mb-2">
                    Sector <span className="text-red-400">*</span>
                  </label>
                  <IconSelect options={SECTOR_OPTIONS} value={sector} onChange={setSector} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-(--ds-text-primary) mb-2">
                      Identifier type <span className="text-red-400">*</span>
                    </label>
                    <select
                      className={selectClass}
                      value={identifierType}
                      onChange={(e) => setIdentifierType(e.target.value as DppIdentifierType)}
                      disabled={gtinLocked}
                    >
                      {IDENTIFIER_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {identifierType === "GS1_GTIN" ? (
                    gtinLocked ? (
                      <div>
                        <label className="block text-[13px] font-semibold text-(--ds-text-primary) mb-2">Identifier</label>
                        <div className="w-full h-[44px] px-4 rounded-xl border border-(--ds-border) bg-(--ds-bg) flex items-center gap-2 text-[14px] text-(--ds-text-primary)">
                          <ScanBarcode size={16} className="text-(--ds-text-muted)" />
                          {existingGtin}
                          {existingGtinVerified && (
                            <span className="ml-auto flex items-center gap-1 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <BadgeCheck size={14} /> Verified
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <GtinField
                          value={gtin}
                          onChange={setGtin}
                          checkState={gtinCheck}
                          onCheckStateChange={setGtinCheck}
                          required
                          label="Identifier"
                        />
                      </div>
                    )
                  ) : (
                    <div>
                      <label className="block text-[13px] font-semibold text-(--ds-text-primary) mb-2">
                        Identifier <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--ds-text-muted)" />
                        <input
                          type="text"
                          value={identifierValue}
                          onChange={(e) => setIdentifierValue(e.target.value)}
                          placeholder={`Enter the ${IDENTIFIER_TYPE_OPTIONS.find((o) => o.value === identifierType)?.label} value`}
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {gtinLocked && (
                  <p className="text-[12px] text-(--ds-text-muted)">
                    This product already has a GTIN on file, so its DPP identifier is fixed to GS1 / GTIN.
                  </p>
                )}

                {(() => {
                  const extraAnswers = sectionAnswers.specifications ?? {};
                  const extraFields = getIdentificationExtraFields(sector).filter((f) => isFieldVisible(f, extraAnswers));
                  const requiredExtraFields = extraFields.filter((f) => isFieldRequired(f, extraAnswers));
                  const optionalExtraFields = extraFields.filter((f) => !isFieldRequired(f, extraAnswers));
                  if (requiredExtraFields.length === 0 && !showOptionalFields) return null;
                  const renderExtra = (f: DppSectionField) => (
                    <DppFieldInput
                      key={f.text}
                      field={f}
                      value={extraAnswers[f.text] ?? ""}
                      onChange={(v) => setFieldAnswer("specifications", f.text, v)}
                      productId={productId}
                      className={isFullWidthField(f) ? "sm:col-span-2" : undefined}
                      required={isFieldRequired(f, extraAnswers)}
                      disabled={isFieldDisabled(f, extraAnswers)}
                    />
                  );
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {requiredExtraFields.map(renderExtra)}
                      {showOptionalFields && optionalExtraFields.map(renderExtra)}
                    </div>
                  );
                })()}
              </div>
            )}

            {activeItem.kind === "gallery" && (
              <div className="space-y-4">
                <SectionHeading title="Product gallery" directive="" />
                <ProductGallery productId={productId} />
              </div>
            )}

            {activeItem.kind === "section" && activeItem.key === "packaging" && (
              <div className="space-y-6">
                <SectionHeading title={activeItem.spec.title} directive={activeItem.spec.directive} />
                <PackagingLayersPanel
                  layers={packagingLayers}
                  onChange={setPackagingLayers}
                  productGtin={gtinLocked ? existingGtin : gtin.trim() || null}
                  productGtinData={
                    gtinCheck.status === "gs1_verified" || gtinCheck.status === "gs1_not_found"
                      ? (gtinCheck.data ?? null)
                      : existingGtinData
                  }
                />
              </div>
            )}

            {activeItem.kind === "section" && activeItem.key !== "packaging" && (
              <SectionPanel
                spec={activeItem.spec}
                answers={sectionAnswers[activeItem.answersKey ?? activeItem.key] ?? {}}
                rows={sectionRows[activeItem.answersKey ?? activeItem.key] ?? {}}
                showOptional={showOptionalFields}
                productId={productId}
                onFieldChange={(text, value) => setFieldAnswer(activeItem.answersKey ?? activeItem.key, text, value)}
                onBlockRowsChange={(blockKey, rows) => setBlockRows(activeItem.answersKey ?? activeItem.key, blockKey, rows)}
                extraFieldsBefore={
                  activeItem.key === "manufacturer" ? (
                    <ManufacturerCountryField
                      value={sectionAnswers.manufacturer?.["Manufacturer country"] ?? ""}
                      onChange={(v) => setFieldAnswer("manufacturer", "Manufacturer country", v)}
                    />
                  ) : undefined
                }
              />
            )}

            {error && (
              <div className="mt-6 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-4 py-3 text-[13px] text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || !canSubmit}
              className="mt-6 w-full sm:w-auto sm:px-8 h-[46px] bg-[#bae6fd] hover:bg-[#7dd3fc] text-[#0284c7] font-semibold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/15 hover:shadow-sky-500/25"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Digital Product Passport"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function SectionHeading({ title, directive }: { title: string; directive: string }) {
  return (
    <div>
      <h2 className="text-[16px] font-bold text-(--ds-text-primary)">{title}</h2>
      {directive && <p className="mt-1 text-[11px] text-(--ds-text-muted)">{directive}</p>}
    </div>
  );
}

function ManufacturerCountryField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-(--ds-text-primary) mb-1">
        Manufacturer country <span className="text-red-400">*</span>
      </label>
      <SearchableSelect options={COUNTRY_OPTIONS} value={value} onChange={onChange} searchPlaceholder="Search countries…" />
    </div>
  );
}

function SectionPanel({
  spec,
  answers,
  rows,
  showOptional,
  onFieldChange,
  onBlockRowsChange,
  extraFieldsBefore,
  productId,
}: {
  spec: DppSectionSpec;
  answers: Record<string, string>;
  rows: Record<string, Row[]>;
  showOptional: boolean;
  onFieldChange: (fieldText: string, value: string) => void;
  onBlockRowsChange: (blockKey: string, rows: Row[]) => void;
  extraFieldsBefore?: React.ReactNode;
  productId: string;
}) {
  const renderFields = (fields: DppSectionField[], skipTexts: Set<string> = new Set()) => {
    // A field with a `conditional` that doesn't currently match its sibling
    // is dropped entirely, not just disabled - see isFieldVisible.
    const visible = fields.filter((f) => !skipTexts.has(f.text) && isFieldVisible(f, answers));
    const required = visible.filter((f) => isFieldRequired(f, answers));
    const optional = visible.filter((f) => !isFieldRequired(f, answers));
    const fieldClass = (f: DppSectionField) => (isFullWidthField(f) ? "sm:col-span-2" : undefined);
    const renderOne = (f: DppSectionField) => (
      <DppFieldInput
        key={f.text}
        field={f}
        value={answers[f.text] ?? ""}
        onChange={(v) => onFieldChange(f.text, v)}
        productId={productId}
        className={fieldClass(f)}
        required={isFieldRequired(f, answers)}
        disabled={isFieldDisabled(f, answers)}
      />
    );
    return (
      <>
        {required.map(renderOne)}
        {showOptional && optional.map(renderOne)}
      </>
    );
  };

  // Manufacturer country is rendered separately (as a select) - skip it from
  // the generic text-input rendering for the Manufacturer group.
  const skipManufacturerCountry = new Set(extraFieldsBefore ? ["Manufacturer country"] : []);

  return (
    <div className="space-y-6">
      <SectionHeading title={spec.title} directive={spec.directive} />
      <CalloutList callouts={spec.callouts} />

      {spec.groups ? (
        spec.groups.map((group) => (
          <div key={group.label} className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-(--ds-text-muted)">{group.label}</p>
            <CalloutList callouts={group.callouts} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {group.label === "Manufacturer" && extraFieldsBefore}
              {renderFields(group.fields, group.label === "Manufacturer" ? skipManufacturerCountry : undefined)}
            </div>
          </div>
        ))
      ) : spec.fields ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{renderFields(spec.fields)}</div>
      ) : null}

      {spec.repeatable?.map((block) => (
        <div key={block.key} className="space-y-3">
          {block.label && (
            <p className="text-[11px] font-semibold uppercase tracking-wide text-(--ds-text-muted)">{block.label}</p>
          )}
          {block.explainerText && <p className="text-[12px] text-(--ds-text-muted)">{block.explainerText}</p>}
          {block.explainerText2 && <p className="text-[12px] text-(--ds-text-muted)">{block.explainerText2}</p>}
          <CalloutList callouts={block.callouts} />
          <RepeatableRowsPanel
            fields={block.fields}
            rows={rows[block.key] ?? []}
            onChange={(next) => onBlockRowsChange(block.key, next)}
            addLabel={block.addLabel}
            emptyLabel={block.emptyLabel}
            max={block.max}
          />
        </div>
      ))}
    </div>
  );
}
