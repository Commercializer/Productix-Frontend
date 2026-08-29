"use client";

import { useState, useEffect, useCallback } from "react";
import type { Gs1VerificationStatus, DppDisplayMode } from "@productix/db";
import {
  getMyPromptionsAction,
  deletePromptionAction as deleteAction,
  publishPageAction,
  unpublishPageAction,
  setSlugVisibleAction,
  updateSlugAction,
  updateRedirectAction,
  updateProductNameAction,
  updateProductGtinAction,
  refreshGtinVerificationAction,
  setPinLockAction,
  revealProductPinAction,
  updateDppDisplayModeAction,
} from "@/lib/dashboard/actions";

export interface Promption {
  id: string;
  slug: string;
  shortCode: string;
  slugVisible: boolean;
  productName: string;
  tagline: string | null;
  createdAt: string;
  updatedAt: string;
  productId: string;
  companyId: string;
  isPublished: boolean;
  publishedAt: string | null;
  logoUrl: string | null;
  metaDescription: string | null;
  redirectUrl: string | null;
  redirectEnabled: boolean;
  pinEnabled: boolean;
  hasPinCode: boolean;
  gtin: string | null;
  gtinStatus: Gs1VerificationStatus;
  gtinVerifiedAt: string | null;
  /** Raw response from the external GS1 verification API, captured at the
   * moment gtinStatus was set to GS1_VERIFIED. Null otherwise. */
  gtinData: Record<string, unknown> | null;
  /** What /01/{gtin} shows to visitors - GS1, DPP, or a toggle (BOTH). */
  dppDisplayMode: DppDisplayMode;
  hasDpp: boolean;
  companyCustomDomain: string | null;
  companyRequireValidGtin: boolean;
}

export function usePromptions() {
  const [promptions, setPromptions] = useState<Promption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPromptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMyPromptionsAction();
      setPromptions(result.items);
    } catch (err: any) {
      setError(err.message ?? "Failed to fetch promptions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromptions();
  }, [fetchPromptions]);

  const deletePromption = useCallback(
    async (id: string) => {
      const result = await deleteAction(id);
      if (result.error) return { error: result.error };
      setPromptions((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    },
    []
  );

  const publishPromption = useCallback(
    async (id: string) => {
      const result = await publishPageAction(id);
      if (result.error) return { error: result.error };
      setPromptions((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, isPublished: true, publishedAt: new Date().toISOString() }
            : p
        )
      );
      return { success: true, slug: result.slug };
    },
    []
  );

  const unpublishPromption = useCallback(
    async (id: string) => {
      const result = await unpublishPageAction(id);
      if (result.error) return { error: result.error };
      setPromptions((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isPublished: false } : p
        )
      );
      return { success: true };
    },
    []
  );

  const setSlugVisible = useCallback(
    async (productId: string, visible: boolean) => {
      // Optimistic update - the row updates instantly and rolls back on error.
      setPromptions((prev) => prev.map((p) => (p.productId === productId ? { ...p, slugVisible: visible } : p)));
      const result = await setSlugVisibleAction(productId, visible);
      if (result.error) {
        setPromptions((prev) => prev.map((p) => (p.productId === productId ? { ...p, slugVisible: !visible } : p)));
        return { error: result.error };
      }
      return { success: true };
    },
    []
  );

  const updateSlug = useCallback(
    async (profileId: string, slug: string) => {
      const result = await updateSlugAction(profileId, slug);
      if (result.error) return { error: result.error };
      if (result.success && result.slug) {
        setPromptions((prev) => prev.map((p) => (p.id === profileId ? { ...p, slug: result.slug! } : p)));
      }
      return { success: true, slug: result.slug };
    },
    []
  );

  const updateProductName = useCallback(
    async (profileId: string, productName: string) => {
      const result = await updateProductNameAction(profileId, productName);
      if (result.error) return { error: result.error };
      if (result.success && result.productName) {
        setPromptions((prev) =>
          prev.map((p) => (p.id === profileId ? { ...p, productName: result.productName! } : p)),
        );
      }
      return { success: true, productName: result.productName };
    },
    []
  );

  const updateProductGtin = useCallback(
    async (productId: string, gtin: string) => {
      const result = await updateProductGtinAction(productId, gtin);
      if (result.error) return { error: result.error };
      if (result.success && result.gtin && result.gtinStatus) {
        setPromptions((prev) =>
          prev.map((p) =>
            p.productId === productId
              ? {
                  ...p,
                  gtin: result.gtin!,
                  gtinStatus: result.gtinStatus!,
                  gtinVerifiedAt: new Date().toISOString(),
                  gtinData: result.gtinData ?? null,
                }
              : p,
          ),
        );
      }
      return { success: true, gtin: result.gtin, gtinStatus: result.gtinStatus };
    },
    []
  );

  const refreshGtinVerification = useCallback(
    async (productId: string) => {
      const result = await refreshGtinVerificationAction(productId);
      if (result.error) return { error: result.error };
      if (result.success && result.gtinStatus) {
        setPromptions((prev) =>
          prev.map((p) =>
            p.productId === productId
              ? {
                  ...p,
                  gtinStatus: result.gtinStatus!,
                  gtinData: result.gtinData ?? null,
                  gtinVerifiedAt: new Date().toISOString(),
                }
              : p,
          ),
        );
      }
      return { success: true, gtinStatus: result.gtinStatus, gtinData: result.gtinData };
    },
    []
  );

  const updateDppDisplayMode = useCallback(
    async (productId: string, mode: DppDisplayMode, previousMode: DppDisplayMode) => {
      // Optimistic update - rolls back to previousMode on error, same pattern as setSlugVisible.
      setPromptions((prev) => prev.map((p) => (p.productId === productId ? { ...p, dppDisplayMode: mode } : p)));
      const result = await updateDppDisplayModeAction(productId, mode);
      if (result.error) {
        setPromptions((prev) => prev.map((p) => (p.productId === productId ? { ...p, dppDisplayMode: previousMode } : p)));
        return { error: result.error };
      }
      return { success: true };
    },
    []
  );

  const updateRedirect = useCallback(
    async (profileId: string, redirectUrl: string | null, redirectEnabled: boolean) => {
      const result = await updateRedirectAction(profileId, redirectUrl, redirectEnabled);
      if (result.error) return { error: result.error };
      setPromptions((prev) =>
        prev.map((p) =>
          p.id === profileId
            ? { ...p, redirectUrl: result.redirectUrl ?? null, redirectEnabled: !!result.redirectEnabled }
            : p
        )
      );
      return { success: true, redirectUrl: result.redirectUrl ?? null, redirectEnabled: !!result.redirectEnabled };
    },
    []
  );

  const updatePinLock = useCallback(
    async (profileId: string, pin: string | null, pinEnabled: boolean) => {
      const result = await setPinLockAction(profileId, pin, pinEnabled);
      if (result.error) return { error: result.error };
      setPromptions((prev) =>
        prev.map((p) =>
          p.id === profileId
            ? { ...p, pinEnabled: !!result.pinEnabled, hasPinCode: result.hasPinCode ?? p.hasPinCode }
            : p
        )
      );
      return { success: true, pinEnabled: !!result.pinEnabled, hasPin: !!result.hasPin };
    },
    []
  );

  const revealPin = useCallback(
    async (profileId: string, password: string) => {
      return revealProductPinAction(profileId, password);
    },
    []
  );

  return {
    promptions,
    loading,
    error,
    refresh: fetchPromptions,
    deletePromption,
    publishPromption,
    unpublishPromption,
    setSlugVisible,
    updateSlug,
    updateRedirect,
    updateProductName,
    updateProductGtin,
    refreshGtinVerification,
    updatePinLock,
    revealPin,
    updateDppDisplayMode,
  };
}
