"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { CanvasDocument } from "@productix/types";
import { EditRenderer, getTemplateById, createEmptyDocument } from "@productix/editor";
import {
  getPageContentAction,
  savePageContentAction,
  publishPageAction,
} from "@/lib/dashboard/actions";

export default function EditorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("template");
  const profileId = searchParams.get("profileId");
  const [initialDoc, setInitialDoc] = useState<CanvasDocument | null>(null);
  const [pageInfo, setPageInfo] = useState<{ slug: string; productName: string } | null>(null);

  useEffect(() => {
    // No profileId → redirect to create a product first
    if (!profileId) {
      router.replace("/dashboard/new");
      return;
    }

    async function loadDocument() {
      try {
        const result = await getPageContentAction(profileId!);
        if (result && "content" in result && result.content) {
          const contentObj = typeof result.content === "string" ? JSON.parse(result.content as string) : result.content;
          const content = contentObj as CanvasDocument;
          if (content.version && content.artboards) {
            setInitialDoc(content);
            setPageInfo({ slug: result.slug!, productName: result.productName! });
            return;
          }
        }
        // Profile exists but no saved content yet — start with empty or template
        if (result && "productName" in result) {
          setPageInfo({ slug: result.slug!, productName: result.productName! });
        }
      } catch {
        // Fall through
      }

      // If a template was requested, load it as starting point
      if (templateId) {
        const template = getTemplateById(templateId);
        if (template) {
          // Deep copy the template document so we don't accidentally mutate the static definition using Immer
          setInitialDoc(JSON.parse(JSON.stringify(template.data)));
          return;
        }
      }

      // Start with empty document
      setInitialDoc(createEmptyDocument());
    }

    loadDocument();
  }, [templateId, profileId, router]);

  const handleSave = useCallback(
    async (doc: CanvasDocument) => {
      if (!profileId) return;

      try {
        const result = await savePageContentAction(
          profileId,
          doc as unknown as Record<string, unknown>
        );

        showNotification(
          result.success
            ? "✓ Page saved successfully"
            : `✗ Save failed: ${result.error}`
        );
      } catch {
        showNotification("✗ Save failed — check your connection");
      }
    },
    [profileId]
  );

  const handlePublish = useCallback(
    async (doc: CanvasDocument) => {
      if (!profileId) return;

      try {
        // ALWAYS save the latest page content before publishing
        await savePageContentAction(
          profileId,
          doc as unknown as Record<string, unknown>
        );

        const result = await publishPageAction(profileId);
        showNotification(
          result.success
            ? "✓ Page published successfully"
            : `✗ Publish failed: ${result.error}`
        );
      } catch {
        showNotification("✗ Publish failed — check your connection");
      }
    },
    [profileId]
  );

  if (!initialDoc) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          <p className="text-sm text-gray-500">Loading from database...</p>
        </div>
      </div>
    );
  }

  return (
    <EditRenderer
      initialDocument={initialDoc}
      onSave={handleSave}
      onPublish={handlePublish}
      previewSlug={pageInfo?.slug}
    />
  );
}

function showNotification(message: string) {
  const isError = message.startsWith("✗");
  const notification = document.createElement("div");
  notification.className = `fixed bottom-6 right-6 z-[9999] rounded-lg px-5 py-3 text-sm font-medium text-white shadow-lg ${
    isError ? "bg-red-600" : "bg-emerald-600"
  }`;
  notification.style.animation = "fadeIn 0.2s ease";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 2500);
}
