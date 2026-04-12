"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { TenantSidebar } from "@/components/tenant/sidebar";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isTenantAdmin, isSuperAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!isTenantAdmin && !isSuperAdmin) {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, isTenantAdmin, isSuperAdmin, router]);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-spinner" />
      </div>
    );
  }

  // Allow both SuperAdmin (override) and TenantAdmin
  if (!user || (!isTenantAdmin && !isSuperAdmin)) return null;

  return (
    <div className="app-shell">
      <TenantSidebar />
      <main className="app-main">{children}</main>
    </div>
  );
}
