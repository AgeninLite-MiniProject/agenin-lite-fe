import apiClient from "../axios";

export interface RecentActivity {
  time: string;
  user: string;
  action: string;
  status: string;
}

export interface AdminDashboardResponse {
  total_users: number;
  active_agents: number;
  total_transactions: number;
  total_products: number;
  recent_activities: RecentActivity[];
}

export const adminDashboardApi = {
  getOverview: async (): Promise<AdminDashboardResponse> => {
    const response = await apiClient.get("/api/admin/dashboard");
    return response.data;
  },
};
