"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isSuperAdmin, isTenantAdmin, isCompanyAdmin, isCompanyUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (isSuperAdmin) {
        router.replace("/admin");
      }
      // TENANT_ADMIN stays on /dashboard and is treated as a company admin.
    }
  }, [user, loading, isSuperAdmin, router]);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-spinner" />
      </div>
    );
  }

  if (!user || (!isCompanyAdmin && !isCompanyUser && !isTenantAdmin)) return null;

  return (
    <div className="app-shell">
      <DashboardSidebar />
      <main className="app-main">{children}</main>
    </div>
  );
}
