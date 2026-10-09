import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';

/** Aligns with backend newsletter stats serializer. */
export interface NewsletterStats {
  total: number;
  pending: number;
  active: number;
  unsubscribed: number;
  bounced: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  locale?: string;
  source?: string | null;
  status: 'pending' | 'active' | 'unsubscribed' | 'bounced' | string;
  confirmedAt?: string | null;
  unsubscribedAt?: string | null;
  lastEmailedAt?: string | null;
  welcomeSentAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsletterCampaign {
  id: string;
  type?: string;
  status: string;
  subjectFr?: string;
  subjectEn?: string;
  previewFr?: string;
  previewEn?: string;
  template?: string;
  blogId?: string | null;
  totalRecipients?: number;
  sentCount?: number;
  failCount?: number;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsletterBroadcastPayload {
  subjectFr: string;
  subjectEn: string;
  headlineFr: string;
  headlineEn: string;
  bodyFr: string;
  bodyEn: string;
  previewFr?: string;
  previewEn?: string;
  ctaUrl?: string;
  ctaLabelFr?: string;
  ctaLabelEn?: string;
}

export interface NewsletterSubscriberListParams extends PaginationParams {
  status?: string;
  locale?: string;
  q?: string;
}

export interface NewsletterCampaignListParams extends PaginationParams {
  type?: string;
  status?: string;
}

export async function getNewsletterStats(): Promise<NewsletterStats> {
  return apiClient.get<NewsletterStats>('/newsletter/stats');
}

export async function listNewsletterSubscribers(
  params?: NewsletterSubscriberListParams,
): Promise<PaginatedData<NewsletterSubscriber>> {
  return apiClient.get<PaginatedData<NewsletterSubscriber>>(
    '/newsletter/subscribers',
    toQueryParams(params),
  );
}

export async function deleteNewsletterSubscriber(id: string): Promise<void> {
  await apiClient.delete(`/newsletter/subscribers/${id}`);
}

export async function listNewsletterCampaigns(
  params?: NewsletterCampaignListParams,
): Promise<PaginatedData<NewsletterCampaign>> {
  return apiClient.get<PaginatedData<NewsletterCampaign>>(
    '/newsletter/campaigns',
    toQueryParams(params),
  );
}

export async function broadcastNewsletter(
  payload: NewsletterBroadcastPayload,
): Promise<NewsletterCampaign> {
  return apiClient.post<NewsletterCampaign>('/newsletter/campaigns/broadcast', payload);
}

/** @deprecated Prefer broadcastNewsletter — backend has no generic POST /campaigns create. */
export async function createNewsletterCampaign(
  payload: NewsletterBroadcastPayload,
): Promise<NewsletterCampaign> {
  return broadcastNewsletter(payload);
}

export const newsletterAdminApi = {
  stats: getNewsletterStats,
  listSubscribers: listNewsletterSubscribers,
  deleteSubscriber: deleteNewsletterSubscriber,
  listCampaigns: listNewsletterCampaigns,
  broadcast: broadcastNewsletter,
};
