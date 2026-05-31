"use client";

import { use, useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  History,
  RotateCcw,
  Plus,
  Minus,
  Pencil,
  Check,
  Loader2,
  AlertCircle,
  ExternalLink,
  PencilRuler,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  getPageVersionDetailsAction,
  restorePageVersionAction,
  type PageVersionDetail,
  type ElementChangeKind,
} from "@/lib/dashboard/actions";

interface PageProps {
  params: Promise<{ profileId: string }>;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

const KIND_LABELS: Record<ElementChangeKind, string> = {
  content: "text/content",
  moved: "moved",
  resized: "resized",
  rotated: "rotated",
  styled: "style",
};

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
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

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; productName: string; slug: string; versions: PageVersionDetail[] };

export default function VersionHistoryPage({ params }: PageProps) {
  const { profileId } = use(params);
  const valid = UUID_RE.test(profileId);

  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const load = useCallback(() => {
    if (!valid) return;
    setState({ kind: "loading" });
    getPageVersionDetailsAction(profileId).then((res) => {
      if ("error" in res) {
        setState({ kind: "error", message: res.error ?? "Failed to load history" });
        return;
      }
      setState({
        kind: "ready",
        productName: res.productName,
        slug: res.slug,
        versions: res.versions,
      });
    });
  }, [profileId, valid]);

  useEffect(() => load(), [load]);

  const handleRestore = useCallback(
    (versionId: string) => {
      setRestoring(versionId);
      setActionError(null);
      restorePageVersionAction(profileId, versionId).then((res) => {
        setRestoring(null);
        setConfirmId(null);
        if ("error" in res) {
          setActionError(res.error ?? "Restore failed");
          return;
        }
        startTransition(load);
      });
    },
    [profileId, load],
  );

  if (!valid) {
    return (
      <div className="page-content bg-(--ds-bg)">
        <DashboardHeader />
        <section className="section mt-0!">
          <p className="text-(--ds-text-secondary) text-sm">Invalid page id.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page-content bg-(--ds-bg)">
      <DashboardHeader />
      <section className="section mt-0!">
        {/* Breadcrumb / back */}
        <Link
          href="/dashboard/products"
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-(--ds-text-secondary) transition-colors hover:text-(--ds-text-primary)"
        >
          <ArrowLeft size={15} />
          Back to products
        </Link>

        {/* Title row */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--ds-surface-2) text-(--ds-text-secondary)">
              <History size={18} />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-(--ds-text-primary)">
                Version history
              </h1>
              {state.kind === "ready" && (
                <p className="text-[13px] text-(--ds-text-secondary)">
                  {state.productName} · {state.versions.length} version
                  {state.versions.length === 1 ? "" : "s"}
                </p>
              )}
            </div>
          </div>
          {state.kind === "ready" && (
            <div className="flex items-center gap-2">
              <Link
                href={`/editor?profileId=${profileId}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-(--ds-border) px-3 py-1.5 text-[13px] font-medium text-(--ds-text-primary) transition-colors hover:bg-(--ds-surface-2)"
              >
                <PencilRuler size={14} />
                Open editor
              </Link>
              <a
                href={`/p/${state.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-(--ds-border) px-3 py-1.5 text-[13px] font-medium text-(--ds-text-secondary) transition-colors hover:bg-(--ds-surface-2) hover:text-(--ds-text-primary)"
              >
                <ExternalLink size={14} />
                View live
              </a>
            </div>
          )}
        </div>

        {actionError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-[13px] text-red-600">
            <AlertCircle size={15} />
            {actionError}
          </div>
        )}

        {state.kind === "loading" && (
          <div className="flex h-[300px] flex-col items-center justify-center gap-3">
            <Loader2 size={22} className="animate-spin text-(--ds-text-secondary)" />
            <p className="text-[13px] text-(--ds-text-secondary)">Loading history…</p>
          </div>
        )}

        {state.kind === "error" && (
          <div className="flex h-[300px] flex-col items-center justify-center gap-3 text-center">
            <AlertCircle size={22} className="text-red-500" />
            <p className="text-[14px] font-medium text-(--ds-text-primary)">
              Couldn&apos;t load version history
            </p>
            <p className="text-[13px] text-(--ds-text-secondary)">{state.message}</p>
          </div>
        )}

        {state.kind === "ready" && state.versions.length === 0 && (
          <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-center">
            <History size={24} className="text-(--ds-text-muted)" />
            <p className="text-[14px] font-medium text-(--ds-text-primary)">No versions yet</p>
            <p className="text-[13px] text-(--ds-text-secondary)">
              Save the page in the editor and detailed snapshots will appear here.
            </p>
          </div>
        )}

        {state.kind === "ready" && state.versions.length > 0 && (
          <ol className="relative ml-1 border-l border-(--ds-border)">
            {state.versions.map((v) => {
              const meta = REASON_META[v.reason] ?? SAVED_META;
              const confirming = confirmId === v.id;
              const isRestoring = restoring === v.id;
              return (
                <li key={v.id} className="relative mb-5 pl-6">
                  {/* timeline dot */}
                  <span
                    className={`absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-(--ds-bg) ${
                      v.isCurrent ? "bg-emerald-500" : "bg-(--ds-text-muted)"
                    }`}
                  />
                  <div className="rounded-xl border border-(--ds-border) bg-(--ds-surface) p-4 shadow-xs">
                    {/* header */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.className}`}
                      >
                        {meta.label}
                      </span>
                      {v.isCurrent && (
                        <span className="rounded bg-emerald-500/12 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                          Current
                        </span>
                      )}
                      <span className="text-[13px] font-semibold text-(--ds-text-primary)">
                        {formatRelative(v.createdAt)}
                      </span>
                      <span className="text-[12px] text-(--ds-text-muted)">
                        {new Date(v.createdAt).toLocaleString()}
                      </span>
                      <span className="text-[12px] text-(--ds-text-secondary)">
                        · {v.email ?? "Unknown user"}
                      </span>

                      <span className="ml-auto">
                        {!v.isCurrent &&
                          (confirming ? (
                            <span className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleRestore(v.id)}
                                disabled={isRestoring}
                                className="inline-flex items-center gap-1 rounded-lg bg-(--ds-text-primary) px-2.5 py-1.5 text-[12px] font-medium text-(--ds-bg) transition-opacity hover:opacity-90 disabled:opacity-60"
                              >
                                {isRestoring ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <Check size={13} />
                                )}
                                Confirm restore
                              </button>
                              <button
                                onClick={() => setConfirmId(null)}
                                disabled={isRestoring}
                                className="rounded-lg px-2.5 py-1.5 text-[12px] text-(--ds-text-secondary) transition-colors hover:bg-(--ds-surface-2)"
                              >
                                Cancel
                              </button>
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setConfirmId(v.id);
                                setActionError(null);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-(--ds-border) px-2.5 py-1.5 text-[12px] font-medium text-(--ds-text-primary) transition-colors hover:bg-(--ds-surface-2)"
                            >
                              <RotateCcw size={13} />
                              Restore
                            </button>
                          ))}
                      </span>
                    </div>

                    {/* one-line summary */}
                    {v.summary && (
                      <p className="mt-2 text-[13px] font-medium text-(--ds-text-primary)">
                        {v.summary}
                      </p>
                    )}

                    {/* detailed breakdown */}
                    <ChangeDetail detail={v} />
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}

function ChangeDetail({ detail }: { detail: PageVersionDetail }) {
  const c = detail.changes;
  const hasDetail =
    c.isInitial ||
    c.pageRenamedTo ||
    c.added.length > 0 ||
    c.removed.length > 0 ||
    c.modified.length > 0 ||
    c.sectionsDelta !== 0;

  if (!hasDetail) return null;

  return (
    <div className="mt-3 flex flex-col gap-2 border-t border-(--ds-border) pt-3">
      {c.pageRenamedTo && (
        <Row icon={<Pencil size={13} className="text-(--ds-text-muted)" />} label="Renamed page">
          <span className="text-(--ds-text-primary)">“{c.pageRenamedTo}”</span>
        </Row>
      )}

      {c.added.length > 0 && (
        <Row
          icon={<Plus size={13} className="text-emerald-600" />}
          label={`Added ${c.added.length}`}
        >
          <Chips items={c.added.map((e) => `${e.label}`)} tone="add" />
        </Row>
      )}

      {c.removed.length > 0 && (
        <Row
          icon={<Minus size={13} className="text-red-500" />}
          label={`Removed ${c.removed.length}`}
        >
          <Chips items={c.removed.map((e) => `${e.label}`)} tone="remove" />
        </Row>
      )}

      {c.modified.length > 0 && (
        <Row
          icon={<Pencil size={13} className="text-(--ds-text-muted)" />}
          label={`Edited ${c.modified.length}`}
        >
          <div className="flex flex-col gap-1">
            {c.modified.map((m, i) => (
              <div key={i} className="flex flex-wrap items-center gap-1.5">
                <span className="text-[12px] text-(--ds-text-primary)">{m.label}</span>
                {m.kinds.map((k) => (
                  <span
                    key={k}
                    className="rounded bg-(--ds-surface-2) px-1.5 py-0.5 text-[10px] text-(--ds-text-secondary)"
                  >
                    {KIND_LABELS[k]}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Row>
      )}

      {c.sectionsDelta !== 0 && (
        <Row
          icon={
            c.sectionsDelta > 0 ? (
              <Plus size={13} className="text-emerald-600" />
            ) : (
              <Minus size={13} className="text-red-500" />
            )
          }
          label={`${c.sectionsDelta > 0 ? "Added" : "Removed"} ${Math.abs(c.sectionsDelta)} section${
            Math.abs(c.sectionsDelta) === 1 ? "" : "s"
          }`}
        >
          {null}
        </Row>
      )}
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-[12px]">
      <span className="mt-0.5 flex w-[110px] flex-shrink-0 items-center gap-1.5 font-medium text-(--ds-text-secondary)">
        {icon}
        {label}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function Chips({ items, tone }: { items: string[]; tone: "add" | "remove" }) {
  const cls =
    tone === "add"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : "bg-red-500/10 text-red-600 dark:text-red-400";
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it, i) => (
        <span key={i} className={`rounded px-1.5 py-0.5 text-[11px] ${cls}`}>
          {it}
        </span>
      ))}
    </div>
  );
}
