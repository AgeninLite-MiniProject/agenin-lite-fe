import { useQuery } from "@tanstack/react-query";
import {
  phoneSearchApi,
  type PhoneSearchUser,
} from "@/lib/api/phone-search.api";

export const phoneSearchQueryKey = ["phone-search"] as const;

export function usePhoneSearchQuery(phone: string) {
  return useQuery<PhoneSearchUser[]>({
    queryKey: [...phoneSearchQueryKey, phone],
    queryFn: () => phoneSearchApi.searchByPhonePrefix(phone),
    enabled: phone.length >= 3,
    staleTime: 60_000,
    retry: 1
  });
}
