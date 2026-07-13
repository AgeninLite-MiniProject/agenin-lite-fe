import apiClient from "../axios";
import {
  TransactionListResponseSchema,
  type TransactionFilter,
  type TransactionListResponse,
} from "@/schemas/transaction.schema";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

const MOCK_TRANSACTION_LIST_RESPONSE: TransactionListResponse = {
  transactions: [
    {
      id: "11111111-1111-1111-1111-111111111112",
      productId: "22222222-2222-2222-2222-222222222201",
      productName: "Teh Pucuk Harum 1 Karton",
      quantity: 10,
      amount: "500000.00",
      profit: "50000.00",
      agentFeeAmount: "50000.00",
      superAgentFeeAmount: "0.00",
      status: "COMPLETED",
      createdAt: "2026-10-10T14:00:00",
      completedAt: "2026-10-10T14:01:23",
    },
    {
      id: "11111111-1111-1111-1111-111111111113",
      productId: "22222222-2222-2222-2222-222222222202",
      productName: "Kopi Kapal Api Mix 5 Renceng",
      quantity: 5,
      amount: "250000.00",
      profit: "25000.00",
      agentFeeAmount: "0.00",
      superAgentFeeAmount: "0.00",
      status: "PENDING",
      createdAt: "2026-10-11T09:15:00",
      completedAt: null,
    },
    {
      id: "11111111-1111-1111-1111-111111111114",
      productId: "22222222-2222-2222-2222-222222222203",
      productName: "Indomie Goreng 1 Dus",
      quantity: 2,
      amount: "220000.00",
      profit: "22000.00",
      agentFeeAmount: "0.00",
      superAgentFeeAmount: "0.00",
      status: "FAILED",
      createdAt: "2026-10-12T16:30:00",
      completedAt: null,
    },
    {
      id: "11111111-1111-1111-1111-111111111115",
      productId: "22222222-2222-2222-2222-222222222204",
      productName: "Bimoli Minyak Goreng 2L",
      quantity: 20,
      amount: "800000.00",
      profit: "80000.00",
      agentFeeAmount: "80000.00",
      superAgentFeeAmount: "0.00",
      status: "COMPLETED",
      createdAt: "2026-10-13T10:00:00",
      completedAt: "2026-10-13T10:02:11",
    },
  ],
  totalCommission: "1250000.00",
  completedCount: 45,
  page: 0,
  size: 20,
  totalElements: 4,
  totalPages: 1,
};

export const transactionListQueryKey = (filter: TransactionFilter) =>
  ["transaction-list", filter] as const;

export const transactionApi = {
  list: async (filter: TransactionFilter): Promise<TransactionListResponse> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 250));

      const filtered =
        filter.status === "ALL"
          ? MOCK_TRANSACTION_LIST_RESPONSE.transactions
          : MOCK_TRANSACTION_LIST_RESPONSE.transactions.filter(
              (t) => t.status === filter.status,
            );

      return TransactionListResponseSchema.parse({
        ...MOCK_TRANSACTION_LIST_RESPONSE,
        transactions: filtered,
        totalElements: filtered.length,
        totalPages: 1,
        page: 0,
        size: filter.size,
      });
    }

    const params: Record<string, string | number> = {
      role: "SELLER",
      page: filter.page,
      size: filter.size,
    };
    if (filter.status !== "ALL") params.status = filter.status;

    const response = await apiClient.get("/api/transactions", { params });
    return TransactionListResponseSchema.parse(response.data.data);
  },
};
