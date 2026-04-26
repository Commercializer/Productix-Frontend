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
  Legend
} from "recharts";
import { AnalyticsStats } from "@/hooks/use-analytics";

// Mock data to provide a "pro-looking" dashboard placeholder, easily connectable to a real time-series endpoint later.
const timeSeriesData = [
  { name: "Mon", leads: 420, scans: 840 },
  { name: "Tue", leads: 380, scans: 790 },
  { name: "Wed", leads: 510, scans: 1020 },
  { name: "Thu", leads: 490, scans: 980 },
  { name: "Fri", leads: 620, scans: 1250 },
  { name: "Sat", leads: 850, scans: 1700 },
  { name: "Sun", leads: 910, scans: 1950 },
];

const sourceData = [
  { name: "QR Print", value: 450 },
  { name: "Direct", value: 300 },
  { name: "Social", value: 250 },
  { name: "Email", value: 150 },
];

export function AnalyticsCharts({ stats }: { stats: AnalyticsStats | null }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
      {/* Main Area Chart */}
      <div className="lg:col-span-2 bg-white dark:bg-[#111] border border-(--ds-border) rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-(--ds-text-primary) tracking-tight mb-1">Engagement Overview</h3>
            <p className="text-[13px] text-(--ds-text-secondary)">Traffic & Scans over the last 7 days</p>
          </div>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ds-border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--ds-text-secondary)" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--ds-text-secondary)" }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--ds-bg)', border: '1px solid var(--ds-border)', borderRadius: '12px', fontSize: '13px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: 'var(--ds-text-primary)', fontWeight: 500 }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="scans" name="Total Scans" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" />
              <Area type="monotone" dataKey="leads" name="Unique Leads" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Side Bar Chart */}
      <div className="bg-white dark:bg-[#111] border border-(--ds-border) rounded-xl p-6 shadow-xs">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-(--ds-text-primary) tracking-tight mb-1">Acquisition Sources</h3>
          <p className="text-[13px] text-(--ds-text-secondary)">Traffic origin breakdown</p>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sourceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ds-border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--ds-text-secondary)" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--ds-text-secondary)" }} />
              <Tooltip 
                cursor={{ fill: 'var(--ds-border)', opacity: 0.3 }}
                contentStyle={{ backgroundColor: 'var(--ds-bg)', border: '1px solid var(--ds-border)', borderRadius: '12px', fontSize: '13px' }}
                itemStyle={{ color: 'var(--ds-text-primary)', fontWeight: 500 }}
              />
              <Bar dataKey="value" name="Scans" fill="#0284c7" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
