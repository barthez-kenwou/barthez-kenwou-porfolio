import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, withPublicFallback, type PaginatedData, type ResourceResult } from '@/shared/api';
import { paginateMock } from '@/shared/api/http';
import { findByNumericId } from '@/shared/lib/entity-slug';
import { blogPostsData } from '../api/mock/blog.mocks';
import {
  createBlog,
  deleteBlog,
  getBlogBySlug,
  listBlogs,
  publishBlog,
  updateBlog,
  type BlogListParams,
} from '../api/blog.api';
import type { IBlog } from '../model/blog.type';

const PUBLIC_LIST: BlogListParams = { limit: 100, isPublished: true };

export function usePublicBlogs() {
  return useQuery({
    queryKey: queryKeys.blogs.list({ public: true }),
    queryFn: async (): Promise<ResourceResult<PaginatedData<IBlog>>> =>
      withPublicFallback(
        () => listBlogs(PUBLIC_LIST),
        () => paginateMock(blogPostsData),
      ),
  });
}

export function useAdminBlogs(params?: BlogListParams) {
  return useQuery({
    queryKey: queryKeys.blogs.list({ admin: true, ...params }),
    queryFn: () => listBlogs({ limit: 100, includeUnpublished: true, ...params }),
  });
}

/** Public site: API with mock fallback on network/5xx. */
export function useBlogBySlug(slug: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.blogs.detail(slug ?? ''),
    queryFn: async (): Promise<ResourceResult<IBlog>> =>
      withPublicFallback(
        () => getBlogBySlug(slug!),
        () => {
          const found =
            findByNumericId(blogPostsData, slug) ||
            blogPostsData.find((b) => b.slug === slug || b.id === slug);
          if (!found) {
            throw new Error('Blog post not found');
          }
          return found;
        },
      ),
    enabled: Boolean(slug) && enabled,
  });
}

/** Admin CMS: never hydrate mocks — fail loud so we don't save mock numeric ids. */
export function useAdminBlog(slugOrId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.blogs.detail(slugOrId ?? ''),
    queryFn: () => getBlogBySlug(slugOrId!),
    enabled: Boolean(slugOrId) && enabled,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all });
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<IBlog> }) =>
      updateBlog(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all });
      if (data.slug) {
        queryClient.invalidateQueries({ queryKey: queryKeys.blogs.detail(data.slug) });
      }
    },
  });
}

export function usePublishBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      publishBlog(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all });
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all });
    },
  });
}
