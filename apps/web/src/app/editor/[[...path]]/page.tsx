"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { CanvasDocument } from "@productix/types";
import { EditRenderer, getTemplateById, createEmptyDocument } from "@productix/editor";
import {
  getPageContentAction,
  savePageContentAction,
  publishPageAction,
  exportProductixFileAction,
  importProductixFileAction,
} from "@/lib/dashboard/actions";
import { SeoSettingsModal } from "@/components/dashboard/seo-settings-modal";
import { VersionHistoryModal } from "@/components/dashboard/version-history-modal";

export default function EditorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("template");
  const profileId = searchParams.get("profileId");
  const [initialDoc, setInitialDoc] = useState<CanvasDocument | null>(null);
  const [pageInfo, setPageInfo] = useState<{ slug: string; productName: string } | null>(null);
  const [seoOpen, setSeoOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

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
        // Profile exists but no saved content yet - start with empty or template
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
        showNotification("✗ Save failed - check your connection");
      }
    },
    [profileId]
  );

  const handleExportFile = useCallback(
    async (doc: CanvasDocument) => {
      if (!profileId) return;
      try {
        // Save first so the export reflects what's currently in the editor,
        // then ask the server to encrypt the latest content from the DB.
        await savePageContentAction(
          profileId,
          doc as unknown as Record<string, unknown>
        );
        const result = await exportProductixFileAction(profileId);
        if (!result.success || !result.fileContent) {
          showNotification(`✗ Export failed: ${"error" in result ? result.error : "unknown error"}`);
          return;
        }
        const blob = new Blob([result.fileContent], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showNotification("✓ Exported .productix file");
      } catch (err: any) {
        showNotification(`✗ Export failed: ${err?.message ?? "check your connection"}`);
      }
    },
    [profileId]
  );

  const handleImportFile = useCallback(
    async (fileContent: string): Promise<CanvasDocument> => {
      const result = await importProductixFileAction(fileContent);
      if (!result.success || !result.document) {
        const message = "error" in result && result.error ? result.error : "Invalid .productix file";
        showNotification(`✗ Import failed: ${message}`);
        throw new Error(message);
      }
      showNotification("✓ Imported — remember to Save to apply to this page");
      return result.document as unknown as CanvasDocument;
    },
    []
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
        showNotification("✗ Publish failed - check your connection");
      }
    },
    [profileId]
  );

  if (!initialDoc) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ background: "linear-gradient(180deg,#f8fafc 0%,#eef3f9 100%)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex items-center justify-center"
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
              border: "1px solid rgba(2,132,199,0.12)",
              boxShadow: "0 4px 14px rgba(2,132,199,0.12)",
            }}
          >
            <img src="/productix-logo.png" alt="Productix" width={28} height={26} />
          </div>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#bae6fd] border-t-[#0284c7]" />
          <p className="text-sm font-medium" style={{ color: "#475569" }}>
            Preparing your editor…
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <EditRenderer
        initialDocument={initialDoc}
        profileId={profileId ?? undefined}
        onSave={handleSave}
        onPublish={handlePublish}
        onExportFile={handleExportFile}
        onImportFile={handleImportFile}
        previewSlug={pageInfo?.slug}
        onEditSeo={profileId ? () => setSeoOpen(true) : undefined}
        onViewHistory={profileId ? () => setHistoryOpen(true) : undefined}
      />
      {seoOpen && profileId && (
        <SeoSettingsModal
          profileId={profileId}
          slug={pageInfo?.slug}
          onClose={() => setSeoOpen(false)}
        />
      )}
      {historyOpen && profileId && (
        <VersionHistoryModal
          profileId={profileId}
          slug={pageInfo?.slug}
          onClose={() => setHistoryOpen(false)}
          // Reload so the editor's in-memory canvas reflects the restored content
          // (otherwise the next save would overwrite the restore).
          onRestored={() => {
            showNotification("✓ Version restored — reloading editor");
            setTimeout(() => window.location.reload(), 600);
          }}
        />
      )}
    </>
  );
}

function showNotification(message: string) {
  const isError = message.startsWith("✗");
  const notification = document.createElement("div");
  notification.className = `fixed bottom-6 right-6 z-9999 rounded-lg px-5 py-3 text-sm font-medium text-white shadow-lg ${
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
