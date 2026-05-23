/* ─────────────────────────────────────────────
 * API Contracts - Request/Response shapes
 * ──────────────────────────────────────────── */

/** Standard API response envelope */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: string;
}

/** Paginated list response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Page CRUD request types */
export interface CreatePageRequest {
  title: string;
  slug?: string;
  templateId?: string;
  content?: Record<string, unknown>;
  meta?: {
    title?: string;
    description?: string;
  };
}

export interface UpdatePageRequest {
  title?: string;
  slug?: string;
  status?: "draft" | "published" | "archived" | "scheduled";
  content?: Record<string, unknown>;
  meta?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
}

/** Query parameters for listing pages */
export interface ListPagesQuery {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  sortBy?: "updatedAt" | "createdAt" | "title";
  sortOrder?: "asc" | "desc";
}
