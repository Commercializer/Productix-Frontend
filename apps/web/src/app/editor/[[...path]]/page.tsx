"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { CanvasDocument } from "@productix/types";
import { EditRenderer, getTemplateById, createEmptyDocument } from "@productix/editor";

const STORAGE_KEY = "productix-canvas-data";

export default function EditorPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const [initialDoc, setInitialDoc] = useState<CanvasDocument | null>(null);

  useEffect(() => {
    // 1. Check for template
    if (templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        setInitialDoc(template.data);
        return;
      }
    }

    // 2. Try to load from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CanvasDocument;
        if (parsed.version && parsed.artboards) {
          setInitialDoc(parsed);
          return;
        }
      } catch {
        // Invalid — fall through to empty
      }
    }

    // 3. Start with empty document
    setInitialDoc(createEmptyDocument());
  }, [templateId]);

  const handleSave = useCallback((doc: CanvasDocument) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));

    // Show notification
    const notification = document.createElement("div");
    notification.className =
      "fixed bottom-6 right-6 z-[9999] rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-lg";
    notification.style.animation = "fadeIn 0.2s ease";
    notification.textContent = "✓ Page saved successfully";
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transition = "opacity 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }, []);

  if (!initialDoc) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          <p className="text-sm text-gray-500">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <EditRenderer
      initialDocument={initialDoc}
      onSave={handleSave}
    />
  );
}
