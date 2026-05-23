"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import type { CanvasDocument } from "@productix/types";
import type { ContentLocale } from "@productix/types";
import { PreviewRenderer, productPromoTemplate } from "@productix/editor";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import { getPreviewPageBySlugAction } from "@/lib/dashboard/actions";
import { MobileMockup } from "@/components/dashboard/mobile-mockup";
import {
  SeoSettingsPanel,
  type SeoSettingsValues,
} from "@/components/dashboard/seo-settings-panel";

const STORAGE_KEY = "productix-canvas-data";

type PreviewPage = {
  id: string;
  productId: string;
  slug: string;
  productName: string;
  tagline: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  logoUrl: string | null;
  content: unknown;
  company: {
    name: string;
    logoUrl: string | null;
    customDomain?: string | null;
  };
};

export default function PreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const path = params.path as string[] | undefined;
  const slug = path?.[0];

  const langParam = searchParams.get("lang");
  const contentLocale: ContentLocale =
    langParam && /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,4})?$/.test(langParam) ? langParam : "en";

  const [doc, setDoc] = useState<CanvasDocument | null>(null);
  const [page, setPage] = useState<PreviewPage | null>(null);
  const [liveSeo, setLiveSeo] = useState<SeoSettingsValues | null>(null);
  const [screenEl, setScreenEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadData() {
      if (slug) {
        try {
          const fetched = await getPreviewPageBySlugAction(slug);
          if (fetched && fetched.content && (fetched.content as any).version) {
            setDoc(fetched.content as unknown as CanvasDocument);
            setPage(fetched as PreviewPage);
            setLiveSeo({
              productName: fetched.productName,
              tagline: fetched.tagline,
              metaDescription: fetched.metaDescription,
              ogImageUrl: fetched.ogImageUrl,
              logoUrl: fetched.logoUrl,
            });
            return;
          }
        } catch (error) {
          console.error("Failed to load preview from DB:", error);
        }
      }

      // Fallback: localStorage (editor's immediate preview)
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as CanvasDocument;
          if (parsed.version && parsed.artboards) {
            setDoc(parsed);
            return;
          }
        } catch {
          // Fall through to demo
        }
      }

      setDoc(productPromoTemplate.data);
    }

    loadData();
  }, [slug]);

  const publicUrl = useMemo(() => {
    if (!page) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/p/${page.slug}`;
  }, [page]);

  const domain = useMemo(() => {
    if (page?.company.customDomain) return page.company.customDomain;
    if (typeof window === "undefined") return "";
    return window.location.host;
  }, [page]);

  if (!doc) {
    return (
      <div className="flex h-screen items-center justify-center bg-(--ds-bg)">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--ds-border) border-t-blue-500" />
          <p className="text-sm text-(--ds-text-secondary)">Loading preview…</p>
        </div>
      </div>
    );
  }

  const editorHref = page ? `/editor?profileId=${page.id}` : "/editor";
  const headerTitle = liveSeo?.productName || doc.pageTitle || "Preview";
  const faviconUrl = liveSeo?.logoUrl || page?.logoUrl || page?.company.logoUrl || null;

  return (
    <div className="flex flex-col h-screen bg-(--ds-bg)">
      {/* Top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-(--ds-border) bg-(--ds-bg)/90 px-5 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard/products"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-(--ds-text-secondary) transition-colors hover:text-(--ds-text-primary)"
          >
            <ArrowLeft size={14} /> Products
          </Link>
          <span className="text-(--ds-border)">|</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-(--ds-text-muted)">
            Preview
          </span>
          <span className="text-(--ds-border)">·</span>
          <span className="truncate text-[13px] text-(--ds-text-primary)">{headerTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          {page && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-(--ds-border) bg-(--ds-surface) px-3 text-[12px] font-medium text-(--ds-text-primary) transition-colors hover:bg-(--ds-bg-hover)"
            >
              <ExternalLink size={12} /> Open live
            </a>
          )}
          <Link
            href={editorHref}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-(--ds-text-primary) px-3.5 text-[12px] font-semibold text-(--ds-bg) transition-opacity hover:opacity-90"
          >
            <Pencil size={12} /> Edit page
          </Link>
        </div>
      </div>

      {/* Body: mockup + SEO panel */}
      <div className="flex flex-1 min-h-0">
        {/* Mockup stage */}
        <div className="flex-1 min-w-0 relative bg-[radial-gradient(circle_at_center,var(--ds-surface-2)_0%,var(--ds-bg)_70%)]">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-6">
            <MobileMockup
              screenWidth={428}
              screenHeight={880}
              urlLabel={domain || "preview"}
              faviconUrl={faviconUrl}
              onScreenRef={setScreenEl}
            >
              <PreviewRenderer
                document={doc}
                contentLocale={contentLocale}
                productId={page?.productId}
                breakpoint="mobile"
                portalRoot={screenEl}
              />
            </MobileMockup>
          </div>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-(--ds-text-muted) pointer-events-none">
            Mobile preview · 428 × 880
          </p>
        </div>

        {/* SEO panel */}
        <aside className="w-[400px] shrink-0 border-l border-(--ds-border) bg-(--ds-surface)">
          {page && liveSeo ? (
            <SeoSettingsPanel
              profileId={page.id}
              initial={{
                productName: page.productName,
                tagline: page.tagline,
                metaDescription: page.metaDescription,
                ogImageUrl: page.ogImageUrl,
                logoUrl: page.logoUrl,
              }}
              publicUrl={publicUrl}
              domain={domain}
              onChange={setLiveSeo}
              onSaved={(values) => {
                setPage((prev) => (prev ? { ...prev, ...values } : prev));
              }}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
              <p className="text-[13px] font-semibold text-(--ds-text-primary)">
                Local preview
              </p>
              <p className="text-[12px] text-(--ds-text-secondary)">
                SEO &amp; sharing settings appear here once the page is saved.
              </p>
              <Link
                href="/dashboard/products"
                className="mt-3 inline-flex h-8 items-center rounded-md bg-(--ds-text-primary) px-3 text-[12px] font-semibold text-(--ds-bg) transition-opacity hover:opacity-90"
              >
                Choose a product
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
