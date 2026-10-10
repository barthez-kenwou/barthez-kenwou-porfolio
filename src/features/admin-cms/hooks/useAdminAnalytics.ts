import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api';
import {
  fetchAnalyticsOverview,
  type AnalyticsPeriod,
} from '../api/analytics.api';

export function useAdminAnalytics(period: AnalyticsPeriod = '7d') {
  return useQuery({
    queryKey: queryKeys.analytics.overview(period),
    queryFn: () => fetchAnalyticsOverview(period),
    staleTime: 60_000,
    retry: 1,
  });
}
