"use client";

import { useAuth } from "@/contexts/auth-context";
import { usePromptions } from "@/hooks/use-promptions";
import { PromptionTable } from "@/components/dashboard/promption-table";
import { DashboardHeader } from "@/components/dashboard/header";

export default function ProductsPage() {
  const { isCompanyUser } = useAuth();
  const { promptions, loading, deletePromption, publishPromption, unpublishPromption } = usePromptions();

  return (
    <div className="page-content bg-[var(--ds-bg)]">
      <DashboardHeader />
      <section className="section !mt-0">
        <h2 className="text-xl font-bold text-[var(--ds-text-primary)] mb-6">Products</h2>
        <div className="bg-white dark:bg-[#111] border border-[var(--ds-border)] rounded-xl p-6">
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
        </div>
      </section>
    </div>
  );
}
