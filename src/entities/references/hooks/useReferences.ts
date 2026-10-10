import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, withPublicFallback, type PaginatedData, type ResourceResult } from '@/shared/api';
import { paginateMock } from '@/shared/api/http';
import {
  createReference,
  deleteReference,
  listReferences,
  referencesMock,
  updateReference,
  type ReferenceListParams,
} from '../api/reference.api';
import type { IProfessionalReference } from '../model/reference.types';

export function usePublicReferences() {
  return useQuery({
    queryKey: queryKeys.references.list({ public: true }),
    queryFn: async (): Promise<ResourceResult<PaginatedData<IProfessionalReference>>> =>
      withPublicFallback(
        () => listReferences({ limit: 100 }),
        () => paginateMock(referencesMock()),
      ),
  });
}

export function useAdminReferences(params?: ReferenceListParams) {
  return useQuery({
    queryKey: queryKeys.references.list({ admin: true, ...params }),
    queryFn: () => listReferences({ limit: 100, ...params }),
  });
}

export function useCreateReference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReference,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.references.all });
    },
  });
}

export function useUpdateReference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<IProfessionalReference> }) =>
      updateReference(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.references.all });
    },
  });
}

export function useDeleteReference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReference,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.references.all });
    },
  });
}
