import apiClient from "../axios";
import { z } from "zod";

export const ProductResponseSchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  cost_price: z.number().optional(),
  selling_price: z.number(),
  agent_fee: z.number(),
  super_agent_fee: z.number(),
  product_status: z.string(),
  message: z.string().optional().nullable(),
});

export type ProductResponse = z.infer<typeof ProductResponseSchema>;

export const productApi = {
  getActiveProducts: async (): Promise<ProductResponse[]> => {
    const response = await apiClient.get("/api/products");
    return z.array(ProductResponseSchema).parse(response.data);
  },
};
