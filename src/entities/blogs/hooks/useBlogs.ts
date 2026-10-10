import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, withPublicFallback, type PaginatedData, type ResourceResult } from '@/shared/api';
import { paginateMock } from '@/shared/api/http';
import {
  findByNumericId,
  getBlogPathSlug,
  isMongoObjectId,
  stripTrailingPathIdSuffix,
} from '@/shared/lib/entity-slug';
import { isApiError } from '@/shared/api/errors';
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
import { withMockViewCount } from '../lib/blogListing';

const PUBLIC_LIST: BlogListParams = { limit: 100, isPublished: true };

async function fetchPublicBlogBySlug(slug: string): Promise<IBlog> {
  try {
    return await getBlogBySlug(slug);
  } catch (error) {
    const stripped = stripTrailingPathIdSuffix(slug);
    if (
      isApiError(error) &&
      error.statusCode === 404 &&
      stripped !== slug &&
      !isMongoObjectId(slug)
    ) {
      return getBlogBySlug(stripped);
    }
    throw error;
  }
}

export function usePublicBlogs() {
  return useQuery({
    queryKey: queryKeys.blogs.list({ public: true }),
    queryFn: async (): Promise<ResourceResult<PaginatedData<IBlog>>> =>
      withPublicFallback(
        () => listBlogs(PUBLIC_LIST),
        () => paginateMock(blogPostsData.map(withMockViewCount)),
      ),
  });
}

export function useAdminBlogs(params?: BlogListParams) {
  return useQuery({
    queryKey: queryKeys.blogs.list({ admin: true, ...params }),
    queryFn: () => listBlogs({ limit: 100, includeUnpublished: true, ...params }),
  });
}

function findMockBlog(slug: string | undefined): IBlog | undefined {
  if (!slug) return undefined;
  const stripped = stripTrailingPathIdSuffix(slug);
  return (
    findByNumericId(blogPostsData, slug) ||
    blogPostsData.find(
      (b) =>
        b.slug === slug ||
        b.slug === stripped ||
        b.id === slug ||
        getBlogPathSlug(b) === slug,
    )
  );
}

/** Public site: API first, mocks on network/5xx/404. */
export function useBlogBySlug(slug: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.blogs.detail(slug ?? ''),
    queryFn: async (): Promise<ResourceResult<IBlog>> =>
      withPublicFallback(
        () => fetchPublicBlogBySlug(slug!),
        () => {
          const found = findMockBlog(slug);
          if (!found) {
            throw new Error('Blog post not found');
          }
          return found;
        },
        { fallbackOnNotFound: true },
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
