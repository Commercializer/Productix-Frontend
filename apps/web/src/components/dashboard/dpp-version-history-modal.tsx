"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, X, AlertCircle, History, RotateCcw, Check, ChevronDown, ChevronRight } from "lucide-react";
import {
  getDppVersionsAction,
  getDppVersionDetailsAction,
  restoreDppVersionAction,
  type DppVersionSummary,
  type DppFieldChanges,
} from "@/lib/dashboard/actions";

interface DppVersionHistoryModalProps {
  /** Product id whose DPP version history is shown. */
  productId: string;
  onClose: () => void;
  /** Called after a successful restore so the caller can reload the editor. */
  onRestored?: () => void;
}

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; versions: DppVersionSummary[] }
  | { kind: "error"; message: string };

type ReasonMeta = { label: string; className: string };
const REASON_META: Record<string, ReasonMeta> = {
  publish: { label: "Published", className: "bg-emerald-500/12 text-emerald-600" },
  restore: { label: "Restored", className: "bg-amber-500/12 text-amber-600" },
};

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const sec = Math.round(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}

function formatFieldValue(v: unknown): string {
  if (v === null || v === undefined || v === "") return "(empty)";
  return typeof v === "string" ? v : JSON.stringify(v);
}

/** Inline expandable diff for one version - added/modified/removed fields with old/new values. */
function ChangeDetail({ productId, versionNumber }: { productId: string; versionNumber: number }) {
  const [changes, setChanges] = useState<DppFieldChanges | null | "loading" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    getDppVersionDetailsAction(productId, versionNumber).then((res) => {
      if (cancelled) return;
      if ("error" in res) {
        setChanges("error");
        return;
      }
      setChanges(res.version.changes);
    });
    return () => {
      cancelled = true;
    };
  }, [productId, versionNumber]);

  if (changes === "loading") {
    return <p className="px-2 py-2 text-[12px] text-(--ds-text-secondary)">Loading changes…</p>;
  }
  if (changes === "error") {
    return <p className="px-2 py-2 text-[12px] text-red-600">Couldn&apos;t load the change detail.</p>;
  }
  if (!changes || changes.isInitial) {
    return <p className="px-2 py-2 text-[12px] text-(--ds-text-secondary)">Initial version - no prior data to compare.</p>;
  }
  if (!changes.added.length && !changes.removed.length && !changes.modified.length) {
    return <p className="px-2 py-2 text-[12px] text-(--ds-text-secondary)">No field-level changes.</p>;
  }

  return (
    <div className="space-y-2 px-2 py-2 text-[12px]">
      {changes.modified.map((c) => (
        <div key={`m-${c.path}`} className="flex flex-col gap-0.5">
          <span className="font-medium text-(--ds-text-primary)">{c.path}</span>
          <span className="text-(--ds-text-secondary)">
            <span className="line-through opacity-70">{formatFieldValue(c.previousValue)}</span>
            {" → "}
            <span>{formatFieldValue(c.newValue)}</span>
          </span>
        </div>
      ))}
      {changes.added.map((c) => (
        <div key={`a-${c.path}`} className="flex flex-col gap-0.5">
          <span className="font-medium text-emerald-600">+ {c.path}</span>
          <span className="text-(--ds-text-secondary)">{formatFieldValue(c.newValue)}</span>
        </div>
      ))}
      {changes.removed.map((c) => (
        <div key={`r-${c.path}`} className="flex flex-col gap-0.5">
          <span className="font-medium text-red-600">− {c.path}</span>
          <span className="text-(--ds-text-secondary) line-through opacity-70">{formatFieldValue(c.previousValue)}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Lists a DPP's immutable version history and lets an authorized user (server
 * enforces COMPANY_ADMIN/TENANT_ADMIN - see restoreDppVersionAction) restore a
 * prior snapshot. Restoring never deletes history - it creates a new version.
 * Mirrors {@link VersionHistoryModal}'s shell, adapted to versionNumber-keyed
 * rows and an inline expandable field-level diff instead of a separate page.
 */
export function DppVersionHistoryModal({ productId, onClose, onRestored }: DppVersionHistoryModalProps) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [confirmVersion, setConfirmVersion] = useState<number | null>(null);
  const [restoringVersion, setRestoringVersion] = useState<number | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null);

  const load = useCallback(() => {
    let cancelled = false;
    setState({ kind: "loading" });
    getDppVersionsAction(productId).then((result) => {
      if (cancelled) return;
      if ("error" in result) {
        setState({ kind: "error", message: result.error ?? "Failed to load history" });
        return;
      }
      setState({ kind: "ready", versions: result.versions });
    });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  useEffect(() => load(), [load]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleRestore = useCallback(
    async (versionNumber: number) => {
      setRestoringVersion(versionNumber);
      setRestoreError(null);
      const result = await restoreDppVersionAction(productId, versionNumber);
      setRestoringVersion(null);
      setConfirmVersion(null);
      if ("error" in result) {
        setRestoreError(result.error ?? "Restore failed");
        return;
      }
      onRestored?.();
      load();
    },
    [productId, onRestored, load]
  );

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-9998 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease" }}
      />
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="relative flex w-full max-w-[520px] flex-col overflow-hidden rounded-2xl border border-(--ds-border) bg-(--ds-bg) shadow-2xl"
          style={{ maxHeight: "min(88vh, 760px)", animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 border-b border-(--ds-border) px-5 py-4">
            <History size={17} className="text-(--ds-text-secondary)" />
            <div className="flex-1">
              <h2 className="text-[15px] font-semibold text-(--ds-text-primary)">DPP version history</h2>
              <p className="text-[12px] text-(--ds-text-secondary)">Every published/updated snapshot, permanently recorded</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-(--ds-text-muted) transition-colors hover:bg-(--ds-surface-2) hover:text-(--ds-text-primary)"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {state.kind === "loading" && (
            <div className="flex h-[320px] flex-col items-center justify-center gap-3">
              <Loader2 size={20} className="animate-spin text-(--ds-text-secondary)" />
              <p className="text-[13px] text-(--ds-text-secondary)">Loading history…</p>
            </div>
          )}

          {state.kind === "error" && (
            <div className="flex h-[320px] flex-col items-center justify-center gap-3 px-8 text-center">
              <AlertCircle size={20} className="text-red-500" />
              <p className="text-[13px] font-medium text-(--ds-text-primary)">Couldn&apos;t load version history</p>
              <p className="text-[12px] text-(--ds-text-secondary)">{state.message}</p>
            </div>
          )}

          {state.kind === "ready" && state.versions.length === 0 && (
            <div className="flex h-[280px] flex-col items-center justify-center gap-2 px-8 text-center">
              <History size={22} className="text-(--ds-text-muted)" />
              <p className="text-[13px] font-medium text-(--ds-text-primary)">No versions yet</p>
              <p className="text-[12px] text-(--ds-text-secondary)">Save the passport and its first version will appear here.</p>
            </div>
          )}

          {state.kind === "ready" && state.versions.length > 0 && (
            <div className="min-h-0 flex-1 overflow-y-auto">
              {restoreError && (
                <div className="mx-4 mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-[12px] text-red-600">
                  <AlertCircle size={14} />
                  {restoreError}
                </div>
              )}
              <ul className="divide-y divide-(--ds-border)">
                {state.versions.map((v, i) => {
                  const meta = REASON_META[v.reason] ?? REASON_META.publish!;
                  const isLatest = i === 0;
                  const confirming = confirmVersion === v.versionNumber;
                  const restoring = restoringVersion === v.versionNumber;
                  const expanded = expandedVersion === v.versionNumber;
                  return (
                    <li key={v.versionNumber} className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setExpandedVersion(expanded ? null : v.versionNumber)}
                          className="flex h-6 w-6 shrink-0 items-center justify-center text-(--ds-text-muted) hover:text-(--ds-text-primary)"
                          title="View changes"
                        >
                          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium text-(--ds-text-primary)">v{v.versionNumber}</span>
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.className}`}
                            >
                              {meta.label}
                            </span>
                            <span className="text-[12px] text-(--ds-text-secondary)">{formatRelative(v.createdAt)}</span>
                            {isLatest && <span className="text-[11px] text-(--ds-text-muted)">· current</span>}
                          </div>
                          <p className="mt-0.5 truncate text-[12px] text-(--ds-text-secondary)">
                            {v.email ?? "Unknown user"} · {new Date(v.createdAt).toLocaleString()}
                          </p>
                          {v.summary && <p className="mt-1 text-[12px] leading-snug text-(--ds-text-primary)">{v.summary}</p>}
                        </div>

                        {!isLatest &&
                          (confirming ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleRestore(v.versionNumber)}
                                disabled={restoring}
                                className="flex items-center gap-1 rounded-lg bg-(--ds-text-primary) px-2.5 py-1.5 text-[12px] font-medium text-(--ds-bg) transition-opacity hover:opacity-90 disabled:opacity-60"
                              >
                                {restoring ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmVersion(null)}
                                disabled={restoring}
                                className="rounded-lg px-2.5 py-1.5 text-[12px] text-(--ds-text-secondary) transition-colors hover:bg-(--ds-surface-2)"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setConfirmVersion(v.versionNumber);
                                setRestoreError(null);
                              }}
                              className="flex items-center gap-1.5 rounded-lg border border-(--ds-border) px-2.5 py-1.5 text-[12px] font-medium text-(--ds-text-primary) transition-colors hover:bg-(--ds-surface-2)"
                              title="Restore this version"
                            >
                              <RotateCcw size={13} />
                              Restore
                            </button>
                          ))}
                      </div>
                      {expanded && (
                        <div className="mt-2 ml-9 rounded-lg bg-(--ds-surface-2)">
                          <ChangeDetail productId={productId} versionNumber={v.versionNumber} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
