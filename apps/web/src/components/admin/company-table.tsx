"use client";

import { useState, useTransition } from "react";
import { deleteCompanyAction, renameCompanyAction, updateCompanySeatLimitAction } from "@/lib/admin/companies";

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
  const [editSeatsId, setEditSeatsId] = useState<string | null>(null);
  const [seatsValue, setSeatsValue] = useState("");
  const [editNameId, setEditNameId] = useState<string | null>(null);
  const [nameValue, setNameValue] = useState("");

  const startEditSeats = (c: AdminCompany) => {
    setActionError(null);
    setEditSeatsId(c.id);
    setSeatsValue(String(c.maximumUsers));
  };

  const startEditName = (c: AdminCompany) => {
    setActionError(null);
    setEditNameId(c.id);
    setNameValue(c.name);
  };

  const handleSaveName = (id: string) => {
    startTransition(async () => {
      const result = await renameCompanyAction(id, nameValue);
      if ("error" in result && result.error) {
        setActionError(result.error);
      } else {
        setEditNameId(null);
        onRefresh();
      }
    });
  };

  const handleSaveSeats = (id: string) => {
    const next = Number(seatsValue);
    startTransition(async () => {
      const result = await updateCompanySeatLimitAction(id, next);
      if ("error" in result && result.error) {
        setActionError(result.error);
      } else {
        setEditSeatsId(null);
        onRefresh();
      }
    });
  };

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
                        {editNameId === c.id ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <input
                              type="text"
                              value={nameValue}
                              onChange={(e) => setNameValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveName(c.id);
                                if (e.key === "Escape") setEditNameId(null);
                              }}
                              disabled={isPending}
                              maxLength={100}
                              style={{ width: 180, padding: "2px 6px", border: "1px solid var(--ds-border, #d1d5db)", borderRadius: 6, fontSize: 13 }}
                              aria-label="Company name"
                              autoFocus
                            />
                            <button
                              className="action-btn action-btn--confirm"
                              onClick={() => handleSaveName(c.id)}
                              disabled={isPending}
                              title="Save name"
                            >
                              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              className="action-btn"
                              onClick={() => setEditNameId(null)}
                              disabled={isPending}
                              title="Cancel"
                            >
                              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button
                              type="button"
                              onClick={() => startEditName(c)}
                              title="Rename company"
                              style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "inherit", cursor: "pointer", font: "inherit", padding: 0 }}
                              id={`edit-name-${c.id}`}
                            >
                              <span className="td-title">{c.name}</span>
                              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ opacity: 0.5 }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <div className="td-muted" style={{ fontSize: 12 }}>@{c.businessUsername}</div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="td td-muted">{c.tenantName}</td>
                    <td className="td">
                      <span className={PLAN_CLASSES[c.subscriptionPlan] ?? "badge badge--gray"}>
                        {c.subscriptionPlan}
                      </span>
                    </td>
                    <td className="td td-muted">
                      {editSeatsId === c.id ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span>{c.memberCount} /</span>
                          <input
                            type="number"
                            min={Math.max(1, c.memberCount)}
                            max={1000}
                            value={seatsValue}
                            onChange={(e) => setSeatsValue(e.target.value)}
                            disabled={isPending}
                            style={{ width: 60, padding: "2px 6px", border: "1px solid var(--ds-border, #d1d5db)", borderRadius: 6, fontSize: 13 }}
                            aria-label="Seat limit"
                            autoFocus
                          />
                          <button
                            className="action-btn action-btn--confirm"
                            onClick={() => handleSaveSeats(c.id)}
                            disabled={isPending}
                            title="Save seat limit"
                          >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => setEditSeatsId(null)}
                            disabled={isPending}
                            title="Cancel"
                          >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditSeats(c)}
                          title="Edit seat limit"
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "inherit", cursor: "pointer", font: "inherit", padding: 0 }}
                          id={`edit-seats-${c.id}`}
                        >
                          {c.memberCount} / {c.maximumUsers}
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ opacity: 0.5 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
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
