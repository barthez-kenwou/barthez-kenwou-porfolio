import { useQuery } from '@tanstack/react-query';
import { listAuditEntries, type AuditListParams } from '../api/audit.api';

export function useAdminAudit(params?: AuditListParams) {
  return useQuery({
    queryKey: ['admin', 'audit', params ?? {}] as const,
    queryFn: () => listAuditEntries({ limit: 20, ...params }),
    staleTime: 30_000,
  });
}
