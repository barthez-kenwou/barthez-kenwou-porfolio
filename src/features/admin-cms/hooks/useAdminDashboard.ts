import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api';
import { fetchAdminDashboard } from '../api/dashboard.api';

export function useAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.root,
    queryFn: () => fetchAdminDashboard(),
  });
}
