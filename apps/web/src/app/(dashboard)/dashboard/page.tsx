"use client";

import Link from "next/link";
import { useAnalytics } from "@/hooks/use-analytics";
import { DashboardHeader } from "@/components/dashboard/header";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";

const DEVICE_LABEL: Record<string, string> = {
  MOBILE: "Mobile",
  TABLET: "Tablet",
  DESKTOP: "Desktop",
  UNKNOWN: "Unknown",
};

const STATUS_LABEL: Record<string, string> = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  RESPONDED: "Responded",
  CLOSED: "Closed",
};

export default function DashboardPage() {
  const { stats, loading } = useAnalytics();

  const fmt = (n: number) => n.toLocaleString();
  const pct = (n: number) => `${n.toFixed(n < 10 ? 2 : 1)}%`;
  const placeholder = loading ? "—" : null;

  const totalProducts = stats?.totalProducts ?? 0;
  const publishedProducts = stats?.publishedProducts ?? 0;
  const draftProducts = stats?.draftProducts ?? 0;
  const totalScans = stats?.totalQrLeads ?? 0;
  const feedbackCount = stats?.feedbackCount ?? 0;
  const scansLast7 = stats?.scansLast7Days ?? 0;
  const scansLast30 = stats?.scansLast30Days ?? 0;
  const feedbackLast30 = stats?.feedbackLast30Days ?? 0;
  const ratio = stats?.scanToFeedbackRatio ?? 0;
  const avgScansPerProduct = totalProducts > 0 ? totalScans / totalProducts : 0;
  const publishRate = totalProducts > 0 ? (publishedProducts / totalProducts) * 100 : 0;

  const deviceTotal = (stats?.deviceBreakdown ?? []).reduce((a, b) => a + b.count, 0);
  const topCountries = stats?.topCountries ?? [];
  const topProducts = stats?.topProducts ?? [];
  const feedbackByStatus = stats?.feedbackByStatus ?? [];

  return (
    <div className="page-content bg-(--ds-bg)">
      <DashboardHeader />

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:flex md:flex-row md:items-center md:justify-between gap-y-8 gap-x-4 mb-12 border-b border-(--ds-border) pb-8">
        <div className="flex flex-col">
          <p className="text-[13px] md:text-[14px] text-[#64748B] mb-2 md:mb-3">Total Products</p>
          <h2 className="text-[32px] md:text-[40px] font-medium text-(--ds-text-primary) leading-none tracking-tight">
            {placeholder ?? fmt(totalProducts)}
          </h2>
        </div>

        <div className="flex flex-col">
          <p className="text-[13px] md:text-[14px] text-[#64748B] mb-2 md:mb-3">Total QR Leads</p>
          <h2 className="text-[32px] md:text-[40px] font-medium text-(--ds-text-primary) leading-none tracking-tight">
            {placeholder ?? fmt(totalScans)}
          </h2>
        </div>

        <div className="flex flex-col">
          <p className="text-[13px] md:text-[14px] text-[#64748B] mb-2 md:mb-3">Avg. Visitor Duration</p>
          <h2 className="text-[32px] md:text-[40px] font-medium text-(--ds-text-primary) leading-none tracking-tight">
            1.25min
          </h2>
        </div>

        <div className="flex flex-col">
          <p className="text-[13px] md:text-[14px] text-[#64748B] mb-2 md:mb-3">Total Conversion</p>
          <h2 className="text-[32px] md:text-[40px] font-medium text-(--ds-text-primary) leading-none tracking-tight">
            2.5%
          </h2>
        </div>
      </div>

      {/* Secondary Stats */}
      <section className="mb-12">
        <h2 className="text-[22px] md:text-[24px] font-semibold text-(--ds-text-primary) mb-6 tracking-tight">Marketing Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-5">
            <p className="text-[13px] text-[#64748B] font-medium mb-2">Published</p>
            <h3 className="text-[28px] font-medium text-(--ds-text-primary) leading-none tracking-tight">
              {placeholder ?? fmt(publishedProducts)}
            </h3>
            <p className="text-[12px] text-[#64748B] mt-2">{placeholder ?? `${pct(publishRate)} of total`}</p>
          </div>
          <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-5">
            <p className="text-[13px] text-[#64748B] font-medium mb-2">Drafts</p>
            <h3 className="text-[28px] font-medium text-(--ds-text-primary) leading-none tracking-tight">
              {placeholder ?? fmt(draftProducts)}
            </h3>
            <p className="text-[12px] text-[#64748B] mt-2">Unpublished pages</p>
          </div>
          <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-5">
            <p className="text-[13px] text-[#64748B] font-medium mb-2">Scans · 7d</p>
            <h3 className="text-[28px] font-medium text-(--ds-text-primary) leading-none tracking-tight">
              {placeholder ?? fmt(scansLast7)}
            </h3>
            <p className="text-[12px] text-[#64748B] mt-2">{placeholder ?? `${fmt(scansLast30)} in 30d`}</p>
          </div>
          <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-5">
            <p className="text-[13px] text-[#64748B] font-medium mb-2">Avg scans / product</p>
            <h3 className="text-[28px] font-medium text-(--ds-text-primary) leading-none tracking-tight">
              {placeholder ?? avgScansPerProduct.toFixed(1)}
            </h3>
            <p className="text-[12px] text-[#64748B] mt-2">Across all products</p>
          </div>
          <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-5">
            <p className="text-[13px] text-[#64748B] font-medium mb-2">Feedback Received</p>
            <h3 className="text-[28px] font-medium text-(--ds-text-primary) leading-none tracking-tight">
              {placeholder ?? fmt(feedbackCount)}
            </h3>
            <p className="text-[12px] text-[#64748B] mt-2">{placeholder ?? `${fmt(feedbackLast30)} in last 30d`}</p>
          </div>
          <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-5">
            <p className="text-[13px] text-[#64748B] font-medium mb-2">Scan → Feedback</p>
            <h3 className="text-[28px] font-medium text-(--ds-text-primary) leading-none tracking-tight">
              {placeholder ?? pct(ratio)}
            </h3>
            <p className="text-[12px] text-[#64748B] mt-2">Conversion rate</p>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section>
        <h2 className="text-[22px] md:text-[24px] font-semibold text-(--ds-text-primary) mb-6 tracking-tight">Engagement</h2>
        <AnalyticsCharts stats={stats} />
      </section>

      {/* Top Products */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] md:text-[24px] font-semibold text-(--ds-text-primary) tracking-tight">Top Performing Products</h2>
          <Link href="/dashboard/products" className="text-[13px] text-[#0284c7] hover:underline">View all</Link>
        </div>
        <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-(--ds-border) text-[#64748B] font-medium">
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-right">Scans</th>
                <th className="py-3 px-4 text-right">Feedback</th>
                <th className="py-3 px-4 text-right">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-[#64748B]">Loading…</td></tr>
              ) : topProducts.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-[#64748B]">No scans recorded yet.</td></tr>
              ) : (
                topProducts.map((p) => (
                  <tr key={p.productId} className="border-b border-(--ds-border) last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-medium text-(--ds-text-primary)">{p.productName}</span>
                    </td>
                    <td className="py-3 px-4">
                      {p.isPublished ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#dcfce7] text-[#15803d]">Published</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-transparent border border-[#e2e8f0] dark:border-[#334155] text-(--ds-text-primary)">Draft</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-(--ds-text-primary)">{fmt(p.scans)}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-(--ds-text-primary)">{fmt(p.feedback)}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-(--ds-text-primary)">{pct(p.conversionRate)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Breakdowns */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device */}
        <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-6">
          <h3 className="text-lg font-semibold text-(--ds-text-primary) tracking-tight mb-1">Devices</h3>
          <p className="text-[13px] text-[#64748B] mb-5">How customers are scanning</p>
          {loading ? (
            <p className="text-[13px] text-[#64748B]">Loading…</p>
          ) : deviceTotal === 0 ? (
            <p className="text-[13px] text-[#64748B]">No device data yet.</p>
          ) : (
            <ul className="space-y-3">
              {(stats?.deviceBreakdown ?? []).map((d) => {
                const share = deviceTotal > 0 ? (d.count / deviceTotal) * 100 : 0;
                return (
                  <li key={d.device}>
                    <div className="flex items-center justify-between text-[13px] mb-1.5">
                      <span className="text-(--ds-text-primary) font-medium">{DEVICE_LABEL[d.device] ?? d.device}</span>
                      <span className="text-[#64748B] tabular-nums">{fmt(d.count)} · {pct(share)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-(--ds-border) rounded-full overflow-hidden">
                      <div className="h-full bg-[#0284c7]" style={{ width: `${share}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Geography */}
        <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-6">
          <h3 className="text-lg font-semibold text-(--ds-text-primary) tracking-tight mb-1">Top Countries</h3>
          <p className="text-[13px] text-[#64748B] mb-5">Geographic distribution of scans</p>
          {loading ? (
            <p className="text-[13px] text-[#64748B]">Loading…</p>
          ) : topCountries.length === 0 ? (
            <p className="text-[13px] text-[#64748B]">No geo data yet.</p>
          ) : (
            <ul className="space-y-3">
              {topCountries.map((c) => (
                <li key={c.country} className="flex items-center justify-between text-[13px]">
                  <span className="text-(--ds-text-primary) font-medium">{c.country}</span>
                  <span className="text-[#64748B] tabular-nums">{fmt(c.count)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Feedback Pipeline */}
        <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-6">
          <h3 className="text-lg font-semibold text-(--ds-text-primary) tracking-tight mb-1">Feedback Pipeline</h3>
          <p className="text-[13px] text-[#64748B] mb-5">Status of incoming feedback</p>
          {loading ? (
            <p className="text-[13px] text-[#64748B]">Loading…</p>
          ) : feedbackByStatus.length === 0 ? (
            <p className="text-[13px] text-[#64748B]">No feedback yet.</p>
          ) : (
            <ul className="space-y-3">
              {feedbackByStatus.map((s) => (
                <li key={s.status} className="flex items-center justify-between text-[13px]">
                  <span className="text-(--ds-text-primary) font-medium">{STATUS_LABEL[s.status] ?? s.status}</span>
                  <span className="text-[#64748B] tabular-nums">{fmt(s.count)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
