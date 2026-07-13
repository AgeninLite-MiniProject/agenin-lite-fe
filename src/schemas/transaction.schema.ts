import { z } from "zod";

export const TransactionStatusSchema = z.enum([
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "FAILED",
]);
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;

export const TransactionListItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid().nullable(),
  productName: z.string().nullable(),
  quantity: z.number().int().nullable(),
  amount: z.string(),
  profit: z.string(),
  agentFeeAmount: z.string(),
  superAgentFeeAmount: z.string(),
  status: TransactionStatusSchema,
  createdAt: z.string(),
  completedAt: z.string().nullable(),
});
export type TransactionListItem = z.infer<typeof TransactionListItemSchema>;

export const TransactionListResponseSchema = z.object({
  transactions: z.array(TransactionListItemSchema),
  totalCommission: z.string(),
  completedCount: z.number().int().min(0),
  page: z.number().int().min(0),
  size: z.number().int().min(1),
  totalElements: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});
export type TransactionListResponse = z.infer<typeof TransactionListResponseSchema>;

export const TransactionFilterSchema = z.object({
  status: z.enum(["ALL", "PENDING", "COMPLETED", "FAILED", "CANCELLED"]),
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).default(20),
});
export type TransactionFilter = z.infer<typeof TransactionFilterSchema>;
