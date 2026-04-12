"use client";

import { useAuth } from "@/contexts/auth-context";
import { StatsCard } from "@/components/dashboard/stats-card";

export default function TenantHomePage() {
  const { user } = useAuth();

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tenant Dashboard</h1>
          <p className="page-sub">
            Welcome back{user?.email ? `, ${user.email}` : ""} (Tenant Admin)
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard
          label="Your Companies"
          value="..."
          color="blue"
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <StatsCard
          label="Your Users"
          value="..."
          color="purple"
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
      </div>

      <section className="section">
        <h2 className="section-title">Tenant Features Overview</h2>
        <p className="text-gray-500 text-sm">
          Here you will be able to manage your specific tenant's companies, users, and global promptions.
        </p>
      </section>
    </div>
  );
}
