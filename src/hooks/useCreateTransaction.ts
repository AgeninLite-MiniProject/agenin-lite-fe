import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionApi } from "@/lib/api/transaction.api";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { items: { productId: string; quantity: number }[]; description?: string }) =>
      transactionApi.create(payload),
    onSuccess: () => {
      // Invalidate transaction lists so the pending page gets the new data
      queryClient.invalidateQueries({
        queryKey: ["transaction-list"],
      });
    },
  });
}
