import type { ApiResponse } from "@productix/types";

export interface ApiClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

/**
 * Typed API client factory.
 *
 * Creates a lightweight, fetch-based client with typed responses.
 * Designed to be extended with auth headers and error handling.
 */
export function createApiClient(config: ApiClientConfig) {
  const { baseUrl, headers: defaultHeaders = {} } = config;

  async function request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${baseUrl}${path}`;
    const headers = {
      "Content-Type": "application/json",
      ...defaultHeaders,
      ...((options.headers as Record<string, string>) || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      return {
        data: null as unknown as T,
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        timestamp: new Date().toISOString(),
      };
    }

    const data = await response.json();
    return {
      data,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    get: <T>(path: string) => request<T>(path, { method: "GET" }),
    post: <T>(path: string, body: unknown) =>
      request<T>(path, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    put: <T>(path: string, body: unknown) =>
      request<T>(path, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    patch: <T>(path: string, body: unknown) =>
      request<T>(path, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
