"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isSuperAdmin, isTenantAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!isSuperAdmin) {
        if (isTenantAdmin) router.replace("/tenant");
        else router.replace("/dashboard");
      }
    }
  }, [user, loading, isSuperAdmin, isTenantAdmin, router]);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-spinner" />
      </div>
    );
  }

  if (!user || !isSuperAdmin) return null;

  return (
    <div className="app-shell">
      <AdminSidebar />
      <main className="app-main">{children}</main>
    </div>
  );
}
