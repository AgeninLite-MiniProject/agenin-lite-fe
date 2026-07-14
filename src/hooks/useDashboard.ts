import { getDasboardSummary } from "@/lib/api/dashboard.api"
import type { DashboardResponse } from "@/types/dashboard.type"
import { useQuery } from "@tanstack/react-query"

export const useDashboardSummary = () => {
    return useQuery<DashboardResponse, Error>({
        queryKey: ["dashboard-summary"],
        queryFn: getDasboardSummary,
    });
};