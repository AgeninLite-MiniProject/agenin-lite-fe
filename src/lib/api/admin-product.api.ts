import axiosClient from "../axiosClient";
import type { CreateProductFormValues, UpdateProductFormValues } from "../../schemas/product.schema";

export const adminProductApi = {
  getAllProducts: async () => {
    const response = await axiosClient.get("/api/admin/products");
    return response.data;
  },

  createProduct: async (data: CreateProductFormValues) => {
    const response = await axiosClient.post("/api/admin/products", data);
    return response.data;
  },

  updateProduct: async (productId: string, data: UpdateProductFormValues) => {
    const response = await axiosClient.post(`/api/admin/products/${productId}/update`, data);
    return response.data;
  },

  setInactive: async (productId: string) => {
    const response = await axiosClient.post(`/api/admin/products/${productId}/inactive`);
    return response.data;
  }
};
