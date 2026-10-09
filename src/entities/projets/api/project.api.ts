import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';
import type { IProject } from '../model/project.types';

export interface ProjectListParams extends PaginationParams {
  isPublished?: boolean;
  isFeatured?: boolean;
  category?: string;
  includeUnpublished?: boolean;
}

export async function listProjects(params?: ProjectListParams): Promise<PaginatedData<IProject>> {
  return apiClient.get<PaginatedData<IProject>>('/projects', toQueryParams(params));
}

export async function getProject(id: string): Promise<IProject> {
  return apiClient.get<IProject>(`/projects/${id}`);
}

export async function createProject(payload: Omit<IProject, 'id'>): Promise<IProject> {
  return apiClient.post<IProject>('/projects', payload);
}

export async function updateProject(id: string, payload: Partial<IProject>): Promise<IProject> {
  return apiClient.put<IProject>(`/projects/${id}`, payload);
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}

export const projectApi = {
  list: listProjects,
  getById: getProject,
  create: createProject,
  update: updateProject,
  delete: deleteProject,
};
