"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getMyPromptionsAction,
  deletePromptionAction as deleteAction,
  publishPageAction,
  unpublishPageAction,
} from "@/lib/dashboard/actions";

export interface Promption {
  id: string;
  slug: string;
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

  return {
    promptions,
    loading,
    error,
    refresh: fetchPromptions,
    deletePromption,
    publishPromption,
    unpublishPromption,
  };
}
