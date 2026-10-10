import { apiClient } from '@/shared/api';

export type AnalyticsPeriod = 'day' | '7d' | '30d' | 'month' | '6mo' | '12mo';

export type AnalyticsPageRow = {
  path: string;
  visitors: number;
  pageviews: number;
};

export type AnalyticsSourceRow = {
  source: string;
  visitors: number;
};

export type AnalyticsContentRow = {
  path: string;
  slug: string;
  views: number;
  visitors: number;
};

export type AnalyticsEventRow = {
  name: string;
  visitors: number;
};

export type AnalyticsTimeseriesPoint = {
  date: string;
  visitors: number;
  pageviews: number;
};

export type AdminAnalyticsOverview = {
  configured: boolean;
  publicUrl: string;
  siteId: string;
  period: AnalyticsPeriod;
  visitors: number;
  pageviews: number;
  visits: number;
  bounceRate: number;
  visitDuration: number;
  /** Present after API deploy with timeseries support; treat missing as []. */
  timeseries?: AnalyticsTimeseriesPoint[];
  topPages: AnalyticsPageRow[];
  topSources: AnalyticsSourceRow[];
  topBlogs: AnalyticsContentRow[];
  topProjects: AnalyticsContentRow[];
  events: AnalyticsEventRow[];
};

export async function fetchAnalyticsOverview(
  period: AnalyticsPeriod = '7d',
): Promise<AdminAnalyticsOverview> {
  return apiClient.get<AdminAnalyticsOverview>('/admin/analytics/overview', { period });
}

export const analyticsApi = {
  overview: fetchAnalyticsOverview,
};
