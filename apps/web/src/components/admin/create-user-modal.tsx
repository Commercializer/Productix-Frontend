"use client";

import { useEffect, useState, useTransition } from "react";
import { createUserAction } from "@/lib/admin/actions";
import { listTenantsAction } from "@/lib/admin/companies";

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ROLES = [
  { value: "COMPANY_USER", label: "Company User" },
  { value: "COMPANY_ADMIN", label: "Company Admin" },
  { value: "TENANT_ADMIN", label: "Tenant Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

export function CreateUserModal({ onClose, onSuccess }: CreateUserModalProps) {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("COMPANY_USER");
  const [tenants, setTenants] = useState<{ id: string; name: string }[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Tenant admins must be tied to a tenant; load the list lazily for the picker.
  useEffect(() => {
    listTenantsAction()
      .then((rows) => {
        setTenants(rows);
        const first = rows[0];
        if (first) setTenantId((prev) => prev || first.id);
      })
      .catch(() => {});
  }, []);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pwd);
    setShowPassword(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createUserAction({
        email,
        password,
        role,
        tenantId: role === "TENANT_ADMIN" ? tenantId : undefined,
      });
      if (result.error) {
        setError(result.error);
      } else {
        onSuccess();
        onClose();
      }
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Create User</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-input"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isPending}
              id="new-user-email"
            />
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", alignItems: "center" }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              <button 
                type="button" 
                onClick={generatePassword}
                style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "12px" }}
              >
                Generate Password
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={isPending}
                id="new-user-password"
                style={{ paddingRight: "50px", width: "100%", boxSizing: "border-box" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#6b7280" }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-input form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isPending}
              id="new-user-role"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {role === "TENANT_ADMIN" && (
            <div className="form-group">
              <label className="form-label">Tenant</label>
              <select
                className="form-input form-select"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                disabled={isPending || tenants.length === 0}
                required
                id="new-user-tenant"
              >
                {tenants.length === 0 ? (
                  <option value="">No tenants yet — create a company first</option>
                ) : (
                  tenants.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))
                )}
              </select>
              <p className="td-muted" style={{ fontSize: 12, marginTop: 4 }}>
                The tenant admin manages the first company under this tenant, with full dashboard and team access.
              </p>
            </div>
          )}

          {error && (
            <div className="form-error" role="alert">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isPending}
              id="confirm-create-user-btn"
            >
              {isPending ? "Creating…" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
