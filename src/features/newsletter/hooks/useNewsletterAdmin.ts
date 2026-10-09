import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, type PaginationParams } from '@/shared/api';
import {
  broadcastNewsletter,
  deleteNewsletterSubscriber,
  getNewsletterStats,
  listNewsletterCampaigns,
  listNewsletterSubscribers,
  type NewsletterBroadcastPayload,
  type NewsletterCampaignListParams,
  type NewsletterSubscriberListParams,
} from '../api/newsletter-admin.api';

export function useNewsletterStats() {
  return useQuery({
    queryKey: queryKeys.newsletter.stats,
    queryFn: getNewsletterStats,
  });
}

type NewsletterQueryParams = PaginationParams & Record<string, unknown>;

export function useNewsletterSubscribers(params?: NewsletterSubscriberListParams) {
  return useQuery({
    queryKey: queryKeys.newsletter.subscribers(params as NewsletterQueryParams | undefined),
    queryFn: () => listNewsletterSubscribers({ limit: 100, ...params }),
  });
}

export function useNewsletterCampaigns(params?: NewsletterCampaignListParams) {
  return useQuery({
    queryKey: queryKeys.newsletter.campaigns(params as NewsletterQueryParams | undefined),
    queryFn: () => listNewsletterCampaigns({ limit: 100, ...params }),
  });
}

export function useDeleteNewsletterSubscriber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNewsletterSubscriber,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['newsletter'] });
    },
  });
}

export function useBroadcastNewsletter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewsletterBroadcastPayload) => broadcastNewsletter(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['newsletter'] });
    },
  });
}

/** Alias kept for barrel exports that still reference create campaign. */
export function useCreateNewsletterCampaign() {
  return useBroadcastNewsletter();
}

export function useNewsletterAdminMutations() {
  return {
    removeSubscriber: useDeleteNewsletterSubscriber(),
    broadcast: useBroadcastNewsletter(),
  };
}
