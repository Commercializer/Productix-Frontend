"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTheme } from "next-themes";
import { ProductDetailModal } from "@/components/dashboard/product-detail-modal";
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

function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";
  return {
    scansStroke: isDark ? "#e2e8f0" : "#0f172a",
    feedbackStroke: "#0284c7",
    axisTick: isDark ? "#a1a1aa" : "#64748B",
    tooltipBg: isDark ? "#0F2230" : "#ffffff",
    tooltipBorder: isDark ? "rgba(255,255,255,0.1)" : "#f1f5f9",
    tooltipText: isDark ? "#ededed" : "#0f172a",
    grid: isDark ? "rgba(255,255,255,0.1)" : "#f1f5f9",
  };
}

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

const QR_SCAN_TYPE_LABEL: Record<string, string> = {
  ON_PACK: "On Pack",
  LINK: "Link",
  SOCIAL: "Social",
  UNTAGGED: "Untagged",
};

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function AnalyticsCharts({ stats }: { stats: AnalyticsStats | null }) {
  const chartTheme = useChartTheme();
  const timeSeries = (stats?.timeSeries ?? []).map((p) => ({
    ...p,
    name: formatDateLabel(p.date),
  }));

  const sourceData = (stats?.sourceBreakdown ?? [])
    .map((s) => ({ name: SOURCE_LABEL[s.source] ?? s.source, value: s.count }))
    .sort((a, b) => b.value - a.value);

  const countryData = (stats?.topCountries ?? []).slice(0, 5);
  const countryTotal = countryData.reduce((sum, c) => sum + c.count, 0);

  const qrScanData = (stats?.qrScanBreakdown ?? []).map((q) => ({
    name: QR_SCAN_TYPE_LABEL[q.qrScanType] ?? q.qrScanType,
    count: q.count,
  }));
  const qrScanTotal = qrScanData.reduce((sum, q) => sum + q.count, 0);

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
            <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 1, height: 1 }}>
              <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartTheme.scansStroke} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={chartTheme.scansStroke} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFeedback" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartTheme.feedbackStroke} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={chartTheme.feedbackStroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTheme.axisTick }} dy={10} interval="preserveStartEnd" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTheme.axisTick }} />
                <Tooltip
                  contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: "12px", fontSize: "13px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  itemStyle={{ color: chartTheme.tooltipText, fontWeight: 500 }}
                  labelStyle={{ color: chartTheme.tooltipText }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "13px", paddingTop: "10px", color: chartTheme.tooltipText }} />
                <Area type="monotone" dataKey="scans" name="Scans" stroke={chartTheme.scansStroke} strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" />
                <Area type="monotone" dataKey="feedback" name="Feedback" stroke={chartTheme.feedbackStroke} strokeWidth={2} fillOpacity={1} fill="url(#colorFeedback)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Side panel - Acquisition Sources split between QR type, referrer, country */}
      <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-(--ds-text-primary) tracking-tight mb-1">Acquisition Sources</h3>
          <p className="text-[13px] text-[#64748B]">QR surface, referrers, and countries</p>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-medium mb-2">By QR type</p>
            {qrScanData.length === 0 ? (
              <p className="text-[12px] text-[#64748B]">No QR scan data yet.</p>
            ) : (
              <ul className="space-y-2">
                {qrScanData.map((q) => {
                  const pct = qrScanTotal > 0 ? (q.count / qrScanTotal) * 100 : 0;
                  return (
                    <li key={q.name} className="space-y-1">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-medium text-(--ds-text-primary)">{q.name}</span>
                        <span className="text-[#64748B] tabular-nums">
                          {q.count.toLocaleString()}
                          <span className="text-[#94a3b8] ml-1.5">({pct.toFixed(0)}%)</span>
                        </span>
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

          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-medium mb-2">By referrer</p>
            <div className="h-[140px] w-full">
              {sourceData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[13px] text-[#64748B]">No source data yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 1, height: 1 }}>
                  <BarChart data={sourceData} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: chartTheme.axisTick }} dy={6} interval={0} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: chartTheme.axisTick }} />
                    <Tooltip
                      cursor={{ fill: chartTheme.grid, opacity: 0.3 }}
                      contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: "12px", fontSize: "13px" }}
                      itemStyle={{ color: chartTheme.tooltipText, fontWeight: 500 }}
                      labelStyle={{ color: chartTheme.tooltipText }}
                    />
                    <Bar dataKey="value" name="Scans" fill={chartTheme.feedbackStroke} radius={[4, 4, 0, 0]} barSize={24} />
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
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<{
    productId: string;
    productName: string;
    slug: string;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.productName.toLowerCase().includes(q) ||
        (p.slug || "").toLowerCase().includes(q),
    );
  }, [products, query]);

  // Pad each breakdown section to the max row-count across all products so
  // every card has identical structure — headers and rows line up across the
  // grid, no matter how sparse an individual product's data is.
  const minRows = useMemo(() => {
    let qr = 0, devices = 0, countries = 0, browsers = 0;
    for (const p of products) {
      if (p.qrScans.length > qr) qr = p.qrScans.length;
      if (p.devices.length > devices) devices = p.devices.length;
      if (p.countries.length > countries) countries = p.countries.length;
      if (p.browsers.length > browsers) browsers = p.browsers.length;
    }
    return {
      qr: Math.max(qr, 1),
      devices: Math.max(devices, 1),
      countries: Math.max(countries, 1),
      browsers: Math.max(browsers, 1),
    };
  }, [products]);

  if (products.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-(--ds-text-primary) tracking-tight">Product breakdown</h3>
          <p className="text-[13px] text-[#64748B]">
            {query
              ? `${filtered.length} of ${products.length} products`
              : `${products.length} ${products.length === 1 ? "product" : "products"} - device, country, and browser splits`}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8] pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full h-9 pl-9 pr-3 text-[13px] bg-(--ds-surface) border border-(--ds-border) rounded-lg text-(--ds-text-primary) placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-8 text-center text-[13px] text-[#64748B]">
          No products match &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <button
              key={p.productId}
              type="button"
              onClick={() =>
                setSelected({ productId: p.productId, productName: p.productName, slug: p.slug })
              }
              className="h-full text-left bg-(--ds-surface) border border-(--ds-border) rounded-xl p-4 shadow-xs hover:border-primary/50 hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <header className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-[14px] font-semibold text-(--ds-text-primary) truncate leading-tight">{p.productName}</h4>
                  <p className="text-[11px] text-[#94a3b8] truncate">{formatSlug(p.slug)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] uppercase tracking-wider text-[#94a3b8] leading-none">Scans</p>
                  <p className="text-lg font-bold text-(--ds-text-primary) tabular-nums leading-tight">{p.scans.toLocaleString()}</p>
                </div>
              </header>

              <div className="grid grid-cols-2 gap-x-4">
                <div className="space-y-3">
                  <BreakdownRow label="QR Source" minRows={minRows.qr} items={p.qrScans.map((q) => ({ key: QR_SCAN_TYPE_LABEL[q.qrScanType] ?? q.qrScanType, count: q.count }))} />
                  <BreakdownRow label="Countries" minRows={minRows.countries} items={p.countries.map((c) => ({ key: formatCountry(c.country), count: c.count }))} />
                </div>
                <div className="space-y-3">
                  <BreakdownRow label="Devices" minRows={minRows.devices} items={p.devices.map((d) => ({ key: DEVICE_LABEL[d.device] ?? d.device, count: d.count }))} />
                  <BreakdownRow label="Browsers" minRows={minRows.browsers} items={p.browsers.map((b) => ({ key: b.browser, count: b.count }))} />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      <ProductDetailModal
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
        productId={selected?.productId ?? null}
        productName={selected?.productName ?? ""}
        slug={selected?.slug ?? ""}
      />
    </section>
  );
}

const DEVICE_LABEL: Record<string, string> = {
  MOBILE: "Mobile",
  TABLET: "Tablet",
  DESKTOP: "Desktop",
  UNKNOWN: "Unknown",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function formatSlug(slug: string) {
  if (!slug) return "-";
  return UUID_RE.test(slug) ? slug.slice(0, 8) : slug;
}

function BreakdownRow({ label, items, minRows = 1 }: { label: string; items: { key: string; count: number }[]; minRows?: number }) {
  const total = items.reduce((sum, i) => sum + i.count, 0);
  const rowCount = Math.max(items.length, minRows);
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-medium mb-1">{label}</p>
      <ul className="space-y-1">
        {Array.from({ length: rowCount }).map((_, idx) => {
          const item = items[idx];
          const showNoData = !item && idx === 0 && items.length === 0;
          const invisible = !item && !showNoData;
          const pct = item && total > 0 ? (item.count / total) * 100 : 0;
          return (
            <li
              key={item?.key ?? `placeholder-${idx}`}
              className={`min-w-0 ${invisible ? "invisible" : ""}`}
              aria-hidden={invisible || undefined}
            >
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className={`truncate ${showNoData ? "text-[#94a3b8] italic" : "text-(--ds-text-primary)"}`}>
                  {item?.key ?? (showNoData ? "No data" : " ")}
                </span>
                <span className="text-[#64748B] tabular-nums shrink-0">
                  {item ? item.count.toLocaleString() : " "}
                </span>
              </div>
              <div className="h-0.5 rounded-full bg-(--ds-border) overflow-hidden mt-0.5">
                <div className="h-full bg-primary rounded-full" style={{ width: item ? `${pct}%` : "0%" }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
