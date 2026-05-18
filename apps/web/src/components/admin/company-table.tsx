"use client";

import { useState, useTransition } from "react";
import { deleteCompanyAction } from "@/lib/admin/companies";

export interface AdminCompany {
  id: string;
  name: string;
  email: string;
  businessUsername: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  maximumUsers: number;
  isActive: boolean;
  createdAt: string;
  tenantId: string;
  tenantName: string;
  memberCount: number;
}

interface CompanyTableProps {
  companies: AdminCompany[];
  onCreateCompany: () => void;
  onRefresh: () => void;
}

const PLAN_CLASSES: Record<string, string> = {
  FREE: "badge badge--gray",
  BASIC: "badge badge--blue",
  PREMIUM: "badge badge--purple",
  ENTERPRISE: "badge badge--green",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CompanyTable({ companies, onCreateCompany, onRefresh }: CompanyTableProps) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.businessUsername.toLowerCase().includes(search.toLowerCase()) ||
      c.tenantName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setConfirmDeleteId(null);
    startTransition(async () => {
      const result = await deleteCompanyAction(id);
      if ("error" in result && result.error) setActionError(result.error);
      else onRefresh();
    });
  };

  return (
    <>
      {actionError && (
        <div className="alert alert--error" role="alert">
          {actionError}
          <button onClick={() => setActionError(null)} className="alert-close">✕</button>
        </div>
      )}

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search-wrap">
            <svg className="table-search-icon" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="table-search"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="company-search"
            />
          </div>
          <button className="btn-primary" onClick={onCreateCompany} id="create-company-btn">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Company
          </button>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th className="th">Company</th>
                <th className="th">Tenant</th>
                <th className="th">Plan</th>
                <th className="th">Members</th>
                <th className="th">Created</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty">
                    {search ? "No companies match your search." : "No companies yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="tr">
                    <td className="td">
                      <div className="td-name">
                        <div className="td-avatar">{c.name[0]?.toUpperCase()}</div>
                        <div>
                          <div className="td-title">{c.name}</div>
                          <div className="td-muted" style={{ fontSize: 12 }}>@{c.businessUsername}</div>
                        </div>
                      </div>
                    </td>
                    <td className="td td-muted">{c.tenantName}</td>
                    <td className="td">
                      <span className={PLAN_CLASSES[c.subscriptionPlan] ?? "badge badge--gray"}>
                        {c.subscriptionPlan}
                      </span>
                    </td>
                    <td className="td td-muted">
                      {c.memberCount} / {c.maximumUsers}
                    </td>
                    <td className="td td-muted">{formatDate(c.createdAt)}</td>
                    <td className="td">
                      <div className="td-actions">
                        {confirmDeleteId === c.id ? (
                          <button
                            className="action-btn action-btn--confirm"
                            onClick={() => handleDelete(c.id)}
                            disabled={isPending}
                            title="Confirm delete"
                          >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            className="action-btn action-btn--delete"
                            onClick={() => setConfirmDeleteId(c.id)}
                            title="Delete company"
                            id={`delete-company-${c.id}`}
                          >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
