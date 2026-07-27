"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, Download, Copy, Check, ExternalLink, Package, Link2, Share2, Tag, ChevronDown, MapPin, ScanBarcode, Info } from "lucide-react";
import QRCode from "qrcode";
import type { Gs1VerificationStatus } from "@productix/db";
import { getCompanyLinkTypesAction, getBranchesAction } from "@/lib/dashboard/actions";
import { buildGs1DigitalLinkUrl } from "@/lib/gs1/digital-link";

// Statuses acceptable for the "require valid GTIN" company policy — anything
// past local check-digit validation, whether or not GS1's registry has it.
const GTIN_POLICY_OK: ReadonlyArray<Gs1VerificationStatus> = ["VALID_FORMAT", "GS1_NOT_FOUND", "GS1_VERIFIED"];

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  shortCode: string;
  /** Canonical 14-digit GTIN, if the product has one — unlocks the GS1 Digital Link QR format. */
  gtin?: string | null;
  gtinStatus?: Gs1VerificationStatus | null;
  /** Company's custom domain, if set — used as the GS1 QR's resolver host instead of this app's own origin. */
  companyCustomDomain?: string | null;
  /** Company-wide "require a valid GTIN" policy — blocks QR issuance entirely when the product doesn't satisfy it. */
  requireValidGtin?: boolean;
}

interface QrTab {
  id: string;
  label: string;
  // Full path prefix, e.g. "/p" for built-ins or "/<prefix>" for custom types.
  prefix: string;
  Icon: typeof Package;
}

interface BranchOption {
  id: string;
  code: number;
  name: string;
}

// Sentinel value for "not scoped to any branch" in the branch picker.
const ALL_BRANCHES = "__all__";

// Built-in QR surfaces. Custom company-defined link types are fetched and
// appended at runtime (they resolve at the top level as /<prefix>/<code>).
const BUILTIN_TABS: ReadonlyArray<QrTab> = [
  { id: "onpack", label: "On Pack", prefix: "/p", Icon: Package },
  { id: "link", label: "Link", prefix: "/l", Icon: Link2 },
  { id: "social", label: "Social", prefix: "/s", Icon: Share2 },
];

export function QrModal({
  isOpen,
  onClose,
  productName,
  shortCode,
  gtin,
  gtinStatus,
  companyCustomDomain,
  requireValidGtin,
}: QrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [qrTypeId, setQrTypeId] = useState<string>("onpack");
  // "general" = today's /p|/l|/s|/<custom>/<shortCode> format, unchanged.
  // "gs1" = the new GS1 Digital Link format (/01/{gtin}), only selectable once a GTIN is set.
  const [format, setFormat] = useState<"general" | "gs1">("general");
  const [customTabs, setCustomTabs] = useState<QrTab[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [branchId, setBranchId] = useState<string>(ALL_BRANCHES);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const branchSelectorRef = useRef<HTMLDivElement>(null);

  // Pull the company's custom link types whenever the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    getCompanyLinkTypesAction().then((res) => {
      if (cancelled) return;
      const items = "items" in res ? res.items : undefined;
      if (!items) return;
      setCustomTabs(
        items
          .filter((t) => t.isActive)
          .map((t) => ({
            id: `custom:${t.id}`,
            label: t.label,
            prefix: `/${t.prefix}`,
            Icon: Tag,
          })),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Pull the company's active branches so a QR can be scoped to one location.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    getBranchesAction().then((res) => {
      if (cancelled) return;
      const items = "items" in res ? res.items : undefined;
      if (!items) return;
      setBranches(items.filter((b) => b.isActive).map((b) => ({ id: b.id, code: b.code, name: b.name })));
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const tabs = useMemo<QrTab[]>(() => [...BUILTIN_TABS, ...customTabs], [customTabs]);
  const selectedBranch = useMemo(
    () => branches.find((b) => b.id === branchId) ?? null,
    [branches, branchId],
  );

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === qrTypeId) ?? tabs[0],
    [tabs, qrTypeId],
  );
  const prefix = activeTab?.prefix ?? "/p";
  // Last path segment, used in download filenames (e.g. "p", "l", "promo").
  const typeSlug = prefix.split("/").filter(Boolean).pop() ?? "qr";
  // A branch-scoped QR carries ?b=<code> (short per-company number); the public
  // page resolves it and attributes every feedback submission to that branch.
  const branchQuery = selectedBranch ? `?b=${selectedBranch.code}` : "";
  const branchSlug = selectedBranch
    ? `-${selectedBranch.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24)}`
    : "";

  // Whether this product's GTIN satisfies the company's requireValidGtin policy
  // (or the policy is off) - gates QR issuance entirely, not just the GS1 format.
  const gtinSatisfiesPolicy = !requireValidGtin || (!!gtinStatus && GTIN_POLICY_OK.includes(gtinStatus));
  const canUseGs1Format = !!gtin && !!gtinStatus && GTIN_POLICY_OK.includes(gtinStatus);

  // The channel/traffic-source label carried in the GS1 URL's ?ch= extension
  // param — reuses the same channel the general-format tabs represent
  // (on-pack / link / social / a custom link type's prefix).
  const gs1Channel = activeTab
    ? activeTab.id.startsWith("custom:")
      ? activeTab.prefix.replace(/^\//, "")
      : activeTab.id
    : null;

  const publicUrl =
    format === "gs1" && gtin
      ? buildGs1DigitalLinkUrl({
          domain: companyCustomDomain || (typeof window !== "undefined" ? window.location.origin : ""),
          gtin,
          branchCode: selectedBranch?.code ?? null,
          channel: gs1Channel,
        })
      : `${typeof window !== "undefined" ? window.location.origin : ""}${prefix}/${shortCode}${branchQuery}`;

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, publicUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    });
  }, [isOpen, publicUrl]);

  // Reset to default type whenever the modal is reopened so each session starts
  // on On Pack rather than whatever the user picked last time.
  useEffect(() => {
    if (isOpen) {
      setQrTypeId("onpack");
      setFormat("general");
      setMenuOpen(false);
      setBranchId(ALL_BRANCHES);
      setBranchMenuOpen(false);
    }
  }, [isOpen]);

  // Close either dropdown on outside click or Escape.
  useEffect(() => {
    if (!menuOpen && !branchMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (branchSelectorRef.current && !branchSelectorRef.current.contains(e.target as Node)) {
        setBranchMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setBranchMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, branchMenuOpen]);

  const filenameBase = `${format === "gs1" ? gtin ?? shortCode : shortCode}-${format === "gs1" ? `gs1-${typeSlug}` : typeSlug}${branchSlug}`;

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `${filenameBase}-qr.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleDownloadSvg = async () => {
    const svgString = await QRCode.toString(publicUrl, {
      type: "svg",
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    });
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${filenameBase}-qr.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-9998 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease" }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-9999 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[420px] rounded-2xl bg-white dark:bg-[#1e293b] shadow-2xl border border-[#e2e8f0] dark:border-[#334155] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{ animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div>
              <h3 className="text-lg font-bold text-[#0f172a] dark:text-white">
                QR Code
              </h3>
              <p className="text-[13px] text-[#64748b] dark:text-[#94a3b8] mt-0.5">
                {productName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* QR Type Selector — a dropdown so it stays tidy no matter how many
              link types a company defines. */}
          <div className="px-6 pt-2">
            <div ref={selectorRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="w-full h-10 px-3 rounded-xl bg-[#f1f5f9] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] flex items-center justify-between gap-2 text-[13px] font-medium text-[#0f172a] dark:text-white hover:border-[#cbd5e1] dark:hover:border-[#475569] transition-colors"
                aria-haspopup="listbox"
                aria-expanded={menuOpen}
              >
                <span className="flex items-center gap-2 min-w-0">
                  {activeTab?.Icon && <activeTab.Icon size={15} strokeWidth={2.2} className="shrink-0 text-[#64748b] dark:text-[#94a3b8]" />}
                  <span className="truncate">{activeTab?.label ?? "On Pack"}</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-[#94a3b8] transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <ul
                  role="listbox"
                  className="absolute left-0 right-0 top-full mt-1.5 z-10 max-h-[220px] overflow-y-auto p-1 rounded-xl bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] shadow-lg"
                >
                  {tabs.map(({ id, label, Icon }) => {
                    const active = qrTypeId === id;
                    return (
                      <li key={id} role="option" aria-selected={active}>
                        <button
                          type="button"
                          onClick={() => {
                            setQrTypeId(id);
                            setMenuOpen(false);
                          }}
                          className={`w-full h-9 px-2.5 rounded-lg text-[13px] font-medium flex items-center gap-2 transition-colors ${
                            active
                              ? "bg-[#f1f5f9] dark:bg-[#0f172a] text-[#0f172a] dark:text-white"
                              : "text-[#64748b] dark:text-[#94a3b8] hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] hover:text-[#0f172a] dark:hover:text-white"
                          }`}
                        >
                          <Icon size={15} strokeWidth={2.2} className="shrink-0" />
                          <span className="truncate flex-1 text-left">{label}</span>
                          {active && <Check size={14} className="shrink-0 text-emerald-500" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Format toggle — General QR (today's shortCode-based link) vs GS1
              Digital Link QR (spec-compliant /01/{gtin} URL). The channel
              selector above applies to both: for GS1 it's carried as a ?ch=
              extension param instead of a path prefix. */}
          <div className="px-6 pt-3">
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#f1f5f9] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155]">
              <button
                type="button"
                onClick={() => setFormat("general")}
                className={`h-8 rounded-lg text-[12px] font-semibold transition-colors ${
                  format === "general"
                    ? "bg-white dark:bg-[#1e293b] text-[#0f172a] dark:text-white shadow-xs"
                    : "text-[#64748b] dark:text-[#94a3b8]"
                }`}
              >
                General QR
              </button>
              <button
                type="button"
                onClick={() => canUseGs1Format && setFormat("gs1")}
                disabled={!canUseGs1Format}
                title={canUseGs1Format ? undefined : "Add a GTIN to this product to generate a GS1 Digital Link QR"}
                className={`h-8 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  format === "gs1"
                    ? "bg-white dark:bg-[#1e293b] text-[#0f172a] dark:text-white shadow-xs"
                    : canUseGs1Format
                      ? "text-[#64748b] dark:text-[#94a3b8]"
                      : "text-[#cbd5e1] dark:text-[#475569] cursor-not-allowed"
                }`}
              >
                <ScanBarcode size={13} />
                GS1 Digital Link
              </button>
            </div>
            {!gtin && (
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-[#94a3b8]">
                <Info size={11} className="shrink-0" />
                Add a GTIN to this product to unlock the GS1 Digital Link QR format.
              </p>
            )}
          </div>

          {!gtinSatisfiesPolicy ? (
            <div className="px-6 pt-4 pb-6">
              <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 flex items-start gap-2.5">
                <Info size={16} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <p className="text-[13px] text-amber-800 dark:text-amber-300 leading-snug">
                  This company requires a valid GTIN before QR codes can be issued, and this
                  product doesn&apos;t have one. Ask an admin to add a GTIN when recreating this
                  product, or turn off the requirement in Settings.
                </p>
              </div>
            </div>
          ) : (
          <>
          {/* Branch Selector — optional. Scopes the QR to one location so every
              feedback submission scanned through it is attributed to that branch.
              Only shown when the company has active branches. */}
          {branches.length > 0 && (
            <div className="px-6 pt-4">
              <div ref={branchSelectorRef} className="relative">
                <button
                  type="button"
                  onClick={() => setBranchMenuOpen((o) => !o)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f1f5f9] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] flex items-center justify-between gap-2 text-[13px] font-medium text-[#0f172a] dark:text-white hover:border-[#cbd5e1] dark:hover:border-[#475569] transition-colors"
                  aria-haspopup="listbox"
                  aria-expanded={branchMenuOpen}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <MapPin size={15} strokeWidth={2.2} className="shrink-0 text-[#64748b] dark:text-[#94a3b8]" />
                    <span className="truncate">{selectedBranch ? selectedBranch.name : "All branches"}</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-[#94a3b8] transition-transform ${branchMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {branchMenuOpen && (
                  <ul
                    role="listbox"
                    className="absolute left-0 right-0 top-full mt-1.5 z-10 max-h-[220px] overflow-y-auto p-1 rounded-xl bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] shadow-lg"
                  >
                    {[{ id: ALL_BRANCHES, name: "All branches" }, ...branches].map((b) => {
                      const active = branchId === b.id;
                      return (
                        <li key={b.id} role="option" aria-selected={active}>
                          <button
                            type="button"
                            onClick={() => {
                              setBranchId(b.id);
                              setBranchMenuOpen(false);
                            }}
                            className={`w-full h-9 px-2.5 rounded-lg text-[13px] font-medium flex items-center gap-2 transition-colors ${
                              active
                                ? "bg-[#f1f5f9] dark:bg-[#0f172a] text-[#0f172a] dark:text-white"
                                : "text-[#64748b] dark:text-[#94a3b8] hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] hover:text-[#0f172a] dark:hover:text-white"
                            }`}
                          >
                            <MapPin size={15} strokeWidth={2.2} className="shrink-0" />
                            <span className="truncate flex-1 text-left">{b.name}</span>
                            {active && <Check size={14} className="shrink-0 text-emerald-500" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* QR Canvas */}
          <div className="px-6 py-5 flex flex-col items-center">
            <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-xs">
              <canvas ref={canvasRef} />
            </div>

            {/* URL Display */}
            <div className="mt-4 w-full px-3 py-2.5 rounded-lg bg-[#f8fafc] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] flex items-center gap-2">
              <span className="flex-1 text-[12px] font-mono text-[#64748b] dark:text-[#94a3b8] truncate">
                {publicUrl}
              </span>
              <button
                onClick={handleCopy}
                className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-white dark:hover:bg-[#1e293b] transition-colors"
                title="Copy URL"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-500" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex flex-col gap-2.5">
            <div className="flex gap-2.5">
              <button
                onClick={handleDownloadPng}
                className="flex-1 h-[42px] rounded-xl bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] font-semibold text-[13px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Download size={15} />
                PNG
              </button>
              <button
                onClick={handleDownloadSvg}
                className="flex-1 h-[42px] rounded-xl border border-[#e2e8f0] dark:border-[#334155] text-[#0f172a] dark:text-white font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-[#f8fafc] dark:hover:bg-[#334155] transition-colors"
              >
                <Download size={15} />
                SVG
              </button>
            </div>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-[40px] rounded-xl text-[#64748b] dark:text-[#94a3b8] font-medium text-[12px] flex items-center justify-center gap-2 hover:text-[#0f172a] dark:hover:text-white transition-colors"
            >
              <ExternalLink size={14} />
              Visit link
            </a>
          </div>
          </>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
