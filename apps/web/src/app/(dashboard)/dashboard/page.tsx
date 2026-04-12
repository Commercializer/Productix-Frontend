"use client";

import { useAuth } from "@/contexts/auth-context";
import { usePromptions } from "@/hooks/use-promptions";
import { PromptionTable } from "@/components/dashboard/promption-table";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardPage() {
  const { user, isCompanyUser } = useAuth();
  const { promptions, loading, deletePromption, publishPromption, unpublishPromption } = usePromptions();

  const total = promptions.length;
  const publishedCount = promptions.filter((p) => p.isPublished).length;

  return (
    <div className="page-content bg-[var(--ds-bg)]">
      <DashboardHeader />

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-12 border-b border-[var(--ds-border)] pb-8">
        <div className="stats-card stats-card--blue">
          <div className="stats-card-icon">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="stats-card-body">
            <h2 className="stats-card-value">
              {loading ? "—" : total}
            </h2>
            <p className="stats-card-label">Total Products</p>
          </div>
        </div>

        <div className="stats-card stats-card--green">
          <div className="stats-card-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stats-card-body">
            <h2 className="stats-card-value">
              {loading ? "—" : publishedCount}
            </h2>
            <p className="stats-card-label">Published</p>
          </div>
        </div>

        <div className="stats-card stats-card--purple">
          <div className="stats-card-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-8v4h8v-4zM4.929 4.929l-.707.707m15.556 15.556l-.707-.707M19.071 4.929l.707.707M4.929 19.071l.707-.707M12 16a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </div>
          <div className="stats-card-body">
            <h2 className="stats-card-value">
              24,216
            </h2>
            <p className="stats-card-label">Total QR Leads</p>
          </div>
        </div>

        <div className="stats-card stats-card--orange">
          <div className="stats-card-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="stats-card-body">
            <h2 className="stats-card-value">
              2.5%
            </h2>
            <p className="stats-card-label">Total Conversion</p>
          </div>
        </div>
      </div>

      {/* Promptions Table */}
      <section className="section !mt-0">
        <h2 className="text-xl font-bold text-[var(--ds-text-primary)] mb-6">All Products</h2>
        {loading ? (
          <div className="skeleton-table">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-row" />
            ))}
          </div>
        ) : (
          <PromptionTable
            promptions={promptions}
            onDelete={deletePromption}
            onPublish={publishPromption}
            onUnpublish={unpublishPromption}
            readOnly={isCompanyUser}
          />
        )}
      </section>
    </div>
  );
}
