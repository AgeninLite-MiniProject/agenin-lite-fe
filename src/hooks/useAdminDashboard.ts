import { useQuery } from "@tanstack/react-query";
import { adminDashboardApi } from "@/lib/api/admin-dashboard.api";

export const adminDashboardQueryKey = ["adminDashboardOverview"];

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: adminDashboardQueryKey,
    queryFn: () => adminDashboardApi.getOverview(),
    staleTime: 60_000,
  });
}
