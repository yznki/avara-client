export interface AdminAuditLogResponse {
  _id: string;
  adminId: string;
  action: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
