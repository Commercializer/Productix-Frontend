/* ─────────────────────────────────────────────
 * Auth Types - Login, Session, and Admin ops
 * ──────────────────────────────────────────── */

import type { UserRole } from "./user";

// ── Login ───────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
  session: AuthSession;
}

// ── Session ─────────────────────────────────

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  expiresIn: number;
}

// ── Admin User Management ───────────────────

export interface CreateUserRequest {
  email: string;
  password: string;
  role: UserRole;
  /** Assign to tenant (for TENANT_ADMIN role) */
  tenantId?: string;
  /** Assign to company (for COMPANY_ADMIN / COMPANY_USER roles) */
  companyId?: string;
}

export interface UpdateUserRoleRequest {
  userId: string;
  role: UserRole;
}

export interface DeactivateUserRequest {
  userId: string;
}

// ── Password Reset ──────────────────────────

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  newPassword: string;
}

// ── Auth State ──────────────────────────────

export type AuthState =
  | { status: "loading" }
  | { status: "authenticated"; user: LoginResponse["user"]; session: AuthSession }
  | { status: "unauthenticated" };
