import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, type PaginationParams } from '@/shared/api';
import {
  broadcastNewsletter,
  cancelNewsletterCampaign,
  deleteNewsletterSubscriber,
  getNewsletterCampaign,
  getNewsletterCampaignStats,
  getNewsletterStats,
  getNewsletterSubscriber,
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

export function useNewsletterCampaignStats() {
  return useQuery({
    queryKey: queryKeys.newsletter.campaignStats,
    queryFn: getNewsletterCampaignStats,
  });
}

type NewsletterQueryParams = PaginationParams & Record<string, unknown>;

export function useNewsletterSubscribers(params?: NewsletterSubscriberListParams) {
  return useQuery({
    queryKey: queryKeys.newsletter.subscribers(params as NewsletterQueryParams | undefined),
    queryFn: () => listNewsletterSubscribers({ limit: 100, ...params }),
  });
}

export function useNewsletterSubscriber(id: string | null) {
  return useQuery({
    queryKey: queryKeys.newsletter.subscriber(id ?? ''),
    queryFn: () => getNewsletterSubscriber(id!),
    enabled: !!id,
  });
}

export function useNewsletterCampaigns(params?: NewsletterCampaignListParams) {
  return useQuery({
    queryKey: queryKeys.newsletter.campaigns(params as NewsletterQueryParams | undefined),
    queryFn: () => listNewsletterCampaigns({ limit: 100, ...params }),
  });
}

export function useNewsletterCampaign(id: string | null) {
  return useQuery({
    queryKey: queryKeys.newsletter.campaign(id ?? ''),
    queryFn: () => getNewsletterCampaign(id!),
    enabled: !!id,
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

export function useCancelNewsletterCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelNewsletterCampaign,
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
    cancelCampaign: useCancelNewsletterCampaign(),
  };
}
