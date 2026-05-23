/* ─────────────────────────────────────────────
 * Page Schema - The core content entity
 * ──────────────────────────────────────────── */

import type { CanvasDocument } from "./editor";

/** Publication lifecycle states */
export type PageStatus = "draft" | "published" | "archived" | "scheduled";

/** SEO / Open Graph metadata */
export interface PageMeta {
  title?: string;
  description?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

/** Core page entity */
export interface Page {
  id: string;
  slug: string;
  title: string;
  status: PageStatus;
  templateId?: string;
  /** Canvas document - the full freeform editor content */
  content: CanvasDocument;
  meta: PageMeta;
  /** ISO-8601 timestamps */
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  /** Future multi-tenant support */
  tenantId?: string;
  createdBy?: string;
  /** Versioning */
  version: number;
  locale?: string;
}

/** Minimal page reference for listings */
export interface PageSummary {
  id: string;
  slug: string;
  title: string;
  status: PageStatus;
  updatedAt: string;
  templateId?: string;
}
