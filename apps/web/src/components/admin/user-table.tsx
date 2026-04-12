"use client";

import { useState, useTransition } from "react";
import {
  deleteUserAction,
  disableUserAction,
  resetUserPasswordAction,
} from "@/lib/admin/actions";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastSignIn: string | null;
}

interface UserTableProps {
  users: AdminUser[];
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

export function UserTable({ users, onCreateUser, onRefresh }: UserTableProps) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [resetModal, setResetModal] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleDisable = (user: AdminUser) => {
    startTransition(async () => {
      const result = await disableUserAction(user.id, user.isActive);
      if (result.error) setActionError(result.error);
      else onRefresh();
    });
  };

  const handleDelete = (userId: string) => {
    setConfirmDeleteId(null);
    startTransition(async () => {
      const result = await deleteUserAction(userId);
      if (result.error) setActionError(result.error);
      else onRefresh();
    });
  };

  const handleResetPassword = () => {
    if (!resetModal || !newPassword) return;
    startTransition(async () => {
      const result = await resetUserPasswordAction(resetModal.id, newPassword);
      if (result.error) setActionError(result.error);
      else {
        setResetModal(null);
        setNewPassword("");
      }
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
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="user-search"
            />
          </div>
          <button
            className="btn-primary"
            onClick={onCreateUser}
            id="create-user-btn"
          >
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
                <th className="th">Email</th>
                <th className="th">Role</th>
                <th className="th">Status</th>
                <th className="th">Last Sign In</th>
                <th className="th">Joined</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty">
                    {search ? "No users match your search." : "No users found."}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const roleInfo = ROLE_LABELS[u.role] ?? { label: u.role, cls: "badge badge--gray" };
                  return (
                    <tr key={u.id} className="tr">
                      <td className="td">
                        <div className="td-name">
                          <div className="td-avatar">
                            {u.email[0]?.toUpperCase()}
                          </div>
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
                          {/* Reset password */}
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
                          {/* Disable / Enable */}
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
                          {/* Delete */}
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Password Modal */}
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
