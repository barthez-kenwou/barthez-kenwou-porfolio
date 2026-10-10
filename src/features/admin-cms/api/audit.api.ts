import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';

export type AuditEntry = {
  id: string;
  actorId?: string | null;
  action: string;
  resource?: string | null;
  resourceId?: string | null;
  requestId?: string | null;
  metadata?: Record<string, unknown> | null;
  userAgent?: string | null;
  createdAt: string;
};

export type AuditListParams = PaginationParams & {
  actorId?: string;
  action?: string;
  resource?: string;
  from?: string;
  to?: string;
};

export async function listAuditEntries(
  params?: AuditListParams,
): Promise<PaginatedData<AuditEntry>> {
  return apiClient.get<PaginatedData<AuditEntry>>('/admin/audit', toQueryParams(params));
}

export async function getAuditEntry(id: string): Promise<AuditEntry> {
  return apiClient.get<AuditEntry>(`/admin/audit/${id}`);
}

export const auditApi = {
  list: listAuditEntries,
  getById: getAuditEntry,
};
