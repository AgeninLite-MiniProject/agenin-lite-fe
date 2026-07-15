export interface AuditLog {
  auditLogId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  payload: string;
  ipAddress: string;
  userAgent: string;
  auditStatus: string;
  createdAt: string;
}

export interface AuditLogParams {
  actorId?: string;
  action?: string;
  entityType?: string;
  auditStatus?: string;
  page?: number;
  size?: number;
  sort?: string;
}
