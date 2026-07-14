import type { DownlineDetailResponse } from "@/types/downline.type";
import apiClient from "../axios";

export const getDownlineDetail = async (id: string, page = 0, size = 20):
Promise<DownlineDetailResponse> => {
    const response = await apiClient.get<any>(`/api/downliners/${id}`, {params: { page, size }});
    return response.data.data;
}