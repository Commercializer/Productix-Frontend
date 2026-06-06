"use client";

import { useState, useEffect, useCallback } from "react";
import { getCompanyAnalyticsAction } from "@/lib/dashboard/actions";

export interface TimeSeriesPoint {
  date: string;
  scans: number;
  feedback: number;
}

export interface BreakdownEntry {
  label: string;
  count: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  slug: string;
  isPublished: boolean;
  scans: number;
  feedback: number;
  conversionRate: number;
  totalDurationMs: number | null;
  avgDurationMs: number | null;
}

export interface ProductBreakdown {
  productId: string;
  productName: string;
  slug: string;
  isPublished: boolean;
  scans: number;
  devices: { device: string; count: number }[];
  countries: { country: string; count: number }[];
  browsers: { browser: string; count: number }[];
  qrScans: { qrScanType: string; count: number }[];
}

export interface AnalyticsStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  totalQrLeads: number;
  feedbackCount: number;
  scansLast7Days: number;
  scansLast30Days: number;
  feedbackLast30Days: number;
  scanToFeedbackRatio: number;
  feedbackResolutionRate: number;
  ratedFeedbackRate: number;
  publishRate: number;
  resolvedFeedbackCount: number;
  ratedFeedbackCount: number;
  averageVisitorDurationMs: number | null;
  totalVisitorDurationMs: number | null;
  timeSeries: TimeSeriesPoint[];
  deviceBreakdown: { device: string; count: number }[];
  sourceBreakdown: { source: string; count: number }[];
  qrScanBreakdown: { qrScanType: string; count: number }[];
  topCountries: { country: string; count: number }[];
  feedbackByStatus: { status: string; count: number }[];
  topProducts: TopProduct[];
  productBreakdowns: ProductBreakdown[];
}

// `branchId` scopes scan + feedback metrics to a single branch; omit (or pass
// null) for company-wide totals. Changing it refetches.
export function useAnalytics(branchId?: string | null) {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCompanyAnalyticsAction(branchId ?? undefined);
      if (result.error) {
        throw new Error(result.error);
      }
      setStats((result.stats as AnalyticsStats | undefined) || null);
    } catch (err: any) {
      setError(err.message ?? "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }, [branchId]);

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
