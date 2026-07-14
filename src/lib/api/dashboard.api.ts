import type { DashboardResponse } from "@/types/dashboard.type";
import apiClient from "../axios";

export const getDasboardSummary = async (): Promise<DashboardResponse> => {
    const response = await apiClient.get<any>("/api/dashboard");
    return response.data.data;
};