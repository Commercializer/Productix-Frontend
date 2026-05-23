"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Edit a specific promption.
 * Redirects to the editor with the profile ID.
 * Only redirects if `id` is a valid UUID - prevents sidebar links
 * like /dashboard/products from being caught here.
 */
export default function EditPromptionPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const isValidUUID = UUID_RE.test(id);

  useEffect(() => {
    if (isValidUUID) {
      router.replace(`/editor?profileId=${id}`);
    }
  }, [id, isValidUUID, router]);

  if (!isValidUUID) {
    return (
      <div className="page-content bg-(--ds-bg) flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-(--ds-text-primary) mb-2">Page Not Found</h2>
          <p className="text-(--ds-text-secondary) text-sm">
            The page <code className="px-1.5 py-0.5 rounded bg-(--ds-surface) border border-(--ds-border) text-[12px]">/dashboard/{id}</code> does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-loading">
      <div className="app-spinner" />
      <p className="loading-text">Opening editor…</p>
    </div>
  );
}
