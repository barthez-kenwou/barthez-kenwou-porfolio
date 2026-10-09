export { subscribeNewsletter } from './api/newsletter.api';
export type {
  NewsletterSubscribeResult,
  NewsletterSubscribeErrorCode,
} from './api/newsletter.api';
export { newsletterAdminApi } from './api/newsletter-admin.api';
export type {
  NewsletterStats,
  NewsletterSubscriber,
  NewsletterCampaign,
  NewsletterBroadcastPayload,
} from './api/newsletter-admin.api';
export {
  useNewsletterStats,
  useNewsletterSubscribers,
  useNewsletterCampaigns,
  useCreateNewsletterCampaign,
  useBroadcastNewsletter,
  useDeleteNewsletterSubscriber,
  useNewsletterAdminMutations,
} from './hooks/useNewsletterAdmin';
export {
  newsletterSubscribeSchema,
  type NewsletterSubscribeInput,
} from './model/newsletter.schema';
