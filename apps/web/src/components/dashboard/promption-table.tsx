"use client";

import { useState, useTransition, useCallback } from "react";
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
  Trash2,
  Brush,
  Pencil,
  ArrowUpDown,
} from "lucide-react";
import type { Promption } from "@/hooks/use-promptions";
import { QrModal } from "./qr-modal";

interface PromptionTableProps {
  promptions: Promption[];
  onDelete: (id: string) => Promise<{ success?: boolean; error?: string }>;
  onPublish?: (id: string) => Promise<{ success?: boolean; error?: string; slug?: string }>;
  onUnpublish?: (id: string) => Promise<{ success?: boolean; error?: string }>;
  readOnly?: boolean;
}

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
  readOnly = false,
}: PromptionTableProps) {
  const [search, setSearch] = useState("");
  const [selectedIDs, setSelectedIDs] = useState<Set<string>>(new Set());
  const [qrModal, setQrModal] = useState<{ name: string; slug: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = promptions.filter(
    (p) =>
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    const newPaths = new Set(selectedIDs);
    if (newPaths.has(id)) newPaths.delete(id);
    else newPaths.add(id);
    setSelectedIDs(newPaths);
  };

  const handleCopyLink = useCallback(async (slug: string, id: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

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
        <div className="overflow-x-visible sm:overflow-x-auto min-h-[300px]">
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
                    colSpan={6}
                    className="py-12 text-center text-(--ds-text-muted) block sm:table-cell"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isChecked = selectedIDs.has(p.id);
                  const publicUrl = `/p/${p.slug}`;

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
                        <Link
                          href={`/editor?profileId=${p.id}`}
                          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#f1f5f9] dark:bg-[#0f172a] sm:dark:bg-[#1e293b] text-(--ds-text-secondary) flex items-center justify-center text-[11px] font-semibold tracking-wider shrink-0">
                            {p.productName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
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
                      </td>

                      {/* Public URL */}
                      <td className="block sm:table-cell py-1.5 sm:py-3 px-0 sm:px-4">
                        <div className="flex items-center gap-2">
                          <span className="sm:hidden font-medium text-[11px] text-(--ds-text-secondary) mr-1">URL:</span>
                          <span className="text-(--ds-text-secondary) max-w-55 truncate text-[13px] leading-tight">
                            {publicUrl}
                          </span>
                          <button
                            onClick={() => handleCopyLink(p.slug, p.id)}
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
                                slug: p.slug,
                              })
                            }
                            className="w-9 h-9 flex items-center justify-center text-[#0f172a] dark:text-white bg-white dark:bg-[#0f172a] sm:dark:bg-[#1e293b] rounded-[10px] border-[1.5px] border-[#e2e8f0] dark:border-[#334155] hover:border-[#bae6fd] hover:text-[#0284c7] hover:bg-[#f0f9ff] dark:hover:bg-[#334155] shadow-xs transition-all"
                            title="View QR Code"
                          >
                            <QrCode size={17} strokeWidth={2.5} />
                          </button>

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

                                  <a
                                    href={`/preview/${p.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full px-3 py-2 text-left text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] flex items-center gap-2 transition-colors text-(--ds-text-primary)"
                                  >
                                    <Eye size={15} className="text-[#64748b]" />
                                    Preview
                                  </a>

                                  <button
                                    onClick={() => handlePublishToggle(p)}
                                    disabled={isPending}
                                    className="w-full px-3 py-2 text-left text-[13px] hover:bg-[#f8fafc] dark:hover:bg-[#334155] flex items-center gap-2 transition-colors text-(--ds-text-primary)"
                                  >
                                    <Rocket size={15} className="text-[#64748b]" />
                                    {p.isPublished ? "Unpublish" : "Publish"}
                                  </button>
                                  
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
          slug={qrModal.slug}
        />
      )}
    </div>
  );
}
