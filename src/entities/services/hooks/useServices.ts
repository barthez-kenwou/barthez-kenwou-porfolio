import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, withPublicFallback, type PaginatedData, type ResourceResult } from '@/shared/api';
import { paginateMock } from '@/shared/api/http';
import {
  createService,
  deleteService,
  getService,
  listServices,
  mapServicesMockToDto,
  updateService,
  type IServiceDto,
  type ServiceListParams,
} from '../api/service.api';

const PUBLIC_LIST: ServiceListParams = { limit: 100, isPublished: true };

export function usePublicServices() {
  return useQuery({
    queryKey: queryKeys.services.list({ public: true }),
    queryFn: async (): Promise<ResourceResult<PaginatedData<IServiceDto>>> =>
      withPublicFallback(
        () => listServices(PUBLIC_LIST),
        () => paginateMock(mapServicesMockToDto()),
      ),
  });
}

export function useAdminServices(params?: ServiceListParams) {
  return useQuery({
    queryKey: queryKeys.services.list({ admin: true, ...params }),
    queryFn: () => listServices({ limit: 100, includeUnpublished: true, ...params }),
  });
}

export function useService(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.services.detail(id ?? ''),
    queryFn: () => getService(id!),
    enabled: Boolean(id) && enabled,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<IServiceDto> }) =>
      updateService(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.detail(id) });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}
