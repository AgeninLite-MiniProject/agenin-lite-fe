import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductApi } from "@/lib/api/admin-product.api";
import type { CreateProductFormValues, UpdateProductFormValues } from "@/schemas/product.schema";
import toast from "react-hot-toast";

export const adminProductsQueryKey = ["admin-products"];

export function useAdminProductsQuery() {
  return useQuery({
    queryKey: adminProductsQueryKey,
    queryFn: () => adminProductApi.getAllProducts(),
    staleTime: 30_000,
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductFormValues) => adminProductApi.createProduct(data),
    onSuccess: () => {
      toast.success("Produk berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: adminProductsQueryKey });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Gagal menambahkan produk.";
      toast.error(msg);
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: UpdateProductFormValues }) => 
      adminProductApi.updateProduct(productId, data),
    onSuccess: () => {
      toast.success("Produk berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: adminProductsQueryKey });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Gagal mengubah produk.";
      toast.error(msg);
    },
  });
}
