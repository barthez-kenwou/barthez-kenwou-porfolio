import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, withPublicFallback, type PaginatedData, type ResourceResult } from '@/shared/api';
import { paginateMock } from '@/shared/api/http';
import {
  createPartner,
  deletePartner,
  listPartners,
  partnersMockList,
  updatePartner,
  type PartnerListParams,
} from '../api/partner.api';
import type { IPartner, PartnerCreatePayload, PartnerUpdatePayload } from '../model/partner.types';

const PUBLIC_LIST: PartnerListParams = { limit: 100, isPublished: true };

export function usePublicPartners() {
  return useQuery({
    queryKey: queryKeys.partners.list({ public: true }),
    queryFn: async (): Promise<ResourceResult<PaginatedData<IPartner>>> =>
      withPublicFallback(
        () => listPartners(PUBLIC_LIST),
        () =>
          paginateMock(
            partnersMockList()
              .filter((p) => p.isPublished !== false && Boolean(p.logoUrl?.trim()))
              .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
          ),
      ),
  });
}

export function useAdminPartners(params?: PartnerListParams) {
  return useQuery({
    queryKey: queryKeys.partners.list({ admin: true, ...params }),
    queryFn: () => listPartners({ limit: 100, includeUnpublished: true, ...params }),
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PartnerCreatePayload) => createPartner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partners.all });
    },
  });
}

export function useUpdatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PartnerUpdatePayload }) =>
      updatePartner(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partners.all });
    },
  });
}

export function useDeletePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePartner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partners.all });
    },
  });
}
