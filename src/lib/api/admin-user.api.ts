import apiClient from "../axios";

export interface UserSearchResponse {
  user_id: string;
  name: string;
  role: string;
  user_status: string;
  is_deleted: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const adminUserApi = {
  searchUsers: async (q: string = "", page: number = 0, size: number = 20): Promise<PaginatedResponse<UserSearchResponse>> => {
    const response = await apiClient.get("/api/admin/users", {
      params: { q, page, size }
    });
    return response.data;
  },

  softDeleteUser: async (userId: string) => {
    const response = await apiClient.post(`/api/admin/users/${userId}/delete`);
    return response.data;
  }
};
