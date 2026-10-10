import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';
import type { ISkill } from '../model/Skill.types';

export interface ISkillDto extends ISkill {
  id: string;
  sortOrder?: number;
}

export interface SkillListParams extends PaginationParams {
  category?: string;
}

export async function listSkills(params?: SkillListParams): Promise<PaginatedData<ISkillDto>> {
  return apiClient.get<PaginatedData<ISkillDto>>('/skills', toQueryParams(params));
}

export async function getSkill(id: string): Promise<ISkillDto> {
  return apiClient.get<ISkillDto>(`/skills/${id}`);
}

export async function createSkill(payload: Omit<ISkillDto, 'id'>): Promise<ISkillDto> {
  return apiClient.post<ISkillDto>('/skills', payload);
}

export async function updateSkill(id: string, payload: Partial<ISkillDto>): Promise<ISkillDto> {
  return apiClient.put<ISkillDto>(`/skills/${id}`, payload);
}

export async function deleteSkill(id: string): Promise<void> {
  await apiClient.delete(`/skills/${id}`);
}

export const skillApi = {
  list: listSkills,
  getById: getSkill,
  create: createSkill,
  update: updateSkill,
  delete: deleteSkill,
};
