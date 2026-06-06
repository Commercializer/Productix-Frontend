"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
  listTeamMembersAction,
  removeTeamMemberAction,
  toggleTeamMemberActiveAction,
} from "@/lib/dashboard/team";
import { CreateTeamMemberModal } from "@/components/dashboard/create-team-member-modal";

interface TeamMember {
  membershipId: string;
  membershipType: "ADMIN" | "USER";
  userId: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastSignIn: string | null;
}

const ROLE_LABELS: Record<string, { label: string; cls: string }> = {
  COMPANY_ADMIN: { label: "Admin", cls: "badge badge--green" },
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

export default function TeamPage() {
  const { user, loading, isCompanyManager } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [maximumUsers, setMaximumUsers] = useState(0);
  const [seatsUsed, setSeatsUsed] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!loading && user && !isCompanyManager) {
      router.replace("/dashboard");
    }
  }, [loading, user, isCompanyManager, router]);

  const load = useCallback(() => {
    startTransition(async () => {
      try {
        const data = await listTeamMembersAction();
        setMembers(data.members);
        setCompanyName(data.companyName);
        setMaximumUsers(data.maximumUsers);
        setSeatsUsed(data.seatsUsed);
      } catch (e: any) {
        setActionError(e?.message ?? "Failed to load team.");
      }
    });
  }, []);

  useEffect(() => {
    if (isCompanyManager) load();
  }, [isCompanyManager, load]);

  if (loading || !user || !isCompanyManager) {
    return (
      <div className="app-loading">
        <div className="app-spinner" />
      </div>
    );
  }

  const handleRemove = (userId: string) => {
    setConfirmRemoveId(null);
    startTransition(async () => {
      const result = await removeTeamMemberAction(userId);
      if ("error" in result && result.error) setActionError(result.error);
      else load();
    });
  };

  const handleToggle = (m: TeamMember) => {
    startTransition(async () => {
      const result = await toggleTeamMemberActiveAction(m.userId, m.isActive);
      if ("error" in result && result.error) setActionError(result.error);
      else load();
    });
  };

  const seatsLeft = Math.max(0, maximumUsers - seatsUsed);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team</h1>
          <p className="page-sub">
            {companyName ? `${companyName} · ` : ""}
            {seatsUsed} of {maximumUsers} seats used
            {seatsLeft > 0 ? ` · ${seatsLeft} remaining` : ""}
          </p>
        </div>
      </div>

      {actionError && (
        <div className="alert alert--error" role="alert">
          {actionError}
          <button onClick={() => setActionError(null)} className="alert-close">✕</button>
        </div>
      )}

      <div className="table-container">
        <div className="table-toolbar">
          <div />
          <button
            className="btn-primary"
            onClick={() => setShowCreate(true)}
            disabled={seatsLeft <= 0}
            title={seatsLeft <= 0 ? "Seat limit reached" : "Add a team member"}
            id="add-team-member-btn"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add member
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
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty">
                    No team members yet. Click "Add member" to invite someone.
                  </td>
                </tr>
              ) : (
                members.map((m) => {
                  const roleInfo = ROLE_LABELS[m.role] ?? { label: m.role, cls: "badge badge--gray" };
                  const isSelf = m.userId === user.id;
                  return (
                    <tr key={m.userId} className="tr">
                      <td className="td">
                        <div className="td-name">
                          <div className="td-avatar">{m.email[0]?.toUpperCase()}</div>
                          <span className="td-title">{m.email}{isSelf ? " (you)" : ""}</span>
                        </div>
                      </td>
                      <td className="td">
                        <span className={roleInfo.cls}>{roleInfo.label}</span>
                      </td>
                      <td className="td">
                        <span className={`badge ${m.isActive ? "badge--success" : "badge--danger"}`}>
                          {m.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="td td-muted">{formatDate(m.lastSignIn)}</td>
                      <td className="td td-muted">{formatDate(m.createdAt)}</td>
                      <td className="td">
                        <div className="td-actions">
                          {!isSelf && (
                            <>
                              <button
                                className={`action-btn ${m.isActive ? "action-btn--disable" : "action-btn--enable"}`}
                                title={m.isActive ? "Disable member" : "Enable member"}
                                onClick={() => handleToggle(m)}
                                disabled={isPending}
                              >
                                {m.isActive ? (
                                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                ) : (
                                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                              </button>
                              {confirmRemoveId === m.userId ? (
                                <button
                                  className="action-btn action-btn--confirm"
                                  onClick={() => handleRemove(m.userId)}
                                  disabled={isPending}
                                  title="Confirm remove"
                                >
                                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                              ) : (
                                <button
                                  className="action-btn action-btn--delete"
                                  onClick={() => setConfirmRemoveId(m.userId)}
                                  title="Remove member"
                                >
                                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              )}
                            </>
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

      {showCreate && (
        <CreateTeamMemberModal
          onClose={() => setShowCreate(false)}
          onSuccess={load}
        />
      )}
    </div>
  );
}
