import { useQuery } from "@tanstack/react-query";
import { transactionApi, transactionDetailQueryKey } from "@/lib/api/transaction.api";

export function useTransactionDetailQuery(id: string | undefined) {
  return useQuery({
    queryKey: transactionDetailQueryKey(id ?? ""),
    queryFn: () => transactionApi.getDetail(id!),
    enabled: !!id,
    staleTime: 30_000,
  });
}
