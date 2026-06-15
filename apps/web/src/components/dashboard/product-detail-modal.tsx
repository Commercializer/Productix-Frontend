"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getProductAnalyticsAction,
  type ProductAnalyticsRange,
} from "@/lib/dashboard/actions";
import { formatCountry } from "@/lib/format-country";

function useModalChartTheme() {
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

type Bucket = "day" | "month";

interface ProductAnalyticsData {
  bucket: Bucket;
  range: ProductAnalyticsRange;
  timeSeries: { date: string; scans: number; feedback: number }[];
  rangeScans: number;
  rangeFeedback: number;
  rangeConversion: number;
  totalScans: number;
  totalFeedback: number;
  totalDurationMs: number | null;
  avgDurationMs: number | null;
  devices: { device: string; count: number }[];
  countries: { country: string; count: number }[];
  browsers: { browser: string; count: number }[];
  sources: { source: string; count: number }[];
  qrScanTypes: { qrScanType: string; count: number }[];
  branches: { branch: string; count: number }[];
}

interface BranchOption {
  id: string;
  name: string;
  city: string | null;
}

const DEVICE_LABEL: Record<string, string> = {
  MOBILE: "Mobile",
  TABLET: "Tablet",
  DESKTOP: "Desktop",
  UNKNOWN: "Unknown",
};

const QR_SCAN_TYPE_LABEL: Record<string, string> = {
  ON_PACK: "On Pack",
  LINK: "Link",
  SOCIAL: "Social",
  UNTAGGED: "Untagged",
};

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

const RANGES: ReadonlyArray<{ id: ProductAnalyticsRange; label: string }> = [
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
  { id: "lifetime", label: "Lifetime" },
];

// Average active time-on-page. Sub-minute shows as seconds; otherwise minutes
// with 2 decimals (e.g. "1.25min"). Mirrors the dashboard overview formatting.
function formatAvgDuration(ms: number | null | undefined) {
  if (!ms || ms < 1000) return "—";
  const seconds = ms / 1000;
  return seconds < 60 ? `${Math.round(seconds)}s` : `${(seconds / 60).toFixed(2)}min`;
}

// Total active time-on-page summed across visits. Scales up to hours/days.
function formatTotalDuration(ms: number | null | undefined) {
  if (!ms || ms < 1000) return "—";
  const seconds = ms / 1000;
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes.toFixed(1)}min`;
  const hours = minutes / 60;
  if (hours < 24) return `${hours.toFixed(1)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}

function formatLabel(value: string, bucket: Bucket) {
  if (bucket === "day") {
    const d = new Date(value);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  const [yStr, mStr] = value.split("-");
  const y = Number(yStr);
  const m = Number(mStr) || 1;
  const d = new Date(Date.UTC(y, m - 1, 1));
  return d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  productName: string;
  slug: string;
  branches?: BranchOption[];
  defaultBranchId?: string;
}

export function ProductDetailModal({
  isOpen,
  onClose,
  productId,
  productName,
  slug,
  branches = [],
  defaultBranchId,
}: ProductDetailModalProps) {
  const [range, setRange] = useState<ProductAnalyticsRange>("monthly");
  const [branchId, setBranchId] = useState<string>(defaultBranchId ?? "");
  const [data, setData] = useState<ProductAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chartTheme = useModalChartTheme();

  // On open (or when switching products), reset the range and inherit the
  // page-level branch filter so the popup opens scoped to the same context.
  useEffect(() => {
    if (isOpen) {
      setRange("monthly");
      setBranchId(defaultBranchId ?? "");
    }
  }, [isOpen, productId, defaultBranchId]);

  useEffect(() => {
    if (!isOpen || !productId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProductAnalyticsAction(productId, range, branchId || undefined)
      .then((res) => {
        if (cancelled) return;
        if (res.error) {
          setError(res.error);
          setData(null);
        } else if (res.success && res.data) {
          setData(res.data as ProductAnalyticsData);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message ?? "Failed to load analytics");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, productId, range, branchId]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !productId) return null;

  const chartData = (data?.timeSeries ?? []).map((p) => ({
    ...p,
    name: formatLabel(p.date, data?.bucket ?? "day"),
  }));

  return (
    <>
      <div
        className="fixed inset-0 z-9998 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease" }}
      />
      <div
        className="fixed inset-0 z-9999 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[920px] max-h-[90vh] overflow-y-auto rounded-2xl bg-(--ds-surface) shadow-2xl border border-(--ds-border)"
          onClick={(e) => e.stopPropagation()}
          style={{ animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-(--ds-border)">
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-(--ds-text-primary) truncate">
                {productName}
              </h3>
              {slug ? (
                <a
                  href={`/p/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-0.5 text-[12px] text-[#64748b] hover:text-primary transition-colors"
                >
                  /p/{slug}
                  <ExternalLink size={11} />
                </a>
              ) : (
                <p className="text-[12px] text-[#94a3b8] mt-0.5">No slug</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-(--ds-text-primary) hover:bg-(--ds-border)/50 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 pt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex gap-1 p-1 rounded-xl bg-(--ds-bg) border border-(--ds-border)">
              {RANGES.map(({ id, label }) => {
                const active = range === id;
                return (
                  <button
                    key={id}
                    onClick={() => setRange(id)}
                    className={`h-8 px-3 rounded-lg text-[12px] font-medium transition-all ${
                      active
                        ? "bg-(--ds-surface) text-(--ds-text-primary) shadow-xs border border-(--ds-border)"
                        : "text-[#64748b] hover:text-(--ds-text-primary)"
                    }`}
                    aria-pressed={active}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {branches.length > 0 && (
              <label className="flex items-center gap-2 text-[12px] text-[#64748b]">
                <span className="font-medium">Branch</span>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="h-8 px-2.5 pr-7 text-[12px] bg-(--ds-bg) border border-(--ds-border) rounded-lg text-(--ds-text-primary) focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
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

          <div className="px-6 pt-5 grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label={`${rangeLabel(range)} scans`} value={data?.rangeScans} loading={loading} />
            <Stat label={`${rangeLabel(range)} feedback`} value={data?.rangeFeedback} loading={loading} />
            <Stat
              label="Conversion"
              value={data ? `${data.rangeConversion.toFixed(1)}%` : undefined}
              loading={loading}
            />
            <Stat label="Lifetime scans" value={data?.totalScans} loading={loading} />
            <Stat
              label="Total duration"
              value={data ? formatTotalDuration(data.totalDurationMs) : undefined}
              loading={loading}
            />
            <Stat
              label="Avg duration"
              value={data ? formatAvgDuration(data.avgDurationMs) : undefined}
              loading={loading}
            />
          </div>

          <div className="px-6 py-6">
            <div className="h-[320px] w-full">
              {loading && !data ? (
                <div className="h-full flex items-center justify-center text-[13px] text-[#64748b]">
                  Loading…
                </div>
              ) : error ? (
                <div className="h-full flex items-center justify-center text-[13px] text-red-500">
                  {error}
                </div>
              ) : chartData.length === 0 ||
                chartData.every((p) => p.scans === 0 && p.feedback === 0) ? (
                <div className="h-full flex items-center justify-center text-[13px] text-[#64748b]">
                  No activity in this range yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 1, height: 1 }}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pmScans" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartTheme.scansStroke} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={chartTheme.scansStroke} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="pmFeedback" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartTheme.feedbackStroke} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={chartTheme.feedbackStroke} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: chartTheme.axisTick }}
                      dy={10}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: chartTheme.axisTick }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: chartTheme.tooltipBg,
                        border: `1px solid ${chartTheme.tooltipBorder}`,
                        borderRadius: "12px",
                        fontSize: "13px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      itemStyle={{ color: chartTheme.tooltipText, fontWeight: 500 }}
                      labelStyle={{ color: chartTheme.tooltipText }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: "13px", paddingTop: "10px", color: chartTheme.tooltipText }} />
                    <Area
                      type="monotone"
                      dataKey="scans"
                      name="Scans"
                      stroke={chartTheme.scansStroke}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#pmScans)"
                    />
                    <Area
                      type="monotone"
                      dataKey="feedback"
                      name="Feedback"
                      stroke={chartTheme.feedbackStroke}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#pmFeedback)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {data && (data.devices.length > 0 || data.countries.length > 0 || data.browsers.length > 0 || data.sources.length > 0 || data.qrScanTypes.length > 0 || data.branches.length > 0) && (
            <div className="px-6 pb-6 space-y-4">
              {data.branches.length > 0 && (
                <BreakdownCard
                  title="Branches"
                  items={data.branches.map((b) => ({ key: b.branch, count: b.count }))}
                />
              )}
              {data.qrScanTypes.length > 0 && (
                <BreakdownCard
                  title="QR Source (On Pack / Link / Social)"
                  items={data.qrScanTypes.map((q) => ({
                    key: QR_SCAN_TYPE_LABEL[q.qrScanType] ?? q.qrScanType,
                    count: q.count,
                  }))}
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BreakdownCard
                  title="Devices"
                  items={data.devices.map((d) => ({
                    key: DEVICE_LABEL[d.device] ?? d.device,
                    count: d.count,
                  }))}
                />
                <BreakdownCard
                  title="Referrers"
                  items={data.sources.map((s) => ({
                    key: SOURCE_LABEL[s.source] ?? s.source,
                    count: s.count,
                  }))}
                />
                <BreakdownCard
                  title="Countries"
                  items={data.countries.map((c) => ({
                    key: formatCountry(c.country),
                    count: c.count,
                  }))}
                />
                <BreakdownCard
                  title="Browsers"
                  items={data.browsers.map((b) => ({ key: b.browser, count: b.count }))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function BreakdownCard({
  title,
  items,
}: {
  title: string;
  items: { key: string; count: number }[];
}) {
  const total = items.reduce((sum, i) => sum + i.count, 0);
  return (
    <div className="bg-(--ds-bg) border border-(--ds-border) rounded-xl p-4">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-semibold">{title}</p>
        <p className="text-[11px] text-[#94a3b8] tabular-nums">{total.toLocaleString()}</p>
      </div>
      {items.length === 0 ? (
        <p className="text-[12px] text-[#64748b]">No data in this range.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((i) => {
            const pct = total > 0 ? (i.count / total) * 100 : 0;
            return (
              <li key={i.key}>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-(--ds-text-primary) truncate pr-2">{i.key}</span>
                  <span className="text-[#64748b] tabular-nums shrink-0">
                    {i.count.toLocaleString()}
                    <span className="text-[#94a3b8] ml-1.5">({pct.toFixed(0)}%)</span>
                  </span>
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

function rangeLabel(range: ProductAnalyticsRange) {
  switch (range) {
    case "weekly":
      return "7d";
    case "monthly":
      return "30d";
    case "yearly":
      return "12mo";
    case "lifetime":
      return "All-time";
  }
}

function Stat({
  label,
  value,
  loading,
}: {
  label: string;
  value: number | string | undefined;
  loading: boolean;
}) {
  const display =
    loading && value === undefined
      ? "-"
      : typeof value === "number"
        ? value.toLocaleString()
        : (value ?? "-");
  return (
    <div className="bg-(--ds-bg) border border-(--ds-border) rounded-xl px-3 py-2.5">
      <p className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-medium">{label}</p>
      <p className="text-xl font-bold text-(--ds-text-primary) tabular-nums mt-0.5">{display}</p>
    </div>
  );
}
