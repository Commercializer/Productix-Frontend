"use client";

import { useMemo, useState, useTransition } from "react";
import {
  deleteUserAction,
  disableUserAction,
  resetUserPasswordAction,
} from "@/lib/admin/actions";

interface UserRow {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastSignIn: string | null;
}

interface PlatformUserRow extends UserRow {
  tenantName: string | null;
}

export interface CompanyGroup {
  id: string;
  name: string;
  businessUsername: string;
  maximumUsers: number;
  isActive: boolean;
  tenantId: string;
  tenantName: string;
  admins: UserRow[];
  users: UserRow[];
}

interface UserTreeProps {
  companies: CompanyGroup[];
  platformUsers: PlatformUserRow[];
  onCreateUser: () => void;
  onRefresh: () => void;
}

const ROLE_LABELS: Record<string, { label: string; cls: string }> = {
  SUPER_ADMIN: { label: "Super Admin", cls: "badge badge--purple" },
  TENANT_ADMIN: { label: "Tenant Admin", cls: "badge badge--blue" },
  COMPANY_ADMIN: { label: "Company Admin", cls: "badge badge--green" },
  COMPANY_USER: { label: "User", cls: "badge badge--gray" },
};

function formatDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{
        transition: "transform 0.15s ease",
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
      }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function UserTree({ companies, platformUsers, onCreateUser, onRefresh }: UserTreeProps) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [platformOpen, setPlatformOpen] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [resetModal, setResetModal] = useState<UserRow | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const matches = (u: UserRow) =>
    !search ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase());

  const filteredCompanies = useMemo(() => {
    if (!search) return companies;
    return companies
      .map((c) => ({
        ...c,
        admins: c.admins.filter(matches),
        users: c.users.filter(matches),
      }))
      .filter(
        (c) =>
          c.admins.length > 0 ||
          c.users.length > 0 ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.businessUsername.toLowerCase().includes(search.toLowerCase())
      );
  }, [companies, search]);

  const filteredPlatformUsers = useMemo(
    () => platformUsers.filter(matches),
    [platformUsers, search]
  );

  // When searching, auto-expand any company that has matches.
  const effectiveExpanded = (companyId: string) => {
    if (search) return true;
    return expanded[companyId] ?? false;
  };

  const toggle = (companyId: string) => {
    setExpanded((prev) => ({ ...prev, [companyId]: !prev[companyId] }));
  };

  const handleToggleDisable = (user: UserRow) => {
    startTransition(async () => {
      const result = await disableUserAction(user.id, user.isActive);
      if ("error" in result && result.error) setActionError(result.error);
      else onRefresh();
    });
  };

  const handleDelete = (userId: string) => {
    setConfirmDeleteId(null);
    startTransition(async () => {
      const result = await deleteUserAction(userId);
      if ("error" in result && result.error) setActionError(result.error);
      else onRefresh();
    });
  };

  const handleResetPassword = () => {
    if (!resetModal || !newPassword) return;
    startTransition(async () => {
      const result = await resetUserPasswordAction(resetModal.id, newPassword);
      if ("error" in result && result.error) setActionError(result.error);
      else {
        setResetModal(null);
        setNewPassword("");
      }
    });
  };

  const renderUserRow = (u: UserRow, depth = 1) => {
    const roleInfo = ROLE_LABELS[u.role] ?? { label: u.role, cls: "badge badge--gray" };
    return (
      <tr key={u.id} className="tr">
        <td className="td">
          <div className="td-name" style={{ paddingLeft: depth * 24 }}>
            <div className="td-avatar">{u.email[0]?.toUpperCase()}</div>
            <span className="td-title">{u.email}</span>
          </div>
        </td>
        <td className="td">
          <span className={roleInfo.cls}>{roleInfo.label}</span>
        </td>
        <td className="td">
          <span className={`badge ${u.isActive ? "badge--success" : "badge--danger"}`}>
            {u.isActive ? "Active" : "Disabled"}
          </span>
        </td>
        <td className="td td-muted">{formatDate(u.lastSignIn)}</td>
        <td className="td td-muted">{formatDate(u.createdAt)}</td>
        <td className="td">
          <div className="td-actions">
            <button
              className="action-btn action-btn--edit"
              title="Reset password"
              onClick={() => setResetModal(u)}
              id={`reset-pw-${u.id}`}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </button>
            <button
              className={`action-btn ${u.isActive ? "action-btn--disable" : "action-btn--enable"}`}
              title={u.isActive ? "Disable user" : "Enable user"}
              onClick={() => handleToggleDisable(u)}
              disabled={isPending}
              id={`toggle-user-${u.id}`}
            >
              {u.isActive ? (
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              ) : (
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            {confirmDeleteId === u.id ? (
              <button
                className="action-btn action-btn--confirm"
                onClick={() => handleDelete(u.id)}
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
                onClick={() => setConfirmDeleteId(u.id)}
                title="Delete user"
                id={`delete-user-${u.id}`}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const renderCompany = (c: CompanyGroup) => {
    const open = effectiveExpanded(c.id);
    const memberCount = c.admins.length + c.users.length;
    return (
      <tbody key={c.id}>
        <tr
          className="tr"
          onClick={() => toggle(c.id)}
          style={{ cursor: "pointer", background: "var(--ds-surface-2)" }}
        >
          <td className="td">
            <div className="td-name" style={{ gap: 8 }}>
              <ChevronIcon open={open} />
              <div className="td-avatar" style={{ background: "var(--ds-accent, #4f6ef7)", color: "#fff" }}>
                {c.name[0]?.toUpperCase()}
              </div>
              <div>
                <div className="td-title" style={{ fontWeight: 600 }}>{c.name}</div>
                <div className="td-muted" style={{ fontSize: 12 }}>
                  @{c.businessUsername} · {c.tenantName}
                </div>
              </div>
            </div>
          </td>
          <td className="td td-muted" colSpan={4}>
            {memberCount} member{memberCount === 1 ? "" : "s"} of {c.maximumUsers}
          </td>
          <td className="td">
            <span className={`badge ${c.isActive ? "badge--success" : "badge--danger"}`}>
              {c.isActive ? "Active" : "Disabled"}
            </span>
          </td>
        </tr>
        {open && memberCount === 0 && (
          <tr>
            <td colSpan={6} className="table-empty" style={{ paddingLeft: 48 }}>
              No members in this company yet.
            </td>
          </tr>
        )}
        {open && c.admins.map((u) => renderUserRow(u))}
        {open && c.users.map((u) => renderUserRow(u))}
      </tbody>
    );
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
              placeholder="Search by email, role, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="user-search"
            />
          </div>
          <button className="btn-primary" onClick={onCreateUser} id="create-user-btn">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th className="th">User / Company</th>
                <th className="th">Role</th>
                <th className="th">Status</th>
                <th className="th">Last Sign In</th>
                <th className="th">Joined</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            {filteredCompanies.length === 0 && filteredPlatformUsers.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={6} className="table-empty">
                    {search ? "No users match your search." : "No users found."}
                  </td>
                </tr>
              </tbody>
            ) : (
              <>
                {filteredCompanies.map(renderCompany)}

                {filteredPlatformUsers.length > 0 && (
                  <tbody>
                    <tr
                      className="tr"
                      onClick={() => setPlatformOpen((v) => !v)}
                      style={{ cursor: "pointer", background: "var(--ds-surface-2)" }}
                    >
                      <td className="td">
                        <div className="td-name" style={{ gap: 8 }}>
                          <ChevronIcon open={platformOpen} />
                          <div className="td-avatar" style={{ background: "#6b7280", color: "#fff" }}>
                            P
                          </div>
                          <div>
                            <div className="td-title" style={{ fontWeight: 600 }}>
                              Platform users
                            </div>
                            <div className="td-muted" style={{ fontSize: 12 }}>
                              Super admins, tenant admins &amp; unaffiliated accounts
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="td td-muted" colSpan={5}>
                        {filteredPlatformUsers.length} user
                        {filteredPlatformUsers.length === 1 ? "" : "s"}
                      </td>
                    </tr>
                    {platformOpen && filteredPlatformUsers.map((u) => renderUserRow(u))}
                  </tbody>
                )}
              </>
            )}
          </table>
        </div>
      </div>

      {resetModal && (
        <div className="modal-overlay" onClick={() => setResetModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Reset Password</h3>
              <button className="modal-close" onClick={() => setResetModal(null)}>✕</button>
            </div>
            <p className="modal-desc">
              Set a new password for <strong>{resetModal.email}</strong>
            </p>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Min. 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                id="reset-password-input"
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setResetModal(null)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleResetPassword}
                disabled={isPending || newPassword.length < 8}
                id="confirm-reset-password-btn"
              >
                {isPending ? "Resetting…" : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
