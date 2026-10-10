import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, withPublicFallback, type PaginatedData, type ResourceResult } from '@/shared/api';
import { paginateMock } from '@/shared/api/http';
import { experiences } from '../api/mocks/experiences.mocks';
import {
  createExperience,
  deleteExperience,
  listExperiences,
  updateExperience,
  type ExperienceListParams,
  type IExperienceDto,
} from '../api/experience.api';

const PUBLIC_LIST: ExperienceListParams = { limit: 100 };

function mockExperiencesDto(): IExperienceDto[] {
  return experiences.map((item, index) => ({
    ...item,
    id: `mock-exp-${index}`,
    sortOrder: index,
  }));
}

export function usePublicExperiences() {
  return useQuery({
    queryKey: queryKeys.experiences.list({ public: true }),
    queryFn: async (): Promise<ResourceResult<PaginatedData<IExperienceDto>>> =>
      withPublicFallback(
        () => listExperiences(PUBLIC_LIST),
        () => paginateMock(mockExperiencesDto()),
      ),
  });
}

export function useAdminExperiences(params?: ExperienceListParams) {
  return useQuery({
    queryKey: queryKeys.experiences.list({ admin: true, ...params }),
    queryFn: () => listExperiences({ limit: 100, ...params }),
  });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.experiences.all });
    },
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<IExperienceDto> }) =>
      updateExperience(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.experiences.all });
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.experiences.all });
    },
  });
}
