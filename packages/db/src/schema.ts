/**
 * Database schema definitions - legacy TypeScript interfaces.
 *
 * @deprecated These interfaces are superseded by Prisma-generated types.
 * Import from `@prisma/client` instead:
 *
 *   import type { User, Tenant, Product } from "@prisma/client";
 *
 * Kept for backward compatibility during migration.
 */

import type { PageStatus } from "@productix/types";

/** @deprecated Use Prisma-generated types instead. */
export interface DbPage {
  id: string;
  slug: string;
  title: string;
  status: PageStatus;
  templateId: string | null;
  /** JSON column - stores the full CanvasDocument payload */
  content: string;
  /** JSON column - stores SEO metadata */
  meta: string;
  version: number;
  locale: string | null;
  tenantId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

/** @deprecated Use Prisma `User` type instead. */
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

/** @deprecated Use Prisma `Tenant` type instead. */
export interface DbTenant {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "pro" | "enterprise";
  createdAt: Date;
  updatedAt: Date;
}

/** @deprecated Use Prisma-generated types instead. */
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
