"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { AnalyticsStats } from "@/hooks/use-analytics";

const SOURCE_LABEL: Record<string, string> = {
  ON_PACKAGE: "On Package",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  TWITTER: "Twitter",
  LINKEDIN: "LinkedIn",
  YOUTUBE: "YouTube",
  TIKTOK: "TikTok",
  EMAIL: "Email",
  SMS: "SMS",
  OTHER: "Other",
  UNKNOWN: "Unknown",
};

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function AnalyticsCharts({ stats }: { stats: AnalyticsStats | null }) {
  const timeSeries = (stats?.timeSeries ?? []).map((p) => ({
    ...p,
    name: formatDateLabel(p.date),
  }));

  const sourceData = (stats?.sourceBreakdown ?? [])
    .map((s) => ({ name: SOURCE_LABEL[s.source] ?? s.source, value: s.count }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
      {/* Main Area Chart */}
      <div className="lg:col-span-2 bg-(--ds-surface) border border-(--ds-border) rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-(--ds-text-primary) tracking-tight mb-1">Engagement Overview</h3>
            <p className="text-[13px] text-[#64748B]">Scans & feedback over the last 30 days</p>
          </div>
        </div>
        <div className="h-[320px] w-full">
          {timeSeries.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[13px] text-[#64748B]">
              No engagement data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFeedback" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ds-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} dy={10} interval="preserveStartEnd" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "12px", fontSize: "13px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  itemStyle={{ color: "var(--ds-text-primary)", fontWeight: 500 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey="scans" name="Scans" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" />
                <Area type="monotone" dataKey="feedback" name="Feedback" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorFeedback)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Side Bar Chart */}
      <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-6 shadow-xs">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-(--ds-text-primary) tracking-tight mb-1">Acquisition Sources</h3>
          <p className="text-[13px] text-[#64748B]">Where scans came from</p>
        </div>
        <div className="h-[320px] w-full">
          {sourceData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[13px] text-[#64748B]">
              No source data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ds-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748B" }} dy={10} interval={0} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
                <Tooltip
                  cursor={{ fill: "var(--ds-border)", opacity: 0.3 }}
                  contentStyle={{ backgroundColor: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "12px", fontSize: "13px" }}
                  itemStyle={{ color: "var(--ds-text-primary)", fontWeight: 500 }}
                />
                <Bar dataKey="value" name="Scans" fill="#0284c7" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
