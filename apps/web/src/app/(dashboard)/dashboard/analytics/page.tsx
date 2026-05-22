"use client";

import { useAnalytics } from "@/hooks/use-analytics";
import { DashboardHeader } from "@/components/dashboard/header";
import { AnalyticsCharts, ProductBreakdownGrid } from "@/components/dashboard/analytics-charts";

export default function AnalyticsPage() {
  const { stats, loading } = useAnalytics();

  return (
    <div className="page-content bg-(--ds-bg)">
      <DashboardHeader />
      <section className="section mt-0!">
        <h2 className="text-xl font-bold text-(--ds-text-primary) mb-6 tracking-tight">Analytics Overview</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-5 shadow-xs">
            <p className="text-[13px] text-(--ds-text-secondary) font-medium mb-1">Total Products</p>
            <h2 className="text-3xl font-bold text-(--ds-text-primary)">
              {loading ? "—" : stats?.totalProducts ?? 0}
            </h2>
          </div>
          <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-5 shadow-xs">
            <p className="text-[13px] text-(--ds-text-secondary) font-medium mb-1">Published</p>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-500">
              {loading ? "—" : stats?.publishedProducts ?? 0}
            </h2>
          </div>
          <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-5 shadow-xs">
            <p className="text-[13px] text-(--ds-text-secondary) font-medium mb-1">Total QR Scans</p>
            <h2 className="text-3xl font-bold text-primary">
              {loading ? "—" : (stats?.totalQrLeads ?? 0).toLocaleString()}
            </h2>
          </div>
          <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-5 shadow-xs">
            <p className="text-[13px] text-(--ds-text-secondary) font-medium mb-1">Total Support Threads</p>
            <h2 className="text-3xl font-bold text-(--ds-text-primary)">
              {loading ? "—" : stats?.feedbackCount ?? 0}
            </h2>
          </div>
        </div>

        <AnalyticsCharts stats={stats} />

        <ProductBreakdownGrid stats={stats} />

      </section>
    </div>
  );
}
