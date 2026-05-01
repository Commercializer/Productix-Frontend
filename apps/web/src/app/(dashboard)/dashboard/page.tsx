"use client";

import { useAuth } from "@/contexts/auth-context";
import { usePromptions } from "@/hooks/use-promptions";
import { PromptionTable } from "@/components/dashboard/promption-table";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardPage() {
  const { user, isCompanyUser } = useAuth();
  const { promptions, loading, deletePromption, publishPromption, unpublishPromption } = usePromptions();

  const total = promptions.length;

  return (
    <div className="page-content bg-(--ds-bg)">
      <DashboardHeader />

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:flex md:flex-row md:items-center md:justify-between gap-y-8 gap-x-4 mb-12 border-b border-(--ds-border) pb-8">
        <div className="flex flex-col">
          <p className="text-[13px] md:text-[14px] text-(--ds-text-secondary) mb-1.5 md:mb-2">Total Products</p>
          <h2 className="text-[28px] md:text-[32px] font-medium text-(--ds-text-primary) leading-none tracking-tight">
            {loading ? "—" : total}
          </h2>
        </div>

        <div className="flex flex-col">
          <p className="text-[13px] md:text-[14px] text-(--ds-text-secondary) mb-1.5 md:mb-2">Total QR Leads</p>
          <h2 className="text-[28px] md:text-[32px] font-medium text-(--ds-text-primary) leading-none tracking-tight">
            24,216
          </h2>
        </div>

        <div className="flex flex-col">
          <p className="text-[13px] md:text-[14px] text-(--ds-text-secondary) mb-1.5 md:mb-2">Avg. Visitor Duration</p>
          <h2 className="text-[28px] md:text-[32px] font-medium text-(--ds-text-primary) leading-none tracking-tight">
            1.25min
          </h2>
        </div>

        <div className="flex flex-col">
          <p className="text-[13px] md:text-[14px] text-(--ds-text-secondary) mb-1.5 md:mb-2">Total Conversion</p>
          <h2 className="text-[28px] md:text-[32px] font-medium text-(--ds-text-primary) leading-none tracking-tight">
            2.5%
          </h2>
        </div>
      </div>

      {/* Promptions Table */}
      <section className="section mt-0!">
        <h2 className="text-xl font-medium text-(--ds-text-primary) mb-6">All Products</h2>
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
