"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { listCompaniesAction } from "@/lib/admin/companies";
import { CompanyTable, type AdminCompany } from "@/components/admin/company-table";
import { CreateCompanyModal } from "@/components/admin/create-company-modal";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [isPending, startTransition] = useTransition();
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(() => {
    startTransition(async () => {
      try {
        const data = await listCompaniesAction();
        setCompanies(data as AdminCompany[]);
      } catch (e) {
        console.error(e);
      }
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Companies</h1>
          <p className="page-sub">Create and manage customer companies across all tenants</p>
        </div>
      </div>

      {isPending && companies.length === 0 ? (
        <div className="skeleton-table">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row" />
          ))}
        </div>
      ) : (
        <CompanyTable
          companies={companies}
          onCreateCompany={() => setShowCreate(true)}
          onRefresh={load}
        />
      )}

      {showCreate && (
        <CreateCompanyModal
          onClose={() => setShowCreate(false)}
          onSuccess={load}
        />
      )}
    </div>
  );
}
