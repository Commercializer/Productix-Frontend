"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { CanvasDocument } from "@productix/types";
import { PreviewRenderer, productPromoTemplate } from "@productix/editor";

const STORAGE_KEY = "productix-canvas-data";

export default function PreviewPage() {
  const [doc, setDoc] = useState<CanvasDocument | null>(null);

  useEffect(() => {
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

    // No saved data — use demo template
    setDoc(productPromoTemplate.data);
  }, []);

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
      <div className="sticky top-0 z-50 flex h-12 items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur-xl flex-shrink-0">
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
            className="inline-flex h-8 items-center rounded-md bg-blue-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Edit Page
          </Link>
        </div>
      </div>

      {/* Preview with viewport controls */}
      <div className="flex-1 min-h-0">
        <PreviewRenderer document={doc} showControls className="h-full" />
      </div>
    </div>
  );
}
