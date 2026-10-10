import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';

/** Aligns with backend newsletter stats serializer. */
export interface NewsletterStats {
  total: number;
  pending: number;
  active: number;
  unsubscribed: number;
  bounced: number;
}

export interface NewsletterCampaignStats {
  total: number;
  queued: number;
  sending: number;
  sent: number;
  failed: number;
  cancelled: number;
  byType: {
    confirm: number;
    welcome: number;
    blog_publish: number;
    digest: number;
    broadcast: number;
  };
  totalRecipients: number;
  totalSent: number;
  totalFailed: number;
}

export type NewsletterSubscriberStatus = 'pending' | 'active' | 'unsubscribed' | 'bounced';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  locale?: string;
  source?: string | null;
  status: NewsletterSubscriberStatus | string;
  confirmedAt?: string | null;
  unsubscribedAt?: string | null;
  lastEmailedAt?: string | null;
  welcomeSentAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type NewsletterCampaignType =
  | 'confirm'
  | 'welcome'
  | 'blog_publish'
  | 'digest'
  | 'broadcast';

export type NewsletterCampaignStatus =
  | 'queued'
  | 'sending'
  | 'sent'
  | 'failed'
  | 'cancelled';

export interface NewsletterCampaign {
  id: string;
  type?: NewsletterCampaignType | string;
  status: NewsletterCampaignStatus | string;
  subjectFr?: string;
  subjectEn?: string;
  previewFr?: string;
  previewEn?: string;
  template?: string;
  blogId?: string | null;
  createdById?: string | null;
  totalRecipients?: number;
  sentCount?: number;
  failCount?: number;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  payload?: Record<string, unknown> | null;
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
  /** Optional audience segment (active subscribers only). */
  locale?: 'fr' | 'en';
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

export async function getNewsletterCampaignStats(): Promise<NewsletterCampaignStats> {
  return apiClient.get<NewsletterCampaignStats>('/newsletter/campaigns/stats');
}

export async function listNewsletterSubscribers(
  params?: NewsletterSubscriberListParams,
): Promise<PaginatedData<NewsletterSubscriber>> {
  return apiClient.get<PaginatedData<NewsletterSubscriber>>(
    '/newsletter/subscribers',
    toQueryParams(params),
  );
}

export async function getNewsletterSubscriber(id: string): Promise<NewsletterSubscriber> {
  return apiClient.get<NewsletterSubscriber>(`/newsletter/subscribers/${id}`);
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

export async function getNewsletterCampaign(id: string): Promise<NewsletterCampaign> {
  return apiClient.get<NewsletterCampaign>(`/newsletter/campaigns/${id}`);
}

export async function cancelNewsletterCampaign(id: string): Promise<NewsletterCampaign> {
  return apiClient.post<NewsletterCampaign>(`/newsletter/campaigns/${id}/cancel`);
}

export async function broadcastNewsletter(
  payload: NewsletterBroadcastPayload,
): Promise<{ campaignId: string }> {
  return apiClient.post<{ campaignId: string }>('/newsletter/campaigns/broadcast', payload);
}

/** @deprecated Prefer broadcastNewsletter — backend has no generic POST /campaigns create. */
export async function createNewsletterCampaign(
  payload: NewsletterBroadcastPayload,
): Promise<{ campaignId: string }> {
  return broadcastNewsletter(payload);
}

export const newsletterAdminApi = {
  stats: getNewsletterStats,
  campaignStats: getNewsletterCampaignStats,
  listSubscribers: listNewsletterSubscribers,
  getSubscriber: getNewsletterSubscriber,
  deleteSubscriber: deleteNewsletterSubscriber,
  listCampaigns: listNewsletterCampaigns,
  getCampaign: getNewsletterCampaign,
  cancelCampaign: cancelNewsletterCampaign,
  broadcast: broadcastNewsletter,
};
