import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, withPublicFallback, type ResourceResult } from '@/shared/api';
import type { IContactInfo, IContactResponse } from '@/features/admin-cms/model/cms.types';
import type { ContactFormValues } from '../model/contact.schema';
import {
  contactInfoMock,
  deleteContactResponse,
  getContactInfo,
  getContactResponseStats,
  listContactResponses,
  submitContactResponse,
  updateContactInfo,
  updateContactResponse,
  type ContactResponseListParams,
} from '../api/contact.api';

export function usePublicContactInfo() {
  return useQuery({
    queryKey: queryKeys.contactInfo.root,
    queryFn: async (): Promise<ResourceResult<IContactInfo>> =>
      withPublicFallback(getContactInfo, contactInfoMock),
  });
}

export function useAdminContactInfo() {
  return useQuery({
    queryKey: [...queryKeys.contactInfo.root, 'admin'] as const,
    queryFn: getContactInfo,
  });
}

export function useUpdateContactInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateContactInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contactInfo.root });
    },
  });
}

export function useSubmitContactResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ContactFormValues) => submitContactResponse(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contactResponses.all });
    },
  });
}

export function useAdminContactResponses(params?: ContactResponseListParams) {
  return useQuery({
    queryKey: queryKeys.contactResponses.list({ admin: true, ...params }),
    queryFn: () => listContactResponses({ limit: 100, ...params }),
  });
}

export function useContactResponseStats() {
  return useQuery({
    queryKey: queryKeys.contactResponses.stats,
    queryFn: getContactResponseStats,
    staleTime: 30_000,
  });
}

export function useUpdateContactResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<IContactResponse> }) =>
      updateContactResponse(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.contactResponses.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.contactResponses.stats });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}

export function useDeleteContactResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContactResponse,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.contactResponses.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.contactResponses.stats });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}
