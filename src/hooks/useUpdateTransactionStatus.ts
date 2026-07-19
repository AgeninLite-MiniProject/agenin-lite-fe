import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionApi } from "@/lib/api/transaction.api";

export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: "complete" | "cancel" | "fail" }) => {
      if (action === "complete") return transactionApi.complete(id);
      if (action === "cancel") return transactionApi.cancel(id);
      return transactionApi.fail(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transaction-list"],
      });
    },
  });
}
