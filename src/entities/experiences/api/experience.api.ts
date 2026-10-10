import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';
import type { IExperience } from '../model/experience.types';

export interface IExperienceDto extends IExperience {
  id: string;
  sortOrder?: number;
}

export type ExperienceListParams = PaginationParams;

export async function listExperiences(
  params?: ExperienceListParams,
): Promise<PaginatedData<IExperienceDto>> {
  return apiClient.get<PaginatedData<IExperienceDto>>('/experiences', toQueryParams(params));
}

export async function getExperience(id: string): Promise<IExperienceDto> {
  return apiClient.get<IExperienceDto>(`/experiences/${id}`);
}

export async function createExperience(
  payload: Omit<IExperienceDto, 'id'>,
): Promise<IExperienceDto> {
  return apiClient.post<IExperienceDto>('/experiences', payload);
}

export async function updateExperience(
  id: string,
  payload: Partial<IExperienceDto>,
): Promise<IExperienceDto> {
  return apiClient.put<IExperienceDto>(`/experiences/${id}`, payload);
}

export async function deleteExperience(id: string): Promise<void> {
  await apiClient.delete(`/experiences/${id}`);
}

export const experienceApi = {
  list: listExperiences,
  getById: getExperience,
  create: createExperience,
  update: updateExperience,
  delete: deleteExperience,
};
