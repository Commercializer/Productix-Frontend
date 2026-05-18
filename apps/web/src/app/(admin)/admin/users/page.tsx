"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { listUsersByCompanyAction } from "@/lib/admin/actions";
import { UserTree, type CompanyGroup } from "@/components/admin/user-tree";
import { CreateUserModal } from "@/components/admin/create-user-modal";

interface PlatformUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastSignIn: string | null;
  tenantName: string | null;
}

export default function AdminUsersPage() {
  const [companies, setCompanies] = useState<CompanyGroup[]>([]);
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>([]);
  const [isPending, startTransition] = useTransition();
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(() => {
    startTransition(async () => {
      try {
        const data = await listUsersByCompanyAction();
        setCompanies(data.companies as CompanyGroup[]);
        setPlatformUsers(data.platformUsers as PlatformUser[]);
      } catch (e) {
        console.error(e);
      }
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const empty = companies.length === 0 && platformUsers.length === 0;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-sub">All platform users, grouped by their company</p>
        </div>
      </div>

      {isPending && empty ? (
        <div className="skeleton-table">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row" />
          ))}
        </div>
      ) : (
        <UserTree
          companies={companies}
          platformUsers={platformUsers}
          onCreateUser={() => setShowCreate(true)}
          onRefresh={load}
        />
      )}

      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onSuccess={load}
        />
      )}
    </div>
  );
}
