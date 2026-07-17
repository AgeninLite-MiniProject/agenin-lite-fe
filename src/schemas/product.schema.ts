import { z } from "zod";

const requiredNumber = (requiredMessage: string) =>
  z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number({ 
    message: requiredMessage
  }).min(0, { message: "Value cannot be negative" }));

// Create Product
export const createProductSchema = z.object({
  product_name: z.string().min(1, { message: "Product name is required" }),
  cost_price: requiredNumber("Cost price is required"),
  selling_price: requiredNumber("Selling price is required"),
  agent_fee: requiredNumber("Agent fee is required"),
  super_agent_fee: requiredNumber("Super agent fee is required"),
}).superRefine((data, ctx) => {
  if (typeof data.cost_price === 'number' && typeof data.selling_price === 'number') {
    if (data.selling_price <= data.cost_price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selling price must be greater than cost price",
        path: ["selling_price"],
      });
    }
  }
  if (typeof data.agent_fee === 'number' && typeof data.super_agent_fee === 'number') {
    if (data.agent_fee + data.super_agent_fee > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total fee percentage cannot exceed 100",
        path: ["agent_fee"],
      });
    }
  }
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;

// Update Product
export const updateProductSchema = z.object({
  product_name: z.string().min(1, { message: "Product name is required" }),
  cost_price: requiredNumber("Cost price is required"),
  selling_price: requiredNumber("Selling price is required"),
  agent_fee: requiredNumber("Agent fee is required"),
  super_agent_fee: requiredNumber("Super agent fee is required"),
  product_status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
}).superRefine((data, ctx) => {
  if (typeof data.cost_price === 'number' && typeof data.selling_price === 'number') {
    if (data.selling_price <= data.cost_price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selling price must be greater than cost price",
        path: ["selling_price"],
      });
    }
  }
  if (typeof data.agent_fee === 'number' && typeof data.super_agent_fee === 'number') {
    if (data.agent_fee + data.super_agent_fee > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total fee percentage cannot exceed 100",
        path: ["agent_fee"],
      });
    }
  }
});

export type UpdateProductFormValues = z.infer<typeof updateProductSchema>;
