"use client";

import { use, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
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
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { getProductForDppAction, createProductDppAction } from "@/lib/dashboard/actions";
import { GtinField, type GtinCheckState } from "@/components/dashboard/gtin-field";
import { IconSelect, type IconSelectOption } from "@/components/dashboard/icon-select";
import { SearchableSelect } from "@/components/dashboard/searchable-select";
import { ProductGallery } from "@/components/dashboard/product-gallery";
import { PackagingLayersPanel } from "@/components/dashboard/packaging-layers-panel";
import { DPP_SECTOR_SECTIONS, trimFieldLabel, type DppSectionField } from "@/lib/dpp/sector-sections";
import { DPP_SECTIONS, getOrderedDppSections, type DppSectionSpec } from "@/lib/dpp/dpp-sections";
import { COUNTRY_OPTIONS } from "@/lib/dpp/countries";
import { countMissingRequiredLayerFields, type PackagingLayer } from "@/lib/dpp/packaging-layers";
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
  { value: "FOOD", label: "Food", icon: UtensilsCrossed },
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
};

const selectClass =
  "w-full h-[44px] px-4 rounded-xl border border-(--ds-border) bg-(--ds-bg) text-[14px] text-(--ds-text-primary) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all disabled:opacity-60 disabled:cursor-not-allowed";
const inputClass =
  "w-full h-[44px] px-4 rounded-xl border border-(--ds-border) bg-(--ds-bg) text-[14px] text-(--ds-text-primary) placeholder-(--ds-text-muted) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all";

type SidebarItem =
  | { key: "identification"; kind: "identification" }
  | { key: "gallery"; kind: "gallery" }
  | { key: string; kind: "section"; spec: DppSectionSpec };

function flattenFields(spec: { fields?: DppSectionField[]; groups?: { fields: DppSectionField[] }[] }): DppSectionField[] {
  return spec.fields ?? spec.groups?.flatMap((g) => g.fields) ?? [];
}

/** One field from a section's data. Label is a trimmed version of the raw
 * compliance text; when trimming actually changed something, the full
 * original text is kept visible as a caption so nothing is lost. */
function DppFieldInput({
  field,
  value,
  onChange,
}: {
  field: DppSectionField;
  value: string;
  onChange: (value: string) => void;
}) {
  const label = trimFieldLabel(field.text);
  const wasTrimmed = label !== field.text;

  return (
    <div>
      <label className="block text-[12px] font-medium text-(--ds-text-primary) mb-1">
        {label} {field.required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} h-[38px] text-[13px]`}
      />
      {wasTrimmed && <p className="mt-1 text-[11px] text-(--ds-text-muted)">{field.text}</p>}
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
  const [packagingLayers, setPackagingLayers] = useState<PackagingLayer[]>([]);
  const [showOptional, setShowOptional] = useState<Record<string, boolean>>({});
  const [activeKey, setActiveKey] = useState<string>("identification");

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
        const { packaging, ...answers } = raw as Record<string, Record<string, string>> & {
          packaging?: { layers?: PackagingLayer[] };
        };
        setSectionAnswers(answers);
        if (Array.isArray(packaging?.layers)) setPackagingLayers(packaging.layers);

        // Auto-reveal a section's optional fields if it already has one
        // filled in, so returning to edit doesn't hide existing answers.
        const nextShow: Record<string, boolean> = {};
        for (const [key, ans] of Object.entries(answers)) {
          const spec =
            key === "sector"
              ? loadedSector
                ? DPP_SECTOR_SECTIONS[loadedSector]
                : undefined
              : DPP_SECTIONS.find((s) => s.key === key);
          if (!spec) continue;
          const hasOptionalAnswered = flattenFields(spec).some((f) => !f.required && ans[f.text]?.trim());
          if (hasOptionalAnswered) nextShow[key] = true;
        }
        setShowOptional(nextShow);
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

    const items: SidebarItem[] = [identification];
    for (const spec of before) items.push({ key: spec.key, kind: "section", spec });
    items.push(gallery);
    for (const spec of after) items.push({ key: spec.key, kind: "section", spec });
    return items;
  }, [sector]);

  const setFieldAnswer = (sectionKey: string, fieldText: string, value: string) => {
    setSectionAnswers((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], [fieldText]: value },
    }));
  };

  const hasMissingRequired = (item: SidebarItem): boolean => {
    if (item.kind === "identification") {
      const identifierMissing = identifierType === "GS1_GTIN" ? !gtinLocked && !gtin.trim() : !identifierValue.trim();
      return identifierMissing || !sector;
    }
    if (item.kind === "gallery") return false;
    if (item.key === "packaging") {
      return packagingLayers.length === 0 || packagingLayers.some((l) => countMissingRequiredLayerFields(l) > 0);
    }
    const answers = sectionAnswers[item.key] ?? {};
    return flattenFields(item.spec).some((f) => f.required && !answers[f.text]?.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!canSubmit) {
      setError(identifierType === "GS1_GTIN" ? "Enter a valid GTIN to continue." : "Identifier is required.");
      return;
    }

    startTransition(async () => {
      const result = await createProductDppAction({
        productId,
        identifierType,
        identifierValue: identifierType === "GS1_GTIN" ? gtin.trim() : identifierValue.trim(),
        sector,
        sectionAnswers: {
          ...sectionAnswers,
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
          <h1 className="text-xl font-bold tracking-tight text-(--ds-text-primary)">Digital Product Passport</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-start">
          {/* Sidebar */}
          <div className="w-full md:w-[220px] shrink-0 flex flex-col gap-1.5">
            {sidebarItems.map((item) => {
              const isActive = item.key === activeKey;
              const label =
                item.kind === "identification"
                  ? "Product identification"
                  : item.kind === "gallery"
                    ? "Product gallery"
                    : item.spec.sidebarLabel;
              const Icon =
                item.kind === "identification"
                  ? Package
                  : item.kind === "gallery"
                    ? ImageIcon
                    : item.key === "sector" && sector
                      ? SECTOR_ICON_MAP[sector]
                      : SECTION_ICONS[item.spec.icon] ?? Boxes;
              const missing = hasMissingRequired(item);

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveKey(item.key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium text-left transition-colors ${
                    isActive
                      ? "bg-[#0284c7] text-white"
                      : "text-(--ds-text-primary) hover:bg-(--ds-surface-2) border border-(--ds-border)"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-(--ds-text-muted)"} />
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
                answers={sectionAnswers[activeItem.key] ?? {}}
                showOptional={!!showOptional[activeItem.key]}
                onToggleOptional={(v) => setShowOptional((prev) => ({ ...prev, [activeItem.key]: v }))}
                onFieldChange={(text, value) => setFieldAnswer(activeItem.key, text, value)}
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
  showOptional,
  onToggleOptional,
  onFieldChange,
  extraFieldsBefore,
}: {
  spec: DppSectionSpec;
  answers: Record<string, string>;
  showOptional: boolean;
  onToggleOptional: (v: boolean) => void;
  onFieldChange: (fieldText: string, value: string) => void;
  extraFieldsBefore?: React.ReactNode;
}) {
  const renderFields = (fields: DppSectionField[], skipTexts: Set<string> = new Set()) => {
    const required = fields.filter((f) => f.required && !skipTexts.has(f.text));
    const optional = fields.filter((f) => !f.required && !skipTexts.has(f.text));
    return (
      <>
        {required.map((f) => (
          <DppFieldInput key={f.text} field={f} value={answers[f.text] ?? ""} onChange={(v) => onFieldChange(f.text, v)} />
        ))}
        {showOptional &&
          optional.map((f) => (
            <DppFieldInput key={f.text} field={f} value={answers[f.text] ?? ""} onChange={(v) => onFieldChange(f.text, v)} />
          ))}
      </>
    );
  };

  // Manufacturer country is rendered separately (as a select) - skip it from
  // the generic text-input rendering for the Manufacturer group.
  const skipManufacturerCountry = new Set(extraFieldsBefore ? ["Manufacturer country"] : []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <SectionHeading title={spec.title} directive={spec.directive} />
        <label className="flex items-center gap-2 text-[12px] text-(--ds-text-secondary) cursor-pointer select-none shrink-0">
          Show optional fields
          <span
            onClick={() => onToggleOptional(!showOptional)}
            className={`inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              showOptional ? "bg-(--ds-accent)" : "bg-[#cbd5e1] dark:bg-[#475569]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                showOptional ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </span>
        </label>
      </div>

      {spec.groups ? (
        spec.groups.map((group) => (
          <div key={group.label} className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-(--ds-text-muted)">{group.label}</p>
            {group.label === "Manufacturer" && extraFieldsBefore}
            {renderFields(group.fields, group.label === "Manufacturer" ? skipManufacturerCountry : undefined)}
          </div>
        ))
      ) : (
        <div className="space-y-3">{renderFields(spec.fields ?? [])}</div>
      )}
    </div>
  );
}
