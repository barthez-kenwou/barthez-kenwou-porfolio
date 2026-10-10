export { subscribeNewsletter } from './api/newsletter.api';
export type {
  NewsletterSubscribeResult,
  NewsletterSubscribeErrorCode,
} from './api/newsletter.api';
export { newsletterAdminApi } from './api/newsletter-admin.api';
export type {
  NewsletterStats,
  NewsletterCampaignStats,
  NewsletterSubscriber,
  NewsletterSubscriberStatus,
  NewsletterCampaign,
  NewsletterCampaignType,
  NewsletterCampaignStatus,
  NewsletterBroadcastPayload,
  NewsletterSubscriberListParams,
  NewsletterCampaignListParams,
} from './api/newsletter-admin.api';
export {
  useNewsletterStats,
  useNewsletterCampaignStats,
  useNewsletterSubscribers,
  useNewsletterSubscriber,
  useNewsletterCampaigns,
  useNewsletterCampaign,
  useCreateNewsletterCampaign,
  useBroadcastNewsletter,
  useCancelNewsletterCampaign,
  useDeleteNewsletterSubscriber,
  useNewsletterAdminMutations,
} from './hooks/useNewsletterAdmin';
export {
  newsletterSubscribeSchema,
  type NewsletterSubscribeInput,
} from './model/newsletter.schema';
