/* ─────────────────────────────────────────────
 * User Types — Role-Based Access Control
 * ──────────────────────────────────────────── */

/** 4-tier role hierarchy for multi-tenant access control */
export type UserRole =
  | "SUPER_ADMIN"
  | "TENANT_ADMIN"
  | "COMPANY_ADMIN"
  | "COMPANY_USER";

/**
 * @deprecated Use `UserRole` instead. Kept for backward compatibility.
 * Mapping: owner → SUPER_ADMIN, admin → TENANT_ADMIN, editor → COMPANY_ADMIN, viewer → COMPANY_USER
 */
export type LegacyUserRole = "owner" | "admin" | "editor" | "viewer";

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  tenantId?: string;
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  customShareableDomain?: string;
  customLoginDomain?: string;
  logoUrl?: string;
  themeColor?: string;
  tenantWebsiteUrl?: string;
  maximumBrandProfiles: number;
  maximumProducts: number;
  maxCompanies?: number;
  tenantType: "RESELLER" | "CORPORATE";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
