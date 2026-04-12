"use client";

import { useState, useEffect, useCallback } from "react";
import { getCompanyAnalyticsAction } from "@/lib/dashboard/actions";

export interface AnalyticsStats {
  totalProducts: number;
  publishedProducts: number;
  totalQrLeads: number;
  feedbackCount: number;
}

export function useAnalytics() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCompanyAnalyticsAction();
      if (result.error) {
        throw new Error(result.error);
      }
      setStats(result.stats || null);
    } catch (err: any) {
      setError(err.message ?? "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    stats,
    loading,
    error,
    refresh: fetchAnalytics,
  };
}
