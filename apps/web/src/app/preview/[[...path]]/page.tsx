"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import type { CanvasDocument } from "@productix/types";
import type { ContentLocale } from "@productix/types";
import { PreviewRenderer, productPromoTemplate } from "@productix/editor";
import { getPreviewPageBySlugAction } from "@/lib/dashboard/actions";

const STORAGE_KEY = "productix-canvas-data";

export default function PreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const path = params.path as string[] | undefined;
  const slug = path?.[0];

  // Read ?lang=<code> from URL, default to "en"
  const langParam = searchParams.get("lang");
  const contentLocale: ContentLocale = langParam && /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,4})?$/.test(langParam) ? langParam : "en";

  const [doc, setDoc] = useState<CanvasDocument | null>(null);
  const [productId, setProductId] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadData() {
      // 1. If we have a slug from the URL (/preview/[slug]), fetch from DB
      if (slug) {
        try {
          const page = await getPreviewPageBySlugAction(slug);
          if (page && page.content && (page.content as any).version) {
            setDoc(page.content as unknown as CanvasDocument);
            setProductId(page.productId);
            return;
          }
        } catch (error) {
          console.error("Failed to load preview from DB:", error);
        }
      }

      // 2. Fallback to localStorage (used by the Editor's immediate preview)
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

      // 3. No saved data — use demo template
      setDoc(productPromoTemplate.data);
    }

    loadData();
  }, [slug]);

  if (!doc) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          <p className="text-sm text-gray-500">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top bar */}
      <div className="sticky top-0 z-50 flex h-12 items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            ← Dashboard
          </Link>
          <span className="text-xs text-gray-300">|</span>
          <span className="text-xs font-medium text-gray-400">Preview Mode</span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">{doc.pageTitle}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/editor"
            className="inline-flex h-8 items-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            Edit Page
          </Link>
        </div>
      </div>

      {/* Preview with viewport controls */}
      <div className="flex-1 min-h-0">
        <PreviewRenderer document={doc} showControls className="h-full" contentLocale={contentLocale} productId={productId} />
      </div>
    </div>
  );
}
