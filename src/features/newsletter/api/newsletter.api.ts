import { apiClient } from '@/shared/api';
import type { PaginatedData } from '@/shared/api';
import type { NewsletterSubscribeInput } from '../model/newsletter.schema';

export type NewsletterSubscribeErrorCode =
  | 'invalid_email'
  | 'already_subscribed'
  | 'rate_limited'
  | 'unavailable'
  | 'unknown';

export type NewsletterSubscribeResult =
  | { ok: true }
  | { ok: false; code: NewsletterSubscribeErrorCode };

export type NewsletterSubscriber = {
  id: string;
  email: string;
  locale: 'fr' | 'en' | string;
  status: 'pending' | 'active' | 'unsubscribed' | 'bounced' | string;
  source?: string | null;
  confirmedAt?: string | null;
  unsubscribedAt?: string | null;
  lastEmailedAt?: string | null;
  welcomeSentAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type NewsletterStats = {
  total: number;
  pending: number;
  active: number;
  unsubscribed: number;
  bounced: number;
};

export type NewsletterCampaign = {
  id: string;
  type: string;
  status: string;
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
};

export type BroadcastInput = {
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
};

/**
 * Public newsletter signup.
 * Backend: POST /newsletter/subscribe
 */
export async function subscribeNewsletter(
  input: NewsletterSubscribeInput,
): Promise<NewsletterSubscribeResult> {
  try {
    await apiClient.post('/newsletter/subscribe', {
      email: input.email.trim().toLowerCase(),
      locale: input.locale,
      source: input.source ?? 'blog',
    });
    return { ok: true };
  } catch (error: unknown) {
    const status =
      typeof error === 'object' && error && 'statusCode' in error
        ? Number((error as { statusCode?: number }).statusCode)
        : undefined;
    const code =
      typeof error === 'object' && error && 'code' in error
        ? String((error as { code?: string }).code)
        : undefined;

    if (status === 409 || code === 'already_subscribed') {
      return { ok: false, code: 'already_subscribed' };
    }
    if (status === 429 || code === 'rate_limited') {
      return { ok: false, code: 'rate_limited' };
    }
    if (status === 400 || code === 'invalid_email') {
      return { ok: false, code: 'invalid_email' };
    }
    if (status === 404 || status === 501 || status === 503) {
      return { ok: false, code: 'unavailable' };
    }

    return { ok: false, code: 'unknown' };
  }
}

export async function getNewsletterStats(): Promise<NewsletterStats> {
  return apiClient.get<NewsletterStats>('/newsletter/stats');
}

export async function listNewsletterSubscribers(params?: {
  page?: number;
  limit?: number;
  status?: string;
  locale?: string;
  q?: string;
}): Promise<PaginatedData<NewsletterSubscriber>> {
  return apiClient.get<PaginatedData<NewsletterSubscriber>>('/newsletter/subscribers', params);
}

export async function deleteNewsletterSubscriber(id: string): Promise<unknown> {
  return apiClient.delete(`/newsletter/subscribers/${id}`);
}

export async function listNewsletterCampaigns(params?: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}): Promise<PaginatedData<NewsletterCampaign>> {
  return apiClient.get<PaginatedData<NewsletterCampaign>>('/newsletter/campaigns', params);
}

export async function broadcastNewsletter(body: BroadcastInput): Promise<NewsletterCampaign> {
  return apiClient.post<NewsletterCampaign>('/newsletter/campaigns/broadcast', body);
}
