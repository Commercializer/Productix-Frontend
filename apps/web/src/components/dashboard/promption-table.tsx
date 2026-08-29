"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Search,
  LineChart,
  AlignLeft,
  CloudUpload,
  Share,
  SlidersHorizontal,
  Rocket,
  QrCode,
  MoreVertical,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Brush,
  Pencil,
  ArrowUpDown,
  Link2,
  Hash,
  X,
  CornerUpRight,
  Type,
  Globe,
  History,
  Lock,
  BadgeCheck,
  CircleCheck,
  CircleAlert,
  TriangleAlert,
  ScanBarcode,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Layers,
} from "lucide-react";
import type { DppDisplayMode } from "@productix/db";
import type { Promption } from "@/hooks/use-promptions";
import { verifyGtinAction } from "@/lib/dashboard/actions";
import { availableGtinDetailEntries } from "@/lib/gs1";
import { QrModal } from "./qr-modal";
import { SeoSettingsModal } from "./seo-settings-modal";
import { VersionHistoryModal } from "./version-history-modal";

interface PromptionTableProps {
  promptions: Promption[];
  onDelete: (id: string) => Promise<{ success?: boolean; error?: string }>;
  onPublish?: (id: string) => Promise<{ success?: boolean; error?: string; slug?: string }>;
  onUnpublish?: (id: string) => Promise<{ success?: boolean; error?: string }>;
  onSetSlugVisible?: (productId: string, visible: boolean) => Promise<{ success?: boolean; error?: string }>;
  onRenameSlug?: (profileId: string, slug: string) => Promise<{ success?: boolean; error?: string; slug?: string }>;
  onUpdateRedirect?: (
    profileId: string,
    redirectUrl: string | null,
    redirectEnabled: boolean,
  ) => Promise<{ success?: boolean; error?: string; redirectUrl?: string | null; redirectEnabled?: boolean }>;
  onRenameProduct?: (
    profileId: string,
    productName: string,
  ) => Promise<{ success?: boolean; error?: string; productName?: string }>;
  onUpdateProductGtin?: (
    productId: string,
    gtin: string,
  ) => Promise<{ success?: boolean; error?: string; gtin?: string; gtinStatus?: Promption["gtinStatus"] }>;
  onRefreshGtinVerification?: (
    productId: string,
  ) => Promise<{
    success?: boolean;
    error?: string;
    gtinStatus?: Promption["gtinStatus"];
    gtinData?: Record<string, unknown> | null;
  }>;
  onUpdatePinLock?: (
    profileId: string,
    pin: string | null,
    pinEnabled: boolean,
  ) => Promise<{ success?: boolean; error?: string; pinEnabled?: boolean; hasPin?: boolean }>;
  onRevealPin?: (
    profileId: string,
    password: string,
  ) => Promise<{ success?: boolean; error?: string; pinCode?: string }>;
  onUpdateDppDisplayMode?: (
    productId: string,
    mode: DppDisplayMode,
    previousMode: DppDisplayMode,
  ) => Promise<{ success?: boolean; error?: string }>;
  readOnly?: boolean;
}

const DPP_DISPLAY_MODE_LABEL: Record<DppDisplayMode, string> = {
  GS1: "GS1 only",
  DPP: "DPP only",
  BOTH: "Toggle",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function PromptionTable({
  promptions,
  onDelete,
  onPublish,
  onUnpublish,
  onSetSlugVisible,
  onRenameSlug,
  onUpdateRedirect,
  onRenameProduct,
  onUpdateProductGtin,
  onRefreshGtinVerification,
  onUpdatePinLock,
  onRevealPin,
  onUpdateDppDisplayMode,
  readOnly = false,
}: PromptionTableProps) {
  const [search, setSearch] = useState("");
  const [selectedIDs, setSelectedIDs] = useState<Set<string>>(new Set());
  const [qrModal, setQrModal] = useState<{
    name: string;
    shortCode: string;
    gtin: string | null;
    gtinStatus: Promption["gtinStatus"];
    companyCustomDomain: string | null;
    companyRequireValidGtin: boolean;
  } | null>(null);
  const [slugEditor, setSlugEditor] = useState<{ profileId: string; currentSlug: string } | null>(null);
  const [nameEditor, setNameEditor] = useState<{ profileId: string; currentName: string } | null>(null);
  const [gtinEditor, setGtinEditor] = useState<{ productId: string; productName: string } | null>(null);
  const [gtinDetails, setGtinDetails] = useState<Promption | null>(null);
  const [seoEditor, setSeoEditor] = useState<{ profileId: string; slug: string } | null>(null);
  const [versionHistory, setVersionHistory] = useState<{ profileId: string; slug: string } | null>(null);
  const [redirectEditor, setRedirectEditor] = useState<{
    profileId: string;
    productName: string;
    currentUrl: string | null;
    currentEnabled: boolean;
  } | null>(null);
  const [pinEditor, setPinEditor] = useState<{
    profileId: string;
    productName: string;
    currentEnabled: boolean;
    hasPinCode: boolean;
  } | null>(null);
  const [displayModeEditor, setDisplayModeEditor] = useState<{
    productId: string;
    productName: string;
    currentMode: DppDisplayMode;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = promptions.filter(
    (p) =>
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.shortCode.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    const newPaths = new Set(selectedIDs);
    if (newPaths.has(id)) newPaths.delete(id);
    else newPaths.add(id);
    setSelectedIDs(newPaths);
  };

  const handleCopyLink = useCallback(async (shortCode: string, id: string) => {
    const url = `${window.location.origin}/p/${shortCode}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleToggleSlug = useCallback(
    (p: Promption) => {
      setActiveMenu(null);
      startTransition(async () => {
        await onSetSlugVisible?.(p.productId, !p.slugVisible);
      });
    },
    [onSetSlugVisible]
  );

  const handlePublishToggle = useCallback(
    (p: Promption) => {
      startTransition(async () => {
        if (p.isPublished) {
          await onUnpublish?.(p.id);
        } else {
          await onPublish?.(p.id);
        }
      });
    },
    [onPublish, onUnpublish]
  );

  const handleDelete = useCallback(
    (id: string) => {
      setActiveMenu(null);
      startTransition(async () => {
        await onDelete(id);
      });
    },
    [onDelete]
  );

  return (
    <div className="w-full">
      {/* Table Header / Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
        {/* Search */}
        <div className="relative w-full sm:max-w-[280px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ds-text-muted)"
          />
          <input
            type="search"
            name="product-search"
            autoComplete="off"
            data-1p-ignore
            data-lpignore="true"
            className="w-full h-[38px] pl-9 pr-4 rounded-md border border-(--ds-border) bg-(--ds-surface) text-[13px] text-(--ds-text-primary) placeholder-(--ds-text-muted) focus:outline-hidden focus:border-[#93c5fd] transition-colors"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Actions Menu */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <div className="hidden xl:flex items-center justify-between w-[375px] h-9 gap-2 p-0 text-(--ds-text-muted) mr-4">
            <button className="w-9 h-9 flex items-center justify-center rounded-md hover:text-(--ds-text-primary) hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <LineChart size={18} strokeWidth={1.8} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-md hover:text-(--ds-text-primary) hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <AlignLeft size={18} strokeWidth={1.8} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-md hover:text-(--ds-text-primary) hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <CloudUpload size={18} strokeWidth={1.8} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-md hover:text-(--ds-text-primary) hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <Share size={18} strokeWidth={1.8} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-md hover:text-(--ds-text-primary) hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <ArrowUpDown size={18} strokeWidth={1.8} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-md hover:text-(--ds-text-primary) hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <SlidersHorizontal size={18} strokeWidth={1.8} />
            </button>
          </div>
          <Link
            href="/dashboard/new"
            className="w-full sm:w-auto h-[38px] px-4 bg-[#bae6fd] hover:bg-[#7dd3fc] text-black font-medium text-[13px] rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={16} strokeWidth={2} />
            Add New
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div>
        <div className="overflow-visible min-h-[480px]">
          <table className="w-full text-[13px] whitespace-normal sm:whitespace-nowrap block sm:table">
            <thead className="hidden sm:table-header-group">
              <tr className="border-b border-(--ds-border) text-[#64748B] font-medium">
                <th className="py-4 px-4 text-left w-[40px]">
                  <div className="w-4 h-4 rounded-[4px] border border-(--ds-border)"></div>
                </th>
                <th className="py-4 px-4 text-left">
                  <div className="flex items-center gap-2">
                    Name <span className="text-[10px]">↕</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-left">
                  <div className="flex items-center gap-2">
                    GTIN <span className="text-[10px]">↕</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-left">
                  <div className="flex items-center gap-2">
                    Link <span className="text-[10px]">↕</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-left">
                  <div className="flex items-center gap-2">
                    Status <span className="text-[10px]">↕</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-left">
                  <div className="flex items-center gap-2">
                    Last Modified <span className="text-[10px]">↕</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-left">
                  <div className="flex items-center gap-2">
                    Actions <span className="text-[10px]">↕</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="block sm:table-row-group gap-4 p-4 sm:p-0">
              {filtered.length === 0 ? (
                <tr className="block sm:table-row">
                  <td
                    colSpan={7}
                    className="py-12 text-center text-(--ds-text-muted) block sm:table-cell"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isChecked = selectedIDs.has(p.id);
                  // The shareable URL always uses the 8-char short code; the slug
                  // is only visible to end visitors when slugVisible is on.
                  const publicUrl = `/p/${p.shortCode}`;

                  return (
                    <tr
                      key={p.id}
                      className={`flex flex-col sm:table-row border border-(--ds-border) sm:border-0 sm:border-b mb-4 sm:mb-0 rounded-xl sm:rounded-none p-4 sm:p-0 bg-white sm:bg-transparent dark:bg-[#1e293b] sm:dark:bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors group relative ${
                        activeMenu === p.id ? "z-50" : "z-1"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto py-0 sm:py-3 px-0 sm:px-4 block sm:table-cell">
                        <button
                          onClick={() => toggleSelect(p.id)}
                          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-(--ds-accent) border-(--ds-accent) text-white"
                              : "border-(--ds-border) bg-transparent"
                          }`}
                        >
                          {isChecked && (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </button>
                      </td>

                      {/* Name */}
                      <td className="block sm:table-cell py-1 sm:py-3 px-0 sm:px-4 pr-10 sm:pr-4 mb-3 sm:mb-0">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/editor?profileId=${p.id}`}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity min-w-0"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#f1f5f9] dark:bg-[#0f172a] sm:dark:bg-[#1e293b] text-(--ds-text-secondary) flex items-center justify-center text-[11px] font-semibold tracking-wider shrink-0">
                              {p.productName.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span className="text-(--ds-text-primary) font-medium">
                                {p.productName}
                              </span>
                              {p.tagline && (
                                <p className="text-[11px] text-(--ds-text-muted) mt-0.5 max-w-[200px] truncate">
                                  {p.tagline}
                                </p>
                              )}
                            </div>
                          </Link>
                          {onRenameProduct && (
                            <button
                              onClick={() =>
                                setNameEditor({ profileId: p.id, currentName: p.productName })
                              }
                              className="w-5 h-5 flex items-center justify-center text-(--ds-text-secondary) hover:text-[#0284c7] transition-colors shrink-0"
                              title="Rename"
                              aria-label={`Rename ${p.productName}`}
                            >
                              <Pencil size={9} strokeWidth={2} />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* GTIN */}
                      <td className="block sm:table-cell py-1.5 sm:py-3 px-0 sm:px-4">
                        <div className="flex items-center gap-2">
                          <span className="sm:hidden font-medium text-[11px] text-(--ds-text-secondary) mr-1">GTIN:</span>
                          {p.gtin ? (
                            <>
                              {p.gtinStatus === "GS1_VERIFIED" && (
                                <button
                                  onClick={() => setGtinDetails(p)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium leading-none bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 hover:opacity-80 transition-opacity"
                                  title={`Confirmed by the GS1 GTIN Check API · ${p.gtin} · click to view details`}
                                >
                                  <BadgeCheck size={11} />
                                  GTIN Verified
                                </button>
                              )}
                              {p.gtinStatus === "VALID_FORMAT" && (
                                <button
                                  onClick={() => setGtinDetails(p)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium leading-none bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 hover:opacity-80 transition-opacity"
                                  title={`Passed local GS1 check-digit validation, not yet confirmed against the GS1 registry · ${p.gtin} · click to view details`}
                                >
                                  <CircleCheck size={11} />
                                  Valid Format
                                </button>
                              )}
                              {p.gtinStatus === "GS1_NOT_FOUND" && hasManufacturerOnlyMatch(p.gtinData) && (
                                <button
                                  onClick={() => setGtinDetails(p)}
                                  className="inline-flex flex-col items-start gap-1 hover:opacity-80 transition-opacity"
                                  title={`Manufacturer confirmed by GS1, but no registered product record for this exact GTIN · ${p.gtin} · click to view details`}
                                >
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium leading-none bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
                                    <BadgeCheck size={11} />
                                    Manufacturer
                                  </span>
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium leading-none bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
                                    <TriangleAlert size={11} />
                                    Product GTIN
                                  </span>
                                </button>
                              )}
                              {p.gtinStatus === "GS1_NOT_FOUND" && !hasManufacturerOnlyMatch(p.gtinData) && (
                                <button
                                  onClick={() => setGtinDetails(p)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium leading-none bg-transparent border border-[#e2e8f0] dark:border-[#334155] text-(--ds-text-secondary) hover:opacity-80 transition-opacity"
                                  title={`Valid GTIN format, but no confirmed active match in the GS1 registry · ${p.gtin} · click to view details`}
                                >
                                  <ScanBarcode size={11} />
                                  Not in Registry
                                </button>
                              )}
                            </>
                          ) : onUpdateProductGtin ? (
                            <button
                              onClick={() => setGtinEditor({ productId: p.productId, productName: p.productName })}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium leading-none border border-dashed border-[#cbd5e1] dark:border-[#475569] text-(--ds-text-secondary) hover:text-[#0284c7] hover:border-[#7dd3fc] transition-colors"
                              title="Add a GTIN to this product"
                            >
                              <ScanBarcode size={11} />
                              Add GTIN
                            </button>
                          ) : (
                            <span className="text-[12px] text-(--ds-text-muted)">—</span>
                          )}
                        </div>
                      </td>

                      {/* Public URL */}
                      <td className="block sm:table-cell py-1.5 sm:py-3 px-0 sm:px-4">
                        <div className="flex items-center gap-2">
                          <span className="sm:hidden font-medium text-[11px] text-(--ds-text-secondary) mr-1">URL:</span>
                          <span className="text-(--ds-text-secondary) max-w-55 truncate text-[13px] leading-tight">
                            {publicUrl}
                          </span>
                          <button
                            onClick={() => handleCopyLink(p.shortCode, p.id)}
                            className="w-6 h-6 flex items-center justify-center text-(--ds-text-muted) hover:text-[#0284c7] rounded transition-colors shrink-0"
                            title="Copy link"
                          >
                            {copiedId === p.id ? (
                              <Check size={12} className="text-emerald-500" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                          {p.isPublished && (
                            <a
                              href={publicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-6 h-6 flex items-center justify-center text-(--ds-text-muted) hover:text-[#0284c7] rounded transition-colors shrink-0"
                              title="Open public page"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="block sm:table-cell py-1.5 sm:py-3 px-0 sm:px-4">
                        <div className="flex items-center gap-2">
                          <span className="sm:hidden font-medium text-[11px] text-(--ds-text-secondary) mr-1">Status:</span>
                          {p.isPublished ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium leading-none bg-[#dcfce7] text-[#15803d]">
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium leading-none bg-transparent border border-[#e2e8f0] dark:border-[#334155] text-(--ds-text-primary)">
                              Draft
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Last Modified */}
                      <td className="block sm:table-cell py-1.5 sm:py-3 px-0 sm:px-4 text-(--ds-text-secondary)">
                        <div className="flex items-center gap-2 text-[12px] sm:text-[13px]">
                          <span className="sm:hidden font-medium text-[11px] mr-1">Updated:</span>
                          {formatDate(p.updatedAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="flex sm:table-cell justify-start sm:justify-start items-center gap-2 py-3 sm:py-3 px-0 sm:px-4 mt-3 sm:mt-0 border-t border-(--ds-border) sm:border-0 pt-3 sm:pt-3">
                        <div className="flex items-center gap-2">
                          {/* Sweep (Design) Button */}
                          <Link
                            href={`/editor?profileId=${p.id}`}
                            className="w-9 h-9 flex items-center justify-center text-[#0f172a] dark:text-white bg-white dark:bg-[#0f172a] sm:dark:bg-[#1e293b] rounded-[10px] border-[1.5px] border-[#e2e8f0] dark:border-[#334155] hover:border-[#bae6fd] hover:text-[#0284c7] hover:bg-[#f0f9ff] dark:hover:bg-[#334155] shadow-xs transition-all relative group"
                            title="Design / Sweep"
                          >
                            <Brush size={17} strokeWidth={2.5} />
                          </Link>

                          {/* QR Code */}
                          <button
                            onClick={() =>
                              setQrModal({
                                name: p.productName,
                                shortCode: p.shortCode,
                                gtin: p.gtin,
                                gtinStatus: p.gtinStatus,
                                companyCustomDomain: p.companyCustomDomain,
                                companyRequireValidGtin: p.companyRequireValidGtin,
                              })
                            }
                            className="w-9 h-9 flex items-center justify-center text-[#0f172a] dark:text-white bg-white dark:bg-[#0f172a] sm:dark:bg-[#1e293b] rounded-[10px] border-[1.5px] border-[#e2e8f0] dark:border-[#334155] hover:border-[#bae6fd] hover:text-[#0284c7] hover:bg-[#f0f9ff] dark:hover:bg-[#334155] shadow-xs transition-all"
                            title="View QR Code"
                          >
                            <QrCode size={17} strokeWidth={2.5} />
                          </button>

                          {/* Edit DPP */}
                          <Link
                            href={`/dashboard/products/${p.productId}/dpp`}
                            className="w-9 h-9 flex items-center justify-center text-[#0f172a] dark:text-white bg-white dark:bg-[#0f172a] sm:dark:bg-[#1e293b] rounded-[10px] border-[1.5px] border-[#e2e8f0] dark:border-[#334155] hover:border-[#bae6fd] hover:text-[#0284c7] hover:bg-[#f0f9ff] dark:hover:bg-[#334155] shadow-xs transition-all"
                            title={p.hasDpp ? "Edit DPP" : "Add DPP"}
                          >
                            <ShieldCheck size={17} strokeWidth={2.5} />
                          </Link>

                          {/* More menu */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveMenu(
                                  activeMenu === p.id ? null : p.id
                                )
                              }
                              className="w-9 h-9 flex items-center justify-center text-[#0f172a] dark:text-white bg-white dark:bg-[#0f172a] sm:dark:bg-[#1e293b] rounded-[10px] border-[1.5px] border-[#e2e8f0] dark:border-[#334155] hover:border-[#bae6fd] hover:text-[#0284c7] hover:bg-[#f0f9ff] dark:hover:bg-[#334155] shadow-xs transition-all"
                            >
                              <MoreVertical
                                size={17}
                                strokeWidth={2.5}
                              />
                            </button>

                            {/* Dropdown */}
                            {activeMenu === p.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-9998"
                                  onClick={() => setActiveMenu(null)}
                                />
                                <div className="absolute right-0 top-11 z-9999 w-[180px] rounded-xl bg-white dark:bg-[#1e293b] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-[#e2e8f0] dark:border-[#334155] py-1.5 animate-in fade-in slide-in-from-top-1">
                                  
                                  <Link
                                    href={`/dashboard/${p.id}`}
                                    className="w-full px-3 py-2 text-left text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] flex items-center gap-2 transition-colors text-(--ds-text-primary)"
                                  >
                                    <Pencil size={15} className="text-[#64748b]" />
                                    Edit Details
                                  </Link>

                                  {onRenameProduct && (
                                    <button
                                      onClick={() => {
                                        setActiveMenu(null);
                                        setNameEditor({ profileId: p.id, currentName: p.productName });
                                      }}
                                      className="w-full px-3 py-2 text-left text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] flex items-center gap-2 transition-colors text-(--ds-text-primary)"
                                    >
                                      <Type size={15} className="text-[#64748b]" />
                                      Rename
                                    </button>
                                  )}

                                  <a
                                    href={`/preview/${p.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full px-3 py-2 text-left text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] flex items-center gap-2 transition-colors text-(--ds-text-primary)"
                                  >
                                    <Eye size={15} className="text-[#64748b]" />
                                    Preview
                                  </a>

                                  <Link
                                    href={`/dashboard/products/${p.productId}/dpp`}
                                    onClick={() => setActiveMenu(null)}
                                    className="w-full px-3 py-2 text-left text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] flex items-center gap-2 transition-colors text-(--ds-text-primary)"
                                  >
                                    <ShieldCheck size={15} className="text-[#64748b]" />
                                    {p.hasDpp ? "Edit DPP" : "Add DPP"}
                                  </Link>

                                  {onUpdateDppDisplayMode && p.gtin && (
                                    <button
                                      onClick={() => {
                                        setActiveMenu(null);
                                        setDisplayModeEditor({
                                          productId: p.productId,
                                          productName: p.productName,
                                          currentMode: p.dppDisplayMode,
                                        });
                                      }}
                                      className="w-full px-3 py-2 text-left text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] flex items-start gap-2 transition-colors text-(--ds-text-primary)"
                                      title="Choose what the /01/{gtin} live link shows to visitors."
                                    >
                                      <Layers size={15} className="text-[#64748b] mt-0.5 shrink-0" />
                                      <span className="flex-1 min-w-0">
                                        <span className="block">Live page shows</span>
                                        <span className="block text-[11px] text-(--ds-text-muted) mt-0.5">
                                          {DPP_DISPLAY_MODE_LABEL[p.dppDisplayMode]}
                                        </span>
                                      </span>
                                    </button>
                                  )}

                                  <button
                                    onClick={() => {
                                      setActiveMenu(null);
                                      setSeoEditor({ profileId: p.id, slug: p.slug });
                                    }}
                                    className="w-full px-3 py-2 text-left text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] flex items-center gap-2 transition-colors text-(--ds-text-primary)"
                                  >
                                    <Globe size={15} className="text-[#64748b]" />
                                    SEO &amp; sharing
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveMenu(null);
                                      setVersionHistory({ profileId: p.id, slug: p.slug });
                                    }}
                                    className="w-full px-3 py-2 text-left text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] flex items-center gap-2 transition-colors text-(--ds-text-primary)"
                                  >
                                    <History size={15} className="text-[#64748b]" />
                                    Version history
                                  </button>

                                  <button
                                    onClick={() => handlePublishToggle(p)}
                                    disabled={isPending}
                                    className="w-full px-3 py-2 text-left text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] flex items-center gap-2 transition-colors text-(--ds-text-primary)"
                                  >
                                    <Rocket size={15} className="text-[#64748b]" />
                                    {p.isPublished ? "Unpublish" : "Publish"}
                                  </button>

                                  {onRenameSlug && (
                                    <button
                                      onClick={() => {
                                        setActiveMenu(null);
                                        setSlugEditor({ profileId: p.id, currentSlug: p.slug });
                                      }}
                                      className="w-full px-3 py-2 text-left text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] flex items-center gap-2 transition-colors text-(--ds-text-primary)"
                                    >
                                      <Hash size={15} className="text-[#64748b]" />
                                      Edit slug
                                    </button>
                                  )}

                                  {onUpdateRedirect && (
                                    <button
                                      onClick={() => {
                                        setActiveMenu(null);
                                        setRedirectEditor({
                                          profileId: p.id,
                                          productName: p.productName,
                                          currentUrl: p.redirectUrl,
                                          currentEnabled: p.redirectEnabled,
                                        });
                                      }}
                                      className="w-full px-3 py-2 text-left text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] flex items-center justify-between gap-2 transition-colors text-(--ds-text-primary)"
                                      title="When on, scans redirect to this URL instead of showing the showcase page."
                                    >
                                      <span className="flex items-center gap-2">
                                        <CornerUpRight size={15} className="text-[#64748b]" />
                                        Redirect link
                                      </span>
                                      {p.redirectEnabled && p.redirectUrl && (
                                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                      )}
                                    </button>
                                  )}

                                  {onUpdatePinLock && (
                                    <button
                                      onClick={() => {
                                        setActiveMenu(null);
                                        setPinEditor({
                                          profileId: p.id,
                                          productName: p.productName,
                                          currentEnabled: p.pinEnabled,
                                          hasPinCode: p.hasPinCode,
                                        });
                                      }}
                                      className="w-full px-3 py-2 text-left text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] flex items-center justify-between gap-2 transition-colors text-(--ds-text-primary)"
                                      title="Require a PIN before visitors can view this page."
                                    >
                                      <span className="flex items-center gap-2">
                                        <Lock size={15} className="text-[#64748b]" />
                                        PIN lock
                                      </span>
                                      {p.pinEnabled && (
                                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                      )}
                                    </button>
                                  )}

                                  {onSetSlugVisible && (
                                    <button
                                      onClick={() => handleToggleSlug(p)}
                                      disabled={isPending}
                                      className="w-full px-3 py-2 text-left text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] flex items-center justify-between gap-2 transition-colors text-(--ds-text-primary)"
                                      title="When on, visitors are redirected to /p/<slug>. When off, the share URL stays as /p/<shortCode>."
                                    >
                                      <span className="flex items-center gap-2">
                                        <Link2 size={15} className="text-[#64748b]" />
                                        Show slug in URL
                                      </span>
                                      <span
                                        className={`inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                                          p.slugVisible ? "bg-(--ds-accent)" : "bg-[#cbd5e1] dark:bg-[#475569]"
                                        }`}
                                      >
                                        <span
                                          className={`inline-block h-3 w-3 rounded-full bg-white transition-transform ${
                                            p.slugVisible ? "translate-x-3.5" : "translate-x-0.5"
                                          }`}
                                        />
                                      </span>
                                    </button>
                                  )}

                                  <div className="h-px bg-[#e2e8f0] dark:bg-[#334155] my-1" />
                                  <button
                                    onClick={() => handleDelete(p.id)}
                                    className="w-full px-3 py-2 text-left text-[13px] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors"
                                  >
                                    <Trash2 size={15} />
                                    Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal */}
      {qrModal && (
        <QrModal
          isOpen={!!qrModal}
          onClose={() => setQrModal(null)}
          productName={qrModal.name}
          shortCode={qrModal.shortCode}
          gtin={qrModal.gtin}
          gtinStatus={qrModal.gtinStatus}
          companyCustomDomain={qrModal.companyCustomDomain}
          requireValidGtin={qrModal.companyRequireValidGtin}
        />
      )}

      {/* Product Name Edit Modal */}
      {nameEditor && onRenameProduct && (
        <ProductNameEditModal
          profileId={nameEditor.profileId}
          currentName={nameEditor.currentName}
          onClose={() => setNameEditor(null)}
          onSave={onRenameProduct}
        />
      )}

      {/* Product GTIN Add Modal */}
      {gtinEditor && onUpdateProductGtin && (
        <ProductGtinEditModal
          productId={gtinEditor.productId}
          productName={gtinEditor.productName}
          onClose={() => setGtinEditor(null)}
          onSave={onUpdateProductGtin}
        />
      )}

      {/* GTIN Details Modal (read-only, with an optional re-check action) */}
      {gtinDetails && (
        <GtinDetailsModal
          promption={gtinDetails}
          onClose={() => setGtinDetails(null)}
          onRefresh={onRefreshGtinVerification}
        />
      )}

      {/* SEO Settings Modal */}
      {seoEditor && (
        <SeoSettingsModal
          profileId={seoEditor.profileId}
          slug={seoEditor.slug}
          onClose={() => setSeoEditor(null)}
        />
      )}

      {/* Version History Modal */}
      {versionHistory && (
        <VersionHistoryModal
          profileId={versionHistory.profileId}
          slug={versionHistory.slug}
          onClose={() => setVersionHistory(null)}
        />
      )}

      {/* Slug Edit Modal */}
      {slugEditor && onRenameSlug && (
        <SlugEditModal
          profileId={slugEditor.profileId}
          currentSlug={slugEditor.currentSlug}
          onClose={() => setSlugEditor(null)}
          onSave={onRenameSlug}
        />
      )}

      {/* Redirect Edit Modal */}
      {redirectEditor && onUpdateRedirect && (
        <RedirectEditModal
          profileId={redirectEditor.profileId}
          productName={redirectEditor.productName}
          currentUrl={redirectEditor.currentUrl}
          currentEnabled={redirectEditor.currentEnabled}
          onClose={() => setRedirectEditor(null)}
          onSave={onUpdateRedirect}
        />
      )}

      {/* PIN Lock Modal */}
      {pinEditor && onUpdatePinLock && (
        <PinLockModal
          profileId={pinEditor.profileId}
          productName={pinEditor.productName}
          currentEnabled={pinEditor.currentEnabled}
          hasPinCode={pinEditor.hasPinCode}
          onClose={() => setPinEditor(null)}
          onSave={onUpdatePinLock}
          onReveal={onRevealPin}
        />
      )}

      {/* DPP Display Mode Modal */}
      {displayModeEditor && onUpdateDppDisplayMode && (
        <DppDisplayModeModal
          productId={displayModeEditor.productId}
          productName={displayModeEditor.productName}
          currentMode={displayModeEditor.currentMode}
          onClose={() => setDisplayModeEditor(null)}
          onSave={onUpdateDppDisplayMode}
        />
      )}
    </div>
  );
}

interface ProductNameEditModalProps {
  profileId: string;
  currentName: string;
  onClose: () => void;
  onSave: (
    profileId: string,
    productName: string,
  ) => Promise<{ success?: boolean; error?: string; productName?: string }>;
}

function ProductNameEditModal({ profileId, currentName, onClose, onSave }: ProductNameEditModalProps) {
  const [value, setValue] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const trimmed = value.trim();
  const dirty = trimmed.length > 0 && trimmed !== currentName;

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    const result = await onSave(profileId, value);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="relative w-full max-w-[440px] rounded-2xl bg-white dark:bg-[#1e293b] shadow-2xl border border-[#e2e8f0] dark:border-[#334155] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div>
              <h3 className="text-lg font-bold text-[#0f172a] dark:text-white">Rename product</h3>
              <p className="text-[13px] text-[#64748b] dark:text-[#94a3b8] mt-0.5">
                Shown on the dashboard and your public showcase page.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="px-6 py-4">
            <label className="block text-[12px] font-medium text-[#64748b] dark:text-[#94a3b8] mb-1.5">
              Product name
            </label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && dirty && !saving) handleSave();
              }}
              placeholder="My amazing product"
              autoFocus
              maxLength={120}
              className="w-full h-[42px] px-3 rounded-lg border border-[#e2e8f0] dark:border-[#334155] bg-transparent text-[13px] text-[#0f172a] dark:text-white placeholder-[#94a3b8] outline-hidden focus:border-[#93c5fd]"
            />
            <p className="mt-1.5 text-[11px] text-[#94a3b8]">1–120 characters.</p>
            {error && (
              <p className="mt-2 text-[12px] text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-[42px] rounded-xl border border-[#e2e8f0] dark:border-[#334155] text-[#0f172a] dark:text-white font-semibold text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="flex-1 h-[42px] rounded-xl bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] font-semibold text-[13px] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

type GtinCheckState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "invalid"; message: string }
  | { status: "valid_format" }
  | { status: "gs1_not_found"; data?: Record<string, unknown> }
  | { status: "gs1_verified"; data?: Record<string, unknown> };

const GTIN_POLICY_OK: GtinCheckState["status"][] = ["valid_format", "gs1_not_found", "gs1_verified"];

interface ProductGtinEditModalProps {
  productId: string;
  productName: string;
  onClose: () => void;
  onSave: (
    productId: string,
    gtin: string,
  ) => Promise<{ success?: boolean; error?: string; gtin?: string; gtinStatus?: Promption["gtinStatus"] }>;
}

// Adds a GTIN to a product that doesn't have one yet - mirrors the live-validation
// UX from the Add-Product page (apps/web/src/app/(dashboard)/dashboard/new/page.tsx).
// Only supports the null -> set transition; an already-set GTIN isn't editable here.
function ProductGtinEditModal({ productId, productName, onClose, onSave }: ProductGtinEditModalProps) {
  const [value, setValue] = useState("");
  const [check, setCheck] = useState<GtinCheckState>({ status: "idle" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleBlur = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setCheck({ status: "idle" });
      return;
    }
    setCheck({ status: "checking" });
    const res = await verifyGtinAction(trimmed);
    if (!("status" in res)) {
      setCheck({ status: "invalid", message: res.error ?? "Could not check this GTIN" });
      return;
    }
    if (res.status === "INVALID_FORMAT") {
      setCheck({ status: "invalid", message: res.error ?? "Invalid GTIN" });
    } else if (res.status === "GS1_VERIFIED") {
      setCheck({ status: "gs1_verified", data: res.data });
    } else if (res.status === "GS1_NOT_FOUND") {
      setCheck({ status: "gs1_not_found", data: res.data });
    } else {
      setCheck({ status: "valid_format" });
    }
  };

  const dirty = value.trim().length > 0;
  const canSave = dirty && check.status !== "checking" && GTIN_POLICY_OK.includes(check.status);

  const handleSave = async () => {
    if (!canSave) return;
    setError(null);
    setSaving(true);
    const result = await onSave(productId, value.trim());
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="relative w-full max-w-[440px] rounded-2xl bg-white dark:bg-[#1e293b] shadow-2xl border border-[#e2e8f0] dark:border-[#334155] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div>
              <h3 className="text-lg font-bold text-[#0f172a] dark:text-white">Add GTIN</h3>
              <p className="text-[13px] text-[#64748b] dark:text-[#94a3b8] mt-0.5">{productName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="px-6 py-4">
            <label className="block text-[12px] font-medium text-[#64748b] dark:text-[#94a3b8] mb-1.5">
              GTIN (Barcode Number)
            </label>
            <div className="relative">
              <ScanBarcode
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
              />
              <input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setCheck({ status: "idle" });
                }}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSave && !saving) handleSave();
                }}
                placeholder="e.g. 00614141123452"
                autoFocus
                inputMode="numeric"
                className="w-full h-[42px] pl-9 pr-3 rounded-lg border border-[#e2e8f0] dark:border-[#334155] bg-transparent text-[13px] text-[#0f172a] dark:text-white placeholder-[#94a3b8] outline-hidden focus:border-[#93c5fd]"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-[#94a3b8]">
              8, 12, 13 or 14-digit GS1 barcode number. Can only be set once — it can&apos;t be
              changed after saving.
            </p>

            {check.status === "checking" && (
              <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#94a3b8]">
                <Loader2 size={13} className="animate-spin" /> Checking…
              </div>
            )}
            {check.status === "invalid" && (
              <div className="mt-2 flex items-start gap-1.5 text-[12px] text-red-600 dark:text-red-400">
                <CircleAlert size={13} className="mt-0.5 shrink-0" />
                {check.message}
              </div>
            )}
            {check.status === "valid_format" && (
              <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#64748b] dark:text-[#94a3b8]">
                <CircleCheck size={13} className="text-sky-500" /> Valid GTIN format
              </div>
            )}
            {check.status === "gs1_not_found" && (
              <div className="mt-2 space-y-2">
                {hasManufacturerOnlyMatch(check.data) ? (
                  <div className="flex items-center gap-1.5 text-[12px] text-amber-700 dark:text-amber-400">
                    <CircleAlert size={13} />
                    {gtinNotFoundLabel(check.data)}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[12px] text-[#64748b] dark:text-[#94a3b8]">
                    <CircleCheck size={13} className="text-sky-500" />
                    Valid GTIN format (no confirmed active match in the GS1 registry)
                  </div>
                )}
                <GtinDetailEntriesList data={check.data} />
              </div>
            )}
            {check.status === "gs1_verified" && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <BadgeCheck size={14} /> GTIN Verified
                </div>
                <GtinDetailEntriesList data={check.data} />
              </div>
            )}
            {error && (
              <p className="mt-2 text-[12px] text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-[42px] rounded-xl border border-[#e2e8f0] dark:border-[#334155] text-[#0f172a] dark:text-white font-semibold text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !canSave}
              className="flex-1 h-[42px] rounded-xl bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] font-semibold text-[13px] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

const GTIN_STATUS_LABEL: Partial<Record<Promption["gtinStatus"], string>> = {
  GS1_VERIFIED: "GTIN Verified",
  VALID_FORMAT: "Valid GTIN format (not yet confirmed by GS1)",
  GS1_NOT_FOUND: "Valid GTIN format (no confirmed active match in the GS1 registry)",
  INVALID_FORMAT: "Invalid format",
  UNVERIFIED: "Not checked",
};

/** True when GS1 found a real, licensed company (GCP) owner for this GTIN but has
 * no full product-level record for the exact GTIN (CertaintyValue 2 - see
 * apps/web/src/lib/gs1/client.ts). Distinguishes "manufacturer is real, product
 * just isn't registered" from a genuine dead-end (CertaintyValue 0/1). */
function hasManufacturerOnlyMatch(data?: Record<string, unknown> | null): boolean {
  return Boolean(data?.GCPOwner);
}

function gtinNotFoundLabel(data?: Record<string, unknown> | null): string {
  return hasManufacturerOnlyMatch(data)
    ? "Manufacturer verified with GS1 — this specific product isn't registered in GS1's product database yet."
    : GTIN_STATUS_LABEL.GS1_NOT_FOUND!;
}

/**
 * Renders availableGtinDetailEntries() output as a bordered key/value list -
 * shared between GtinDetailsModal and ProductGtinEditModal so both surfaces
 * render whatever the GS1 API returned identically. Renders nothing if empty
 * (callers decide what, if anything, to show in that case).
 */
function GtinDetailEntriesList({ data }: { data?: Record<string, unknown> | null }) {
  const entries = availableGtinDetailEntries(data);
  if (entries.length === 0) return null;

  return (
    <div className="rounded-lg border border-[#e2e8f0] dark:border-[#334155] divide-y divide-[#e2e8f0] dark:divide-[#334155]">
      {entries.map(([label, value]) => (
        <div key={label} className="px-3.5 py-2.5 flex items-start justify-between gap-3">
          <span className="text-[12px] text-[#64748b] dark:text-[#94a3b8] shrink-0">{label}</span>
          {label === "Product Image Url" && /^https?:\/\//i.test(value) ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt=""
                className="h-10 w-10 rounded object-cover border border-[#e2e8f0] dark:border-[#334155]"
              />
            </a>
          ) : (
            <span className="text-[13px] text-[#0f172a] dark:text-white text-right break-words">{value}</span>
          )}
        </div>
      ))}
    </div>
  );
}

interface GtinDetailsModalProps {
  promption: Promption;
  onClose: () => void;
  onRefresh?: (
    productId: string,
  ) => Promise<{
    success?: boolean;
    error?: string;
    gtinStatus?: Promption["gtinStatus"];
    gtinData?: Record<string, unknown> | null;
  }>;
}

// Read-only view of a product's GTIN status + whatever the external GS1 API
// returned at verification time. Only ever shows fields that actually have a
// value - never renders an empty/null row. Optionally offers a "Re-check with
// GS1" action - the stored status/data is a point-in-time snapshot, so it can
// go stale (the GS1 registry's own data changes over time, and anything
// checked while this integration was still being finished only ever got
// "Valid GTIN format" regardless of what GS1 actually had on file).
function GtinDetailsModal({ promption, onClose, onRefresh }: GtinDetailsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState(promption);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  const hasEntries = availableGtinDetailEntries(current.gtinData).length > 0;

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    setRefreshError(null);
    const res = await onRefresh(current.productId);
    setRefreshing(false);
    if (res.error) {
      setRefreshError(res.error);
      return;
    }
    if (res.gtinStatus) {
      setCurrent((prev) => ({
        ...prev,
        gtinStatus: res.gtinStatus!,
        gtinData: res.gtinData ?? null,
        gtinVerifiedAt: new Date().toISOString(),
      }));
    }
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="relative w-full max-w-[440px] rounded-2xl bg-white dark:bg-[#1e293b] shadow-2xl border border-[#e2e8f0] dark:border-[#334155] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div>
              <h3 className="text-lg font-bold text-[#0f172a] dark:text-white">GTIN details</h3>
              <p className="text-[13px] text-[#64748b] dark:text-[#94a3b8] mt-0.5">{current.productName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
            <div className="rounded-lg border border-[#e2e8f0] dark:border-[#334155] divide-y divide-[#e2e8f0] dark:divide-[#334155]">
              <div className="px-3.5 py-2.5 flex items-center justify-between gap-3">
                <span className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">GTIN</span>
                <span className="text-[13px] font-mono text-[#0f172a] dark:text-white">{current.gtin}</span>
              </div>
              <div className="px-3.5 py-2.5 flex items-center justify-between gap-3">
                <span className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">Status</span>
                <span className="text-[13px] text-[#0f172a] dark:text-white text-right">
                  {current.gtinStatus === "GS1_NOT_FOUND"
                    ? gtinNotFoundLabel(current.gtinData)
                    : (GTIN_STATUS_LABEL[current.gtinStatus] ?? current.gtinStatus)}
                </span>
              </div>
              {current.gtinVerifiedAt && (
                <div className="px-3.5 py-2.5 flex items-center justify-between gap-3">
                  <span className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">Checked</span>
                  <span className="text-[13px] text-[#0f172a] dark:text-white">
                    {formatDate(current.gtinVerifiedAt)}
                  </span>
                </div>
              )}
            </div>

            {hasEntries ? (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8] mb-1.5">
                  From the GS1 registry
                </p>
                <GtinDetailEntriesList data={current.gtinData} />
              </div>
            ) : (
              <p className="text-[12px] text-[#94a3b8]">
                {current.gtinStatus === "GS1_VERIFIED"
                  ? "GS1 confirmed this GTIN but returned no additional details."
                  : "No additional details available from GS1 for this GTIN yet."}
              </p>
            )}

            {onRefresh && (
              <div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="w-full h-9 rounded-lg border border-[#e2e8f0] dark:border-[#334155] text-[12px] font-medium text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f8fafc] dark:hover:bg-[#334155] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {refreshing ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <RefreshCw size={13} />
                  )}
                  {refreshing ? "Checking…" : "Re-check with GS1"}
                </button>
                {refreshError && (
                  <p className="mt-1.5 text-[12px] text-red-600 dark:text-red-400">{refreshError}</p>
                )}
              </div>
            )}
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full h-[42px] rounded-xl bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] font-semibold text-[13px] hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

interface SlugEditModalProps {
  profileId: string;
  currentSlug: string;
  onClose: () => void;
  onSave: (profileId: string, slug: string) => Promise<{ success?: boolean; error?: string; slug?: string }>;
}

function SlugEditModal({ profileId, currentSlug, onClose, onSave }: SlugEditModalProps) {
  const [value, setValue] = useState(currentSlug);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => setMounted(true), []);

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    const result = await onSave(profileId, value);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onClose();
  };

  if (!mounted) return null;

  // Render via portal so the modal escapes any parent stacking contexts
  // (transforms / filters / overflow clips on the table or layout).
  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="relative w-full max-w-[440px] rounded-2xl bg-white dark:bg-[#1e293b] shadow-2xl border border-[#e2e8f0] dark:border-[#334155] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div>
              <h3 className="text-lg font-bold text-[#0f172a] dark:text-white">Edit slug</h3>
              <p className="text-[13px] text-[#64748b] dark:text-[#94a3b8] mt-0.5">
                Visitors see this in the address bar when Show slug in URL is on.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="px-6 py-4">
            <label className="block text-[12px] font-medium text-[#64748b] dark:text-[#94a3b8] mb-1.5">
              Slug
            </label>
            <div className="flex items-stretch rounded-lg border border-[#e2e8f0] dark:border-[#334155] overflow-hidden focus-within:border-[#93c5fd]">
              <span className="px-3 flex items-center text-[12px] font-mono text-[#94a3b8] bg-[#f8fafc] dark:bg-[#0f172a] border-r border-[#e2e8f0] dark:border-[#334155]">
                {origin}/p/
              </span>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="my-product"
                autoFocus
                className="flex-1 px-3 py-2.5 text-[13px] text-[#0f172a] dark:text-white bg-transparent outline-hidden"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-[#94a3b8]">
              Lowercase letters, numbers, hyphens. 1–64 chars.
            </p>
            {error && (
              <p className="mt-2 text-[12px] text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-[42px] rounded-xl border border-[#e2e8f0] dark:border-[#334155] text-[#0f172a] dark:text-white font-semibold text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || value.trim() === currentSlug || !value.trim()}
              className="flex-1 h-[42px] rounded-xl bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] font-semibold text-[13px] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

interface RedirectEditModalProps {
  profileId: string;
  productName: string;
  currentUrl: string | null;
  currentEnabled: boolean;
  onClose: () => void;
  onSave: (
    profileId: string,
    redirectUrl: string | null,
    redirectEnabled: boolean,
  ) => Promise<{ success?: boolean; error?: string; redirectUrl?: string | null; redirectEnabled?: boolean }>;
}

function RedirectEditModal({
  profileId,
  productName,
  currentUrl,
  currentEnabled,
  onClose,
  onSave,
}: RedirectEditModalProps) {
  const [url, setUrl] = useState(currentUrl ?? "");
  const [enabled, setEnabled] = useState(currentEnabled);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dirty = url.trim() !== (currentUrl ?? "") || enabled !== currentEnabled;

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    const trimmed = url.trim();
    const result = await onSave(profileId, trimmed ? trimmed : null, enabled);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="relative w-full max-w-[460px] rounded-2xl bg-white dark:bg-[#1e293b] shadow-2xl border border-[#e2e8f0] dark:border-[#334155] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div>
              <h3 className="text-lg font-bold text-[#0f172a] dark:text-white">Redirect link</h3>
              <p className="text-[13px] text-[#64748b] dark:text-[#94a3b8] mt-0.5">
                Send visitors of <span className="font-medium text-(--ds-text-primary)">{productName}</span> straight to another URL when they scan.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#64748b] dark:text-[#94a3b8] mb-1.5">
                Destination URL
              </label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/promo"
                autoFocus
                inputMode="url"
                className="w-full h-[42px] px-3 rounded-lg border border-[#e2e8f0] dark:border-[#334155] bg-transparent text-[13px] text-[#0f172a] dark:text-white placeholder-[#94a3b8] outline-hidden focus:border-[#93c5fd]"
              />
              <p className="mt-1.5 text-[11px] text-[#94a3b8]">
                Leave blank to remove the redirect. http:// or https:// - we&apos;ll add https if you skip it.
              </p>
            </div>

            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="flex flex-col">
                <span className="text-[13px] font-medium text-(--ds-text-primary)">Enable redirect</span>
                <span className="text-[11px] text-[#94a3b8]">When on, scans skip the showcase page.</span>
              </span>
              <button
                type="button"
                onClick={() => setEnabled((v) => !v)}
                className={`inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  enabled ? "bg-(--ds-accent)" : "bg-[#cbd5e1] dark:bg-[#475569]"
                }`}
                aria-pressed={enabled}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    enabled ? "translate-x-4.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>

            {error && (
              <p className="text-[12px] text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-[42px] rounded-xl border border-[#e2e8f0] dark:border-[#334155] text-[#0f172a] dark:text-white font-semibold text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="flex-1 h-[42px] rounded-xl bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] font-semibold text-[13px] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

interface PinLockModalProps {
  profileId: string;
  productName: string;
  currentEnabled: boolean;
  hasPinCode: boolean;
  onClose: () => void;
  onSave: (
    profileId: string,
    pin: string | null,
    pinEnabled: boolean,
  ) => Promise<{ success?: boolean; error?: string; pinEnabled?: boolean; hasPin?: boolean }>;
  onReveal?: (
    profileId: string,
    password: string,
  ) => Promise<{ success?: boolean; error?: string; pinCode?: string }>;
}

function PinLockModal({ profileId, productName, currentEnabled, hasPinCode, onClose, onSave, onReveal }: PinLockModalProps) {
  // A PIN already exists whenever the lock is currently on, or we have a stored
  // viewable code. Leaving the field blank then keeps that existing PIN.
  const hasExistingPin = currentEnabled || hasPinCode;
  const [pin, setPin] = useState("");
  const [enabled, setEnabled] = useState(currentEnabled);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reveal-with-password flow. The plaintext PIN never ships with the page; we
  // fetch it only after the owner confirms their account password.
  const [revealOpen, setRevealOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [revealedPin, setRevealedPin] = useState<string | null>(null);
  const [revealError, setRevealError] = useState<string | null>(null);
  const [revealing, setRevealing] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleReveal = async () => {
    if (!onReveal || !password) return;
    setRevealError(null);
    setRevealing(true);
    const result = await onReveal(profileId, password);
    setRevealing(false);
    if (result.error || !result.pinCode) {
      setRevealError(result.error ?? "Could not retrieve the PIN.");
      return;
    }
    setRevealedPin(result.pinCode);
    setRevealOpen(false);
    setPassword("");
  };

  const handleHidePin = () => {
    setRevealedPin(null);
    setRevealError(null);
    setPassword("");
    setRevealOpen(false);
  };

  const handleCopyPin = async () => {
    if (!revealedPin) return;
    try {
      await navigator.clipboard.writeText(revealedPin);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  const pinDigits = pin.replace(/\D/g, "");
  const validNewPin = pinDigits.length === 6;
  // Turning the lock on for the first time needs a PIN; otherwise the field is optional.
  const needsPin = enabled && !hasExistingPin;
  const dirty = enabled !== currentEnabled || pinDigits.length > 0;
  const canSave = dirty && (!needsPin || validNewPin) && (pinDigits.length === 0 || validNewPin);

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    // Send the new PIN only when the user typed one; null keeps the existing.
    const result = await onSave(profileId, pinDigits.length > 0 ? pinDigits : null, enabled);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="relative w-full max-w-[460px] rounded-2xl bg-white dark:bg-[#1e293b] shadow-2xl border border-[#e2e8f0] dark:border-[#334155] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div>
              <h3 className="text-lg font-bold text-[#0f172a] dark:text-white">PIN lock</h3>
              <p className="text-[13px] text-[#64748b] dark:text-[#94a3b8] mt-0.5">
                Require a PIN before visitors of{" "}
                <span className="font-medium text-(--ds-text-primary)">{productName}</span> can view the page.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="px-6 py-4 space-y-4">
            {hasPinCode && onReveal && (
              <div>
                <label className="block text-[12px] font-medium text-[#64748b] dark:text-[#94a3b8] mb-1.5">
                  Current PIN
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-[42px] px-3 rounded-lg border border-[#e2e8f0] dark:border-[#334155] bg-[#f8fafc] dark:bg-[#0f172a]/40 flex items-center text-[15px] tracking-[0.3em] font-mono text-[#0f172a] dark:text-white">
                    {revealedPin ?? "••••••"}
                  </div>
                  {revealedPin ? (
                    <>
                      <button
                        type="button"
                        onClick={handleHidePin}
                        className="w-[42px] h-[42px] shrink-0 rounded-lg border border-[#e2e8f0] dark:border-[#334155] flex items-center justify-center text-[#64748b] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
                        title="Hide PIN"
                        aria-label="Hide PIN"
                      >
                        <EyeOff size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyPin}
                        className="w-[42px] h-[42px] shrink-0 rounded-lg border border-[#e2e8f0] dark:border-[#334155] flex items-center justify-center text-[#64748b] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
                        title="Copy PIN"
                        aria-label="Copy PIN"
                      >
                        {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setRevealOpen((v) => !v); setRevealError(null); }}
                      className="h-[42px] shrink-0 px-3 rounded-lg border border-[#e2e8f0] dark:border-[#334155] flex items-center gap-1.5 text-[13px] font-medium text-[#64748b] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
                    >
                      <Eye size={15} />
                      Show
                    </button>
                  )}
                </div>
                {revealOpen && !revealedPin && (
                  <div className="mt-2 rounded-lg border border-[#e2e8f0] dark:border-[#334155] bg-[#f8fafc] dark:bg-[#0f172a]/40 p-3 space-y-2">
                    <p className="text-[11px] text-[#64748b] dark:text-[#94a3b8]">
                      Enter your account password to view this PIN.
                    </p>
                    <div className="flex items-center gap-2">
                      {/* Decoy username field: gives the browser/password-manager a
                          credential target so it doesn't autofill the email into the
                          product search box (which lives on the same page). */}
                      <input
                        type="text"
                        name="username"
                        autoComplete="username"
                        tabIndex={-1}
                        aria-hidden="true"
                        className="absolute h-0 w-0 overflow-hidden border-0 p-0 opacity-0"
                      />
                      <input
                        type="password"
                        name="account-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && password && !revealing) handleReveal();
                        }}
                        placeholder="Account password"
                        autoFocus
                        autoComplete="current-password"
                        className="flex-1 h-[38px] px-3 rounded-lg border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-transparent text-[14px] text-[#0f172a] dark:text-white placeholder-[#94a3b8] outline-hidden focus:border-[#93c5fd]"
                      />
                      <button
                        type="button"
                        onClick={handleReveal}
                        disabled={!password || revealing}
                        className="h-[38px] shrink-0 px-4 rounded-lg bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] font-semibold text-[13px] hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {revealing ? "…" : "Unlock"}
                      </button>
                    </div>
                    {revealError && (
                      <p className="text-[12px] text-red-600 dark:text-red-400">{revealError}</p>
                    )}
                  </div>
                )}
              </div>
            )}
            <div>
              <label className="block text-[12px] font-medium text-[#64748b] dark:text-[#94a3b8] mb-1.5">
                {hasExistingPin ? "New PIN (leave blank to keep current)" : "PIN"}
              </label>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSave && !saving) handleSave();
                }}
                placeholder="6 digits"
                autoFocus
                inputMode="numeric"
                autoComplete="off"
                className="w-full h-[42px] px-3 rounded-lg border border-[#e2e8f0] dark:border-[#334155] bg-transparent text-[15px] tracking-[0.3em] font-mono text-[#0f172a] dark:text-white placeholder-[#94a3b8] placeholder:tracking-normal placeholder:font-sans placeholder:text-[13px] outline-hidden focus:border-[#93c5fd]"
              />
              <p className="mt-1.5 text-[11px] text-[#94a3b8]">
                Numbers only, 6 digits. Share it with people allowed to view the page.
              </p>
            </div>

            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="flex flex-col">
                <span className="text-[13px] font-medium text-(--ds-text-primary)">Lock this page</span>
                <span className="text-[11px] text-[#94a3b8]">When on, visitors must enter the PIN first.</span>
              </span>
              <button
                type="button"
                onClick={() => setEnabled((v) => !v)}
                className={`inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  enabled ? "bg-(--ds-accent)" : "bg-[#cbd5e1] dark:bg-[#475569]"
                }`}
                aria-pressed={enabled}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    enabled ? "translate-x-4.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>

            {needsPin && (
              <p className="text-[12px] text-[#94a3b8]">Set a PIN above to turn the lock on.</p>
            )}
            {error && (
              <p className="text-[12px] text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-[42px] rounded-xl border border-[#e2e8f0] dark:border-[#334155] text-[#0f172a] dark:text-white font-semibold text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !canSave}
              className="flex-1 h-[42px] rounded-xl bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] font-semibold text-[13px] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

interface DppDisplayModeModalProps {
  productId: string;
  productName: string;
  currentMode: DppDisplayMode;
  onClose: () => void;
  onSave: (
    productId: string,
    mode: DppDisplayMode,
    previousMode: DppDisplayMode,
  ) => Promise<{ success?: boolean; error?: string }>;
}

const DPP_DISPLAY_MODE_OPTIONS: { mode: DppDisplayMode; label: string; description: string; icon: typeof ScanBarcode }[] = [
  { mode: "GS1", label: "GS1 only", description: "Visitors always see the marketing showcase.", icon: ScanBarcode },
  { mode: "DPP", label: "DPP only", description: "Visitors always see the compliance passport.", icon: ShieldCheck },
  { mode: "BOTH", label: "GS1 + DPP toggle", description: "Visitors can switch between both.", icon: Layers },
];

// Lets a merchant choose what the /01/{gtin} live link shows - opened from
// the row menu's "Live page shows" item instead of applying inline, so the
// change gets a visible confirmation (Save) rather than a silent click.
function DppDisplayModeModal({ productId, productName, currentMode, onClose, onSave }: DppDisplayModeModalProps) {
  const [mode, setMode] = useState<DppDisplayMode>(currentMode);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dirty = mode !== currentMode;

  const handleSave = async () => {
    if (!dirty) {
      onClose();
      return;
    }
    setError(null);
    setSaving(true);
    const result = await onSave(productId, mode, currentMode);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="relative w-full max-w-[460px] rounded-2xl bg-white dark:bg-[#1e293b] shadow-2xl border border-[#e2e8f0] dark:border-[#334155] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div>
              <h3 className="text-lg font-bold text-[#0f172a] dark:text-white">Live page shows</h3>
              <p className="text-[13px] text-[#64748b] dark:text-[#94a3b8] mt-0.5">
                What visitors of <span className="font-medium text-(--ds-text-primary)">{productName}</span> see when they scan its GS1 link.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="px-6 py-4 space-y-2">
            {DPP_DISPLAY_MODE_OPTIONS.map(({ mode: optionMode, label, description, icon: Icon }) => {
              const isSelected = mode === optionMode;
              return (
                <button
                  key={optionMode}
                  type="button"
                  onClick={() => setMode(optionMode)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-colors ${
                    isSelected
                      ? "border-[#0284c7] bg-[#f0f9ff] dark:bg-[#0c4a6e]/20"
                      : "border-[#e2e8f0] dark:border-[#334155] hover:bg-[#f8fafc] dark:hover:bg-[#334155]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isSelected ? "bg-[#0284c7] text-white" : "bg-[#f1f5f9] dark:bg-[#0f172a] text-[#64748b]"
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13px] font-semibold text-(--ds-text-primary)">{label}</span>
                    <span className="block text-[11px] text-[#94a3b8] mt-0.5">{description}</span>
                  </span>
                  {isSelected && <Check size={16} className="text-[#0284c7] shrink-0" />}
                </button>
              );
            })}

            {error && (
              <p className="text-[12px] text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-[42px] rounded-xl border border-[#e2e8f0] dark:border-[#334155] text-[#0f172a] dark:text-white font-semibold text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 h-[42px] rounded-xl bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] font-semibold text-[13px] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
