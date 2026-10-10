import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';
import { achievements } from './mock/achievements.mocks';

export const ACHIEVEMENT_ICON_KEYS = ['clock', 'rocket', 'target', 'trophy'] as const;

export interface IAchievementDto {
  id: string;
  iconKey: string;
  value: string;
  labelFr: string;
  labelEn: string;
  sortOrder?: number;
}

export type AchievementListParams = PaginationParams;

export function mapAchievementsMockToDto(): IAchievementDto[] {
  return achievements.map((item, index) => ({
    id: `mock-ach-${index}`,
    iconKey: ACHIEVEMENT_ICON_KEYS[index % ACHIEVEMENT_ICON_KEYS.length],
    value: item.value,
    labelFr: item.labelFr,
    labelEn: item.labelEn,
    sortOrder: index,
  }));
}

export async function listAchievements(
  params?: AchievementListParams,
): Promise<PaginatedData<IAchievementDto>> {
  return apiClient.get<PaginatedData<IAchievementDto>>('/achievements', toQueryParams(params));
}

export async function getAchievement(id: string): Promise<IAchievementDto> {
  return apiClient.get<IAchievementDto>(`/achievements/${id}`);
}

export async function createAchievement(
  payload: Omit<IAchievementDto, 'id'>,
): Promise<IAchievementDto> {
  return apiClient.post<IAchievementDto>('/achievements', payload);
}

export async function updateAchievement(
  id: string,
  payload: Partial<IAchievementDto>,
): Promise<IAchievementDto> {
  return apiClient.put<IAchievementDto>(`/achievements/${id}`, payload);
}

export async function deleteAchievement(id: string): Promise<void> {
  await apiClient.delete(`/achievements/${id}`);
}

export const achievementApi = {
  list: listAchievements,
  getById: getAchievement,
  create: createAchievement,
  update: updateAchievement,
  delete: deleteAchievement,
  mockToDto: mapAchievementsMockToDto,
};
