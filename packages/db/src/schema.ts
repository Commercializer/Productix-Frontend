/**
 * Database schema definitions — scaffolded for future Prisma integration.
 *
 * These TypeScript interfaces mirror the planned database tables.
 * When Prisma is set up, this file will be replaced by generated types.
 */

import type { PageStatus } from "@productix/types";

/** Database Page row */
export interface DbPage {
  id: string;
  slug: string;
  title: string;
  status: PageStatus;
  templateId: string | null;
  /** JSON column — stores the full CanvasDocument payload */
  content: string;
  /** JSON column — stores SEO metadata */
  meta: string;
  version: number;
  locale: string | null;
  tenantId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

/** Database User row */
export interface DbUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: "owner" | "admin" | "editor" | "viewer";
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Database Tenant row */
export interface DbTenant {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "pro" | "enterprise";
  createdAt: Date;
  updatedAt: Date;
}

/** Database Template row (for marketplace) */
export interface DbTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnailUrl: string | null;
  content: string;
  isPublic: boolean;
  tenantId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
