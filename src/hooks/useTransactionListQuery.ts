import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  transactionApi,
  transactionListQueryKey,
} from "@/lib/api/transaction.api";
import type { TransactionFilter } from "@/schemas/transaction.schema";

export function useTransactionListQuery(filter: TransactionFilter) {
  return useQuery({
    queryKey: transactionListQueryKey(filter),
    queryFn: () => transactionApi.list(filter),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export { transactionListQueryKey } from "@/lib/api/transaction.api";
