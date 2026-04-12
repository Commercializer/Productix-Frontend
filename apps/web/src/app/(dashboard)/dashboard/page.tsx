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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 border-b border-[var(--ds-border)] pb-8">
        <div>
          <p className="text-[13px] text-[var(--ds-text-secondary)] font-medium mb-2">Total Products</p>
          <h2 className="text-3xl font-bold text-[var(--ds-text-primary)]">
            {loading ? "—" : total}
          </h2>
        </div>
        <div>
          <p className="text-[13px] text-[var(--ds-text-secondary)] font-medium mb-2">Published</p>
          <h2 className="text-3xl font-bold text-[var(--ds-text-primary)]">
            {loading ? "—" : publishedCount}
          </h2>
        </div>
        <div>
          <p className="text-[13px] text-[var(--ds-text-secondary)] font-medium mb-2">Total QR Leads</p>
          <h2 className="text-3xl font-bold text-[var(--ds-text-primary)]">
            24,216
          </h2>
        </div>
        <div>
          <p className="text-[13px] text-[var(--ds-text-secondary)] font-medium mb-2">Total Conversion</p>
          <h2 className="text-3xl font-bold text-[var(--ds-text-primary)]">
            2.5%
          </h2>
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
