import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, withPublicFallback, type PaginatedData, type ResourceResult } from '@/shared/api';
import { paginateMock } from '@/shared/api/http';
import {
  findByNumericId,
  getProjectPathSlug,
  parseEntityIdFromParam,
} from '@/shared/lib/entity-slug';
import { isNotFoundError } from '@/shared/api/errors';
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

function findMockProject(routeParam: string | undefined): IProject | undefined {
  if (!routeParam) return undefined;
  return (
    findByNumericId(projectsData, routeParam) ||
    projectsData.find((p) => String(p.id) === routeParam) ||
    projectsData.find((p) => getProjectPathSlug(p) === routeParam)
  );
}

async function fetchPublicProject(routeParam: string): Promise<IProject> {
  const numericOrMongo = parseEntityIdFromParam(routeParam);
  const primaryId = numericOrMongo ?? routeParam;
  try {
    return await getProject(primaryId);
  } catch (error) {
    // Retry with the raw slug if the API stores slug-style keys.
    if (isNotFoundError(error) && primaryId !== routeParam) {
      return getProject(routeParam);
    }
    throw error;
  }
}

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

/** Public detail: accepts numeric id, mongo id, or `{slug}-0001` path param. */
export function useProject(routeParam: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.projects.detail(routeParam ?? ''),
    queryFn: async (): Promise<IProject> => {
      const result = await withPublicFallback(
        () => fetchPublicProject(routeParam!),
        () => {
          const found = findMockProject(routeParam);
          if (!found) {
            throw new Error('Project not found');
          }
          return found;
        },
        { fallbackOnNotFound: true },
      );
      return result.data;
    },
    enabled: Boolean(routeParam) && enabled,
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
