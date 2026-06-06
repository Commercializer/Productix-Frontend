"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createCompanyAction,
  listTenantsAction,
} from "@/lib/admin/companies";

interface CreateCompanyModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PLANS = [
  { value: "FREE", label: "Free" },
  { value: "BASIC", label: "Basic" },
  { value: "PREMIUM", label: "Premium" },
  { value: "ENTERPRISE", label: "Enterprise" },
] as const;

export function CreateCompanyModal({ onClose, onSuccess }: CreateCompanyModalProps) {
  const [isPending, startTransition] = useTransition();
  const [tenants, setTenants] = useState<{ id: string; name: string }[]>([]);
  const [tenantMode, setTenantMode] = useState<"existing" | "new">("existing");
  const [tenantId, setTenantId] = useState("");
  const [newTenantName, setNewTenantName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessUsername, setBusinessUsername] = useState("");
  const [plan, setPlan] = useState<typeof PLANS[number]["value"]>("FREE");
  const [maximumUsers, setMaximumUsers] = useState(3);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTenantsAction()
      .then((rows) => {
        setTenants(rows);
        const first = rows[0];
        if (!first) {
          setTenantMode("new");
        } else {
          setTenantId(first.id);
        }
      })
      .catch((e) => setError(e?.message ?? "Failed to load tenants."));
  }, []);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAdminPassword(pwd);
    setShowPassword(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createCompanyAction({
        name,
        email,
        businessUsername,
        subscriptionPlan: plan,
        maximumUsers,
        tenantId: tenantMode === "existing" ? tenantId : undefined,
        newTenantName: tenantMode === "new" ? newTenantName : undefined,
        newTenantEmail: tenantMode === "new" ? email : undefined,
        adminEmail: adminEmail || undefined,
        adminPassword: adminEmail ? adminPassword : undefined,
      });
      if ("error" in result && result.error) {
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
          <h3 className="modal-title">Create Company</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tenant</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button
                type="button"
                className={tenantMode === "existing" ? "btn-primary" : "btn-secondary"}
                onClick={() => setTenantMode("existing")}
                disabled={tenants.length === 0}
                style={{ flex: 1 }}
              >
                Existing
              </button>
              <button
                type="button"
                className={tenantMode === "new" ? "btn-primary" : "btn-secondary"}
                onClick={() => setTenantMode("new")}
                style={{ flex: 1 }}
              >
                New tenant
              </button>
            </div>
            {tenantMode === "existing" ? (
              <select
                className="form-input form-select"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                disabled={isPending || tenants.length === 0}
                required
              >
                {tenants.length === 0 ? (
                  <option value="">No tenants yet - create a new one</option>
                ) : (
                  tenants.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))
                )}
              </select>
            ) : (
              <input
                type="text"
                className="form-input"
                placeholder="New tenant name"
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
                disabled={isPending}
                required
              />
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Company name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Acme Inc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company email</label>
            <input
              type="email"
              className="form-input"
              placeholder="hello@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Business username</label>
            <input
              type="text"
              className="form-input"
              placeholder="acme"
              value={businessUsername}
              onChange={(e) => setBusinessUsername(e.target.value)}
              required
              disabled={isPending}
            />
          </div>

          <div className="form-group" style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Plan</label>
              <select
                className="form-input form-select"
                value={plan}
                onChange={(e) => setPlan(e.target.value as typeof plan)}
                disabled={isPending}
              >
                {PLANS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Team seats</label>
              <input
                type="number"
                className="form-input"
                min={1}
                value={maximumUsers}
                onChange={(e) => setMaximumUsers(Number(e.target.value) || 1)}
                disabled={isPending}
                title="Members the company admin can add. The admin you assign below does not count toward this."
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Initial company admin (optional)</label>
            <input
              type="email"
              className="form-input"
              placeholder="admin@acme.com"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              disabled={isPending}
              style={{ marginBottom: 8 }}
            />
            {adminEmail && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", alignItems: "center" }}>
                  <label className="form-label" style={{ margin: 0 }}>Admin password</label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 12 }}
                  >
                    Generate
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Min. 8 characters"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    minLength={8}
                    required
                    disabled={isPending}
                    style={{ paddingRight: 50, width: "100%", boxSizing: "border-box" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#6b7280" }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </>
            )}
          </div>

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
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isPending}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? "Creating…" : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
