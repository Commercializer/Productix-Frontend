import type {
  Page,
  PageSummary,
  PaginatedResponse,
  CreatePageRequest,
  UpdatePageRequest,
  ListPagesQuery,
} from "@productix/types";
import type { ApiClient } from "./client";

/**
 * Page API operations.
 *
 * Scaffolded typed methods for page CRUD. Currently stubs —
 * will be connected to real API routes in phase 2.
 */
export function createPageApi(client: ApiClient) {
  return {
    list: (query?: ListPagesQuery) => {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", String(query.page));
      if (query?.pageSize) params.set("pageSize", String(query.pageSize));
      if (query?.status) params.set("status", query.status);
      if (query?.search) params.set("search", query.search);
      const qs = params.toString();
      return client.get<PaginatedResponse<PageSummary>>(
        `/pages${qs ? `?${qs}` : ""}`
      );
    },

    get: (id: string) => client.get<Page>(`/pages/${id}`),

    getBySlug: (slug: string) => client.get<Page>(`/pages/slug/${slug}`),

    create: (data: CreatePageRequest) =>
      client.post<Page>("/pages", data),

    update: (id: string, data: UpdatePageRequest) =>
      client.patch<Page>(`/pages/${id}`, data),

    delete: (id: string) => client.delete<void>(`/pages/${id}`),

    publish: (id: string) =>
      client.post<Page>(`/pages/${id}/publish`, {}),

    unpublish: (id: string) =>
      client.post<Page>(`/pages/${id}/unpublish`, {}),
  };
}

export type PageApi = ReturnType<typeof createPageApi>;
