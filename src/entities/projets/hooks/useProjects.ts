import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, withPublicFallback, type PaginatedData, type ResourceResult } from '@/shared/api';
import { paginateMock } from '@/shared/api/http';
import { findByNumericId } from '@/shared/lib/entity-slug';
import { projectsData } from '../api/mocks/projectData.mocks';
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
  type ProjectListParams,
} from '../api/project.api';
import type { IProject } from '../model/project.types';

const PUBLIC_LIST: ProjectListParams = { limit: 100, isPublished: true };

export function usePublicProjects() {
  return useQuery({
    queryKey: queryKeys.projects.list({ public: true }),
    queryFn: async (): Promise<ResourceResult<PaginatedData<IProject>>> =>
      withPublicFallback(
        () => listProjects(PUBLIC_LIST),
        () => paginateMock(projectsData),
      ),
  });
}

export function useAdminProjects(params?: ProjectListParams) {
  return useQuery({
    queryKey: queryKeys.projects.list({ admin: true, ...params }),
    queryFn: () =>
      listProjects({ limit: 100, includeUnpublished: true, ...params }),
  });
}

export function useProject(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id ?? ''),
    queryFn: async (): Promise<IProject> => {
      const result = await withPublicFallback(
        () => getProject(id!),
        () => {
          const found =
            findByNumericId(projectsData, id) ||
            projectsData.find((p) => String(p.id) === id);
          if (!found) {
            throw new Error('Project not found');
          }
          return found;
        },
      );
      return result.data;
    },
    enabled: Boolean(id) && enabled,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<IProject> }) =>
      updateProject(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(id) });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}
