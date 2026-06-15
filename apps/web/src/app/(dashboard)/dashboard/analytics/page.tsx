"use client";

import { useEffect, useState } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import { getBranchesAction } from "@/lib/dashboard/actions";
import { DashboardHeader } from "@/components/dashboard/header";
import { AnalyticsCharts, ProductBreakdownGrid } from "@/components/dashboard/analytics-charts";

interface BranchOption {
  id: string;
  name: string;
  city: string | null;
}

export default function AnalyticsPage() {
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [branchId, setBranchId] = useState<string>("");
  const { stats, loading } = useAnalytics(branchId || null);

  // Load the company's branches once to populate the filter. Companies with no
  // branches simply never see the selector.
  useEffect(() => {
    let cancelled = false;
    getBranchesAction().then((res) => {
      if (!cancelled && "items" in res && Array.isArray(res.items)) {
        setBranches(res.items.map((b) => ({ id: b.id, name: b.name, city: b.city })));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page-content bg-(--ds-bg)">
      <DashboardHeader />
      <section className="section mt-0!">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-(--ds-text-primary) tracking-tight">Analytics Overview</h2>
          {branches.length > 0 && (
            <label className="flex items-center gap-2 text-[13px] text-(--ds-text-secondary)">
              <span className="font-medium">Branch</span>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="h-9 px-3 pr-8 text-[13px] bg-(--ds-surface) border border-(--ds-border) rounded-lg text-(--ds-text-primary) focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
              >
                <option value="">All branches</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.city ? `${b.name} — ${b.city}` : b.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-5 shadow-xs">
            <p className="text-[13px] text-(--ds-text-secondary) font-medium mb-1">Total Products</p>
            <h2 className="text-3xl font-bold text-(--ds-text-primary)">
              {loading ? "-" : stats?.totalProducts ?? 0}
            </h2>
          </div>
          <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-5 shadow-xs">
            <p className="text-[13px] text-(--ds-text-secondary) font-medium mb-1">Published</p>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-500">
              {loading ? "-" : stats?.publishedProducts ?? 0}
            </h2>
          </div>
          <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-5 shadow-xs">
            <p className="text-[13px] text-(--ds-text-secondary) font-medium mb-1">Total QR Scans</p>
            <h2 className="text-3xl font-bold text-primary">
              {loading ? "-" : (stats?.totalQrLeads ?? 0).toLocaleString()}
            </h2>
          </div>
          <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-5 shadow-xs">
            <p className="text-[13px] text-(--ds-text-secondary) font-medium mb-1">Total Support Threads</p>
            <h2 className="text-3xl font-bold text-(--ds-text-primary)">
              {loading ? "-" : stats?.feedbackCount ?? 0}
            </h2>
          </div>
        </div>

        <AnalyticsCharts stats={stats} />

        <ProductBreakdownGrid
          stats={stats}
          branches={branches}
          selectedBranchId={branchId || undefined}
        />

      </section>
    </div>
  );
}
