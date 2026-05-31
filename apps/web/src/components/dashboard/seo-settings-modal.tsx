"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, X, AlertCircle } from "lucide-react";
import { getSeoFieldsAction } from "@/lib/dashboard/actions";
import {
  SeoSettingsPanel,
  type SeoSettingsValues,
} from "./seo-settings-panel";

interface SeoSettingsModalProps {
  /** ProductProfile id whose SEO fields are edited. */
  profileId: string;
  /** Slug used to build the public URL shown in the live link preview. */
  slug?: string;
  onClose: () => void;
  /** Called after a successful save so the caller can refresh its own state. */
  onSaved?: (values: SeoSettingsValues) => void;
}

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; slug: string; values: SeoSettingsValues }
  | { kind: "error"; message: string };

/**
 * Wraps {@link SeoSettingsPanel} in a centered modal. Lazily fetches the
 * profile's SEO fields via {@link getSeoFieldsAction} (no canvas blob) so it can
 * be opened from anywhere we only know the profile id — the dashboard product
 * list dropdown and the editor top-bar button.
 */
export function SeoSettingsModal({ profileId, slug, onClose, onSaved }: SeoSettingsModalProps) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ kind: "loading" });
    getSeoFieldsAction(profileId).then((result) => {
      if (cancelled) return;
      if ("error" in result) {
        setState({ kind: "error", message: result.error ?? "Failed to load SEO settings" });
        return;
      }
      setState({
        kind: "ready",
        slug: result.slug,
        values: {
          productName: result.productName,
          tagline: result.tagline,
          metaDescription: result.metaDescription,
          ogImageUrl: result.ogImageUrl,
          logoUrl: result.logoUrl,
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, [profileId]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const effectiveSlug = state.kind === "ready" ? slug ?? state.slug : slug ?? "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const publicUrl = effectiveSlug ? `${origin}/p/${effectiveSlug}` : origin;
  const domain = typeof window !== "undefined" ? window.location.host : "";

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-9998 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease" }}
      />
      <div
        className="fixed inset-0 z-9999 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative flex w-full max-w-[440px] flex-col overflow-hidden rounded-2xl border border-(--ds-border) bg-(--ds-bg) shadow-2xl"
          style={{ maxHeight: "min(88vh, 760px)", animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button floats over the panel's own sticky header */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-lg text-(--ds-text-muted) transition-colors hover:bg-(--ds-surface-2) hover:text-(--ds-text-primary)"
            title="Close"
          >
            <X size={18} />
          </button>

          {state.kind === "loading" && (
            <div className="flex h-[320px] flex-col items-center justify-center gap-3">
              <Loader2 size={20} className="animate-spin text-(--ds-text-secondary)" />
              <p className="text-[13px] text-(--ds-text-secondary)">Loading SEO settings…</p>
            </div>
          )}

          {state.kind === "error" && (
            <div className="flex h-[320px] flex-col items-center justify-center gap-3 px-8 text-center">
              <AlertCircle size={20} className="text-red-500" />
              <p className="text-[13px] font-medium text-(--ds-text-primary)">
                Couldn&apos;t load SEO settings
              </p>
              <p className="text-[12px] text-(--ds-text-secondary)">{state.message}</p>
            </div>
          )}

          {state.kind === "ready" && (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <SeoSettingsPanel
                profileId={profileId}
                initial={state.values}
                publicUrl={publicUrl}
                domain={domain}
                onSaved={onSaved}
              />
            </div>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}
