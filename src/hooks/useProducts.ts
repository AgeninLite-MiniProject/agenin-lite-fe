import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/lib/api/product.api";

export const activeProductsQueryKey = ["active-products"];

export function useProducts() {
  return useQuery({
    queryKey: activeProductsQueryKey,
    queryFn: () => productApi.getActiveProducts(),
    staleTime: 60_000,
  });
}
