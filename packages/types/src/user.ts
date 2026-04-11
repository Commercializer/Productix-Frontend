/* ─────────────────────────────────────────────
 * User Types — Scaffolded for future auth/RBAC
 * ──────────────────────────────────────────── */

export type UserRole = "owner" | "admin" | "editor" | "viewer";

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: UserRole;
  tenantId: string;
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "pro" | "enterprise";
  createdAt: string;
}
