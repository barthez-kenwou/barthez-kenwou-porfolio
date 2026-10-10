import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';
import type { IEducation } from '../model/education.types';

export interface IEducationDto extends IEducation {
  id: string;
  sortOrder?: number;
}

export type EducationListParams = PaginationParams;

export async function listEducation(
  params?: EducationListParams,
): Promise<PaginatedData<IEducationDto>> {
  return apiClient.get<PaginatedData<IEducationDto>>('/education', toQueryParams(params));
}

export async function getEducationItem(id: string): Promise<IEducationDto> {
  return apiClient.get<IEducationDto>(`/education/${id}`);
}

export async function createEducation(payload: Omit<IEducationDto, 'id'>): Promise<IEducationDto> {
  return apiClient.post<IEducationDto>('/education', payload);
}

export async function updateEducation(
  id: string,
  payload: Partial<IEducationDto>,
): Promise<IEducationDto> {
  return apiClient.put<IEducationDto>(`/education/${id}`, payload);
}

export async function deleteEducation(id: string): Promise<void> {
  await apiClient.delete(`/education/${id}`);
}

export const educationApi = {
  list: listEducation,
  getById: getEducationItem,
  create: createEducation,
  update: updateEducation,
  delete: deleteEducation,
};
