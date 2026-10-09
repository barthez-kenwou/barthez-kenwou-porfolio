import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, withPublicFallback, type PaginatedData, type ResourceResult } from '@/shared/api';
import { paginateMock } from '@/shared/api/http';
import { education } from '../api/mocks/education.mocks';
import {
  createEducation,
  deleteEducation,
  listEducation,
  updateEducation,
  type EducationListParams,
  type IEducationDto,
} from '../api/education.api';

const PUBLIC_LIST: EducationListParams = { limit: 100, isPublished: true };

function mockEducationDto(): IEducationDto[] {
  return education.map((item, index) => ({
    ...item,
    id: `mock-edu-${index}`,
    isPublished: true,
    sortOrder: index,
  }));
}

export function usePublicEducation() {
  return useQuery({
    queryKey: queryKeys.education.list({ public: true }),
    queryFn: async (): Promise<ResourceResult<PaginatedData<IEducationDto>>> =>
      withPublicFallback(
        () => listEducation(PUBLIC_LIST),
        () => paginateMock(mockEducationDto()),
      ),
  });
}

export function useAdminEducation(params?: EducationListParams) {
  return useQuery({
    queryKey: queryKeys.education.list({ admin: true, ...params }),
    queryFn: () => listEducation({ limit: 100, includeUnpublished: true, ...params }),
  });
}

export function useCreateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.education.all });
    },
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<IEducationDto> }) =>
      updateEducation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.education.all });
    },
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.education.all });
    },
  });
}
