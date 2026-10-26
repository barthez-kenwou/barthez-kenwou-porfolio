import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  queryKeys,
  withPublicFallback,
  type PaginatedData,
  type ResourceResult,
} from '@/shared/api';
import { paginateMock } from '@/shared/api/http';
import { findByPathSlug, parseEntityIdFromParam } from '@/shared/lib/entity-slug';
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
  return findByPathSlug(projectsData, routeParam);
}

async function resolveProjectIdFromList(routeParam: string): Promise<string | null> {
  const page = await listProjects(PUBLIC_LIST);
  const match = findByPathSlug(page.items, routeParam);
  return match ? String(match.id) : null;
}

async function fetchPublicProject(routeParam: string): Promise<IProject> {
  const directId = parseEntityIdFromParam(routeParam);
  if (directId) {
    try {
      return await getProject(directId);
    } catch (error) {
      if (!isNotFoundError(error)) throw error;
    }
  }

  // Readable slug (`title-0001` / `title-a1b2c3d4`) → resolve via list, then fetch by id.
  const resolvedId = await resolveProjectIdFromList(routeParam);
  if (resolvedId) {
    return getProject(resolvedId);
  }

  // Last resort: API may accept the raw path segment.
  if (!directId) {
    return getProject(routeParam);
  }
  throw Object.assign(new Error('Project not found'), { statusCode: 404 });
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
    queryFn: () => listProjects({ limit: 100, includeUnpublished: true, ...params }),
  });
}

/** Public detail: bare id, Mongo id, or `{slug}-{id-suffix}` path param. */
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
