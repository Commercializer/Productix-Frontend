"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Loader2,
  X,
  AlertCircle,
  History,
  RotateCcw,
  Check,
  ExternalLink,
  ListTree,
} from "lucide-react";
import {
  getPageVersionsAction,
  restorePageVersionAction,
  type PageVersionSummary,
} from "@/lib/dashboard/actions";

interface VersionHistoryModalProps {
  /** ProductProfile id whose version history is shown. */
  profileId: string;
  /** Slug used to build the public preview URL. */
  slug?: string;
  onClose: () => void;
  /** Called after a successful restore so the caller can refresh / notify. */
  onRestored?: () => void;
}

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; versions: PageVersionSummary[] }
  | { kind: "error"; message: string };

type ReasonMeta = { label: string; className: string };
const SAVED_META: ReasonMeta = {
  label: "Saved",
  className: "bg-(--ds-surface-2) text-(--ds-text-secondary)",
};
const REASON_META: Record<string, ReasonMeta> = {
  save: SAVED_META,
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

/**
 * Lists a page's version history (the user edit log) and lets the owner restore
 * a prior snapshot. Mirrors {@link SeoSettingsModal}'s shell — lazily fetches via
 * {@link getPageVersionsAction} from just a profile id so it can open from the
 * dashboard product-list dropdown.
 */
export function VersionHistoryModal({
  profileId,
  slug,
  onClose,
  onRestored,
}: VersionHistoryModalProps) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  // The version id currently awaiting a restore confirmation, if any.
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  const load = useCallback(() => {
    let cancelled = false;
    setState({ kind: "loading" });
    getPageVersionsAction(profileId).then((result) => {
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
  }, [profileId]);

  useEffect(() => load(), [load]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleRestore = useCallback(
    async (versionId: string) => {
      setRestoringId(versionId);
      setRestoreError(null);
      const result = await restorePageVersionAction(profileId, versionId);
      setRestoringId(null);
      setConfirmId(null);
      if ("error" in result) {
        setRestoreError(result.error ?? "Restore failed");
        return;
      }
      onRestored?.();
      load();
    },
    [profileId, onRestored, load],
  );

  const previewUrl = slug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/p/${slug}`
    : null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-9998 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease" }}
      />
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="relative flex w-full max-w-[480px] flex-col overflow-hidden rounded-2xl border border-(--ds-border) bg-(--ds-bg) shadow-2xl"
          style={{ maxHeight: "min(88vh, 760px)", animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-(--ds-border) px-5 py-4">
            <History size={17} className="text-(--ds-text-secondary)" />
            <div className="flex-1">
              <h2 className="text-[15px] font-semibold text-(--ds-text-primary)">Version history</h2>
              <p className="text-[12px] text-(--ds-text-secondary)">
                Snapshots from each save &amp; publish
              </p>
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
              <p className="text-[13px] font-medium text-(--ds-text-primary)">
                Couldn&apos;t load version history
              </p>
              <p className="text-[12px] text-(--ds-text-secondary)">{state.message}</p>
            </div>
          )}

          {state.kind === "ready" && state.versions.length === 0 && (
            <div className="flex h-[280px] flex-col items-center justify-center gap-2 px-8 text-center">
              <History size={22} className="text-(--ds-text-muted)" />
              <p className="text-[13px] font-medium text-(--ds-text-primary)">No versions yet</p>
              <p className="text-[12px] text-(--ds-text-secondary)">
                Save the page in the editor and snapshots will appear here.
              </p>
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
                  const meta = REASON_META[v.reason] ?? SAVED_META;
                  const isLatest = i === 0;
                  const confirming = confirmId === v.id;
                  const restoring = restoringId === v.id;
                  return (
                    <li key={v.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.className}`}
                          >
                            {meta.label}
                          </span>
                          <span className="text-[13px] font-medium text-(--ds-text-primary)">
                            {formatRelative(v.createdAt)}
                          </span>
                          {isLatest && (
                            <span className="text-[11px] text-(--ds-text-muted)">· current</span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-[12px] text-(--ds-text-secondary)">
                          {v.email ?? "Unknown user"}
                          {" · "}
                          {new Date(v.createdAt).toLocaleString()}
                        </p>
                        {v.summary && (
                          <p className="mt-1 text-[12px] leading-snug text-(--ds-text-primary)">
                            {v.summary}
                          </p>
                        )}
                      </div>

                      {!isLatest &&
                        (confirming ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleRestore(v.id)}
                              disabled={restoring}
                              className="flex items-center gap-1 rounded-lg bg-(--ds-text-primary) px-2.5 py-1.5 text-[12px] font-medium text-(--ds-bg) transition-opacity hover:opacity-90 disabled:opacity-60"
                            >
                              {restoring ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Check size={13} />
                              )}
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              disabled={restoring}
                              className="rounded-lg px-2.5 py-1.5 text-[12px] text-(--ds-text-secondary) transition-colors hover:bg-(--ds-surface-2)"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setConfirmId(v.id);
                              setRestoreError(null);
                            }}
                            className="flex items-center gap-1.5 rounded-lg border border-(--ds-border) px-2.5 py-1.5 text-[12px] font-medium text-(--ds-text-primary) transition-colors hover:bg-(--ds-surface-2)"
                            title="Restore this version"
                          >
                            <RotateCcw size={13} />
                            Restore
                          </button>
                        ))}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-(--ds-border) px-5 py-3">
            <a
              href={`/dashboard/history/${profileId}`}
              className="flex items-center gap-1.5 text-[12px] font-medium text-(--ds-text-primary) transition-colors hover:underline"
            >
              <ListTree size={13} />
              View full details
            </a>
            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[12px] font-medium text-(--ds-text-secondary) transition-colors hover:text-(--ds-text-primary)"
              >
                <ExternalLink size={13} />
                Preview
              </a>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
