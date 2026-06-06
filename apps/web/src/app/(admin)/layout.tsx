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
  const { user, loading, isSuperAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!isSuperAdmin) {
        // Everyone below super admin (incl. tenant admins) uses the dashboard.
        router.replace("/dashboard");
      }
    }
  }, [user, loading, isSuperAdmin, router]);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-spinner" />
      </div>
    );
  }

  if (!user || !isSuperAdmin) return null;

  return (
    <div className="app-shell app-shell--admin">
      <AdminSidebar />
      <main className="app-main">{children}</main>
    </div>
  );
}
