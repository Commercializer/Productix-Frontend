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
import { formatCountry } from "@/lib/format-country";

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

  const countryData = (stats?.topCountries ?? []).slice(0, 5);
  const countryTotal = countryData.reduce((sum, c) => sum + c.count, 0);

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

      {/* Side panel — Acquisition Sources split between referrer + country */}
      <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-(--ds-text-primary) tracking-tight mb-1">Acquisition Sources</h3>
          <p className="text-[13px] text-[#64748B]">Referrers and visitor countries</p>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-medium mb-2">By referrer</p>
            <div className="h-[140px] w-full">
              {sourceData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[13px] text-[#64748B]">No source data yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceData} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ds-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748B" }} dy={6} interval={0} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                    <Tooltip
                      cursor={{ fill: "var(--ds-border)", opacity: 0.3 }}
                      contentStyle={{ backgroundColor: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "12px", fontSize: "13px" }}
                      itemStyle={{ color: "var(--ds-text-primary)", fontWeight: 500 }}
                    />
                    <Bar dataKey="value" name="Scans" fill="#0284c7" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-medium mb-2">Top countries</p>
            {countryData.length === 0 ? (
              <div className="h-[120px] flex items-center justify-center text-[13px] text-[#64748B]">No country data yet.</div>
            ) : (
              <ul className="space-y-2">
                {countryData.map((c) => {
                  const pct = countryTotal > 0 ? (c.count / countryTotal) * 100 : 0;
                  return (
                    <li key={c.country} className="space-y-1">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-medium text-(--ds-text-primary)">{formatCountry(c.country)}</span>
                        <span className="text-[#64748B] tabular-nums">{c.count.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-(--ds-border) overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductBreakdownGrid({ stats }: { stats: AnalyticsStats | null }) {
  const products = stats?.productBreakdowns ?? [];
  if (products.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-(--ds-text-primary) tracking-tight">Product breakdown</h3>
        <p className="text-[13px] text-[#64748B]">Top {products.length} products — device, country, and browser splits</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((p) => (
          <article key={p.productId} className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-5 shadow-xs">
            <header className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-[15px] font-semibold text-(--ds-text-primary) truncate">{p.productName}</h4>
                <p className="text-[11px] text-[#94a3b8] truncate">{p.slug || "—"}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] uppercase tracking-wider text-[#94a3b8]">Scans</p>
                <p className="text-xl font-bold text-(--ds-text-primary) tabular-nums">{p.scans.toLocaleString()}</p>
              </div>
            </header>

            <BreakdownRow label="Devices" items={p.devices.map((d) => ({ key: DEVICE_LABEL[d.device] ?? d.device, count: d.count }))} />
            <BreakdownRow label="Countries" items={p.countries.map((c) => ({ key: formatCountry(c.country), count: c.count }))} />
            <BreakdownRow label="Browsers" items={p.browsers.map((b) => ({ key: b.browser, count: b.count }))} />
          </article>
        ))}
      </div>
    </section>
  );
}

const DEVICE_LABEL: Record<string, string> = {
  MOBILE: "Mobile",
  TABLET: "Tablet",
  DESKTOP: "Desktop",
  UNKNOWN: "Unknown",
};

function BreakdownRow({ label, items }: { label: string; items: { key: string; count: number }[] }) {
  const total = items.reduce((sum, i) => sum + i.count, 0);
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-medium mb-1.5">{label}</p>
      {items.length === 0 ? (
        <p className="text-[12px] text-[#64748B]">No data</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((i) => {
            const pct = total > 0 ? (i.count / total) * 100 : 0;
            return (
              <li key={i.key}>
                <div className="flex items-center justify-between text-[12px] mb-0.5">
                  <span className="text-(--ds-text-primary)">{i.key}</span>
                  <span className="text-[#64748B] tabular-nums">{i.count.toLocaleString()}</span>
                </div>
                <div className="h-1 rounded-full bg-(--ds-border) overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
