// lib/api/transaction.api.ts
// One file that knows: (1) the API path, (2) the request shape, (3) the cache key.
// Page and hook only import from here. Nothing else knows about /api/transactions.
// The mock + USE_MOCK toggle that was here in stub phase is GONE — the BE is live.

import apiClient from "../axios";
import {
  TransactionListResponseSchema,
  TransactionListResponseV2Schema,
  TransactionDetailResponseSchema,
  type TransactionFilter,
  type TransactionListResponse,
  type TransactionListResponseV2,
  type TransactionDetailResponse,
} from "@/schemas/transaction.schema";

// ─── Query key ───────────────────────────────────────────────────────
// Used by useQuery (the key is just a unique label for caching)
// and by future invalidateQueries() calls from other pages.
export const transactionListQueryKey = (filter: TransactionFilter) =>
  ["transaction-list", filter] as const;

export const transactionDetailQueryKey = (id: string) =>
  ["transaction-detail", id] as const;

// ─── API surface ─────────────────────────────────────────────────────
// Only this object is exported. Page and hook only ever see this.
export const transactionApi = {
  // Fetches one page of transactions (V1). Honors status + page + size.
  list: async (filter: TransactionFilter): Promise<TransactionListResponse> => {
    // Build the query string. role=SELLER is hardcoded — this page is always the seller's own history.
    const params: Record<string, string | number> = {
      role: "SELLER",
      page: filter.page,
      size: filter.size,
    };
    // Don't send ?status=ALL — BE treats missing as "all".
    if (filter.status !== "ALL") params.status = filter.status;

    // Call the real BE. The auth header is added by apiClient's request interceptor.
    const response = await apiClient.get("/api/transactions", { params });

    // BE wraps the payload in { success, message, data: {...} }.
    // We unwrap it here and parse with zod to catch contract drift.
    // If the BE ever renames a field, this parse() throws and the page shows the error state.
    return TransactionListResponseSchema.parse(response.data.data);
  },

  // Fetches one page of transactions with V2 response shape (includes items array).
  listV2: async (filter: TransactionFilter): Promise<TransactionListResponseV2> => {
    const params: Record<string, string | number> = {
      role: "SELLER",
      v: 2,
      page: filter.page,
      size: filter.size,
    };
    if (filter.status !== "ALL") params.status = filter.status;

    const response = await apiClient.get("/api/transactions", { params });
    return TransactionListResponseV2Schema.parse(response.data.data);
  },

  // Fetches full detail of a single transaction (used by expand).
  getDetail: async (id: string): Promise<TransactionDetailResponse> => {
    const response = await apiClient.get(`/api/transactions/${id}`);
    return TransactionDetailResponseSchema.parse(response.data.data);
  },

  create: async (payload: { items: { productId: string; quantity: number }[]; description?: string }) => {
    const response = await apiClient.post("/api/transactions", payload);
    return response.data;
  },

  complete: async (id: string) => {
    const response = await apiClient.post(`/api/transactions/${id}/complete`);
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await apiClient.post(`/api/transactions/${id}/cancel`);
    return response.data;
  },

  fail: async (id: string) => {
    const response = await apiClient.post(`/api/transactions/${id}/fail`);
    return response.data;
  },
};
