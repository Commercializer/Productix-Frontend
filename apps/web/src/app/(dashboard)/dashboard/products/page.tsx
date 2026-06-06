"use client";

import { useAuth } from "@/contexts/auth-context";
import { usePromptions } from "@/hooks/use-promptions";
import { PromptionTable } from "@/components/dashboard/promption-table";
import { DashboardHeader } from "@/components/dashboard/header";

export default function ProductsPage() {
  const { isCompanyUser } = useAuth();
  const { promptions, loading, deletePromption, publishPromption, unpublishPromption, setSlugVisible, updateSlug, updateRedirect, updateProductName, updatePinLock, revealPin } = usePromptions();

  return (
    <div className="page-content bg-(--ds-bg)">
      <DashboardHeader />
      <section className="section mt-0!">
        <h2 className="text-[22px] md:text-[24px] font-semibold text-(--ds-text-primary) mb-6 tracking-tight">Products</h2>
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
            onSetSlugVisible={setSlugVisible}
            onRenameSlug={updateSlug}
            onUpdateRedirect={updateRedirect}
            onRenameProduct={updateProductName}
            onUpdatePinLock={updatePinLock}
            onRevealPin={revealPin}
            readOnly={isCompanyUser}
          />
        )}
      </section>
    </div>
  );
}
