import { apiClient } from '@/shared/api/client';
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

/**
 * Single entry point for newsletter signup.
 * Backend: POST /newsletter/subscribe
 * Body: { email, locale, source? }
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
