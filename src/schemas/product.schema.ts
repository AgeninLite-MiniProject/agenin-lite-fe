import { z } from "zod";

// Create Product
export const createProductSchema = z.object({
  product_name: z.string().min(1, { message: "PRD_0003: Product name is required" }),
  cost_price: z.coerce.number().min(0, { message: "PRD_0008: Value cannot be negative" }),
  selling_price: z.coerce.number().min(0, { message: "PRD_0008: Value cannot be negative" }),
  agent_fee: z.coerce.number().min(0, { message: "PRD_0008: Value cannot be negative" }),
  super_agent_fee: z.coerce.number().min(0, { message: "PRD_0008: Value cannot be negative" }),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;

// Update Product
export const updateProductSchema = z.object({
  product_name: z.string().optional(),
  cost_price: z.coerce.number().min(0, { message: "PRD_0008: Value cannot be negative" }).optional(),
  selling_price: z.coerce.number().min(0, { message: "PRD_0008: Value cannot be negative" }).optional(),
  agent_fee: z.coerce.number().min(0, { message: "PRD_0008: Value cannot be negative" }).optional(),
  super_agent_fee: z.coerce.number().min(0, { message: "PRD_0008: Value cannot be negative" }).optional(),
  product_status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export type UpdateProductFormValues = z.infer<typeof updateProductSchema>;
