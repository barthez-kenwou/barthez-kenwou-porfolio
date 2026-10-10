import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, withPublicFallback, type PaginatedData, type ResourceResult } from '@/shared/api';
import { paginateMock } from '@/shared/api/http';
import {
  createAchievement,
  deleteAchievement,
  listAchievements,
  mapAchievementsMockToDto,
  updateAchievement,
  type AchievementListParams,
  type IAchievementDto,
} from '../api/achievement.api';

const PUBLIC_LIST: AchievementListParams = { limit: 100 };

export function usePublicAchievements() {
  return useQuery({
    queryKey: queryKeys.achievements.list({ public: true }),
    queryFn: async (): Promise<ResourceResult<PaginatedData<IAchievementDto>>> =>
      withPublicFallback(
        () => listAchievements(PUBLIC_LIST),
        () => paginateMock(mapAchievementsMockToDto()),
      ),
  });
}

export function useAdminAchievements(params?: AchievementListParams) {
  return useQuery({
    queryKey: queryKeys.achievements.list({ admin: true, ...params }),
    queryFn: () => listAchievements({ limit: 100, ...params }),
  });
}

export function useCreateAchievement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAchievement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
    },
  });
}

export function useUpdateAchievement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<IAchievementDto> }) =>
      updateAchievement(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
    },
  });
}

export function useDeleteAchievement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAchievement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
    },
  });
}
