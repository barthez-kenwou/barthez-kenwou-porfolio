import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, withPublicFallback, type ResourceResult } from '@/shared/api';
import { cvDataMock, getCvData, updateCvData } from '../api/cv-data.api';
import type { ICvData } from '../api/mock/cv-data';

export function usePublicCvData() {
  return useQuery({
    queryKey: queryKeys.cv.root,
    queryFn: async (): Promise<ResourceResult<ICvData>> =>
      withPublicFallback(getCvData, cvDataMock),
  });
}

export function useAdminCvData() {
  return useQuery({
    queryKey: [...queryKeys.cv.root, 'admin'] as const,
    queryFn: getCvData,
  });
}

export function useUpdateCvData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCvData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cv.root });
    },
  });
}
