import axiosClient from "../axiosClient";

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
  searchUsers: async (q: string = "", status: string = "ALL", isDeleted: string = "ALL", page: number = 0, size: number = 20): Promise<PaginatedResponse<UserSearchResponse>> => {
    const params: any = { q, page, size };
    if (status && status !== "ALL") params.status = status;
    if (isDeleted && isDeleted !== "ALL") params.isDeleted = isDeleted === "TRUE";

    const response = await axiosClient.get("/api/admin/users", { params });
    return response.data;
  },

  softDeleteUser: async (userId: string) => {
    const response = await axiosClient.post(`/api/admin/users/${userId}/delete`);
    return response.data;
  }
};
