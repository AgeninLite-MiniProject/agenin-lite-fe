import { z } from "zod";

export const TransactionStatusSchema = z.enum([
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "FAILED",
]);
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;

// Money fields are serialized by Jackson as JSON numbers (BigDecimal),
// not strings. Declaring them as z.number() matches the wire format.
// formatRupiah already accepts string | number, so downstream code is fine.
export const TransactionListItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid().nullable(),
  productName: z.string().nullable(),
  quantity: z.number().int().nullable(),
  amount: z.number(),
  profit: z.number(),
  agentFeeAmount: z.number(),
  superAgentFeeAmount: z.number(),
  status: TransactionStatusSchema,
  createdAt: z.string(),
  completedAt: z.string().nullable(),
});
export type TransactionListItem = z.infer<typeof TransactionListItemSchema>;

export const TransactionListResponseSchema = z.object({
  transactions: z.array(TransactionListItemSchema),
  totalCommission: z.number(),
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

// V2 list-item shape (returned by GET /api/transactions?v=2)
// and used by the History page.
export const TransactionItemLineSchema = z.object({
  itemId: z.string().uuid(),
  productId: z.string().uuid().nullable(),
  productName: z.string().nullable(),
  quantity: z.number().int(),
  itemAmount: z.number(),
  profit: z.number(),
  agentFeeAmount: z.number(),
});
export type TransactionItemLine = z.infer<typeof TransactionItemLineSchema>;

export const TransactionListItemV2Schema = z.object({
  id: z.string().uuid(),
  status: TransactionStatusSchema,
  createdAt: z.string(),
  completedAt: z.string().nullable(),
  amount: z.number(),
  profit: z.number(),
  agentFeeAmount: z.number(),
  superAgentFeeAmount: z.number(),
  totalQuantity: z.number().int().min(0),
  items: z.array(TransactionItemLineSchema),
});
export type TransactionListItemV2 = z.infer<typeof TransactionListItemV2Schema>;

export const TransactionListResponseV2Schema = z.object({
  transactions: z.array(TransactionListItemV2Schema),
  totalCommission: z.number(),
  completedCount: z.number().int().min(0),
  page: z.number().int().min(0),
  size: z.number().int().min(1),
  totalElements: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});
export type TransactionListResponseV2 = z.infer<typeof TransactionListResponseV2Schema>;
