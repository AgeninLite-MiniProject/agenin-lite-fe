import apiClient from "../axios";
import type { AuditLog, AuditLogParams } from "../../types/audit.type";
import type { PaginatedResponse } from "./admin-user.api";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const adminAuditApi = {
  getAuditLogs: async (params: AuditLogParams): Promise<ApiResponse<PaginatedResponse<AuditLog>>> => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== "" && v !== "ALL")
    );
    
    const response = await apiClient.get("/api/admin/audit-logs", { params: cleanParams });
    return response.data;
  }
};
