"use client";

import { useState, useEffect, useTransition } from "react";
import { getDashboardStatsAction } from "@/lib/admin/actions";
import { StatsCard } from "@/components/dashboard/stats-card";

interface Stats {
  totalUsers: number;
  totalPromptions: number;
  activeUsers: number;
  publishedPromptions: number;
}

export default function AdminHomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getDashboardStatsAction();
        setStats(data);
      } catch {
        // Stats failed - show zeros
        setStats({ totalUsers: 0, totalPromptions: 0, activeUsers: 0, publishedPromptions: 0 });
      }
    });
  }, []);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Home</h1>
          <p className="page-sub">Platform overview and key metrics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          label="Total Products"
          value={isPending || !stats ? "-" : stats.totalUsers}
          color="blue"
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatsCard
          label="Total QR Leads"
          value={isPending || !stats ? "-" : stats.totalPromptions}
          color="green"
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          }
        />
        <StatsCard
          label="Avg. Visitor Duration"
          value={isPending || !stats ? "-" : `${stats.activeUsers}`}
          color="purple"
          trend="Last 7 days"
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          label="Total Conversion"
          value={isPending || !stats ? "-" : `${stats.publishedPromptions}`}
          color="orange"
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      {/* Quick Links */}
      <div className="quick-links">
        <a href="/admin/users" className="quick-link-card">
          <div className="quick-link-icon">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p className="quick-link-title">Manage Users</p>
            <p className="quick-link-sub">Create, disable, delete accounts</p>
          </div>
          <svg className="quick-link-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
        <a href="/admin/promptions" className="quick-link-card">
          <div className="quick-link-icon">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div>
            <p className="quick-link-title">All Promptions</p>
            <p className="quick-link-sub">View and manage all platform content</p>
          </div>
          <svg className="quick-link-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
