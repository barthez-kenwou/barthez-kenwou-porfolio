import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';
import type { IBlog } from '../model/blog.type';

export interface BlogListParams extends PaginationParams {
  isPublished?: boolean;
  category?: string;
  tag?: string;
  includeUnpublished?: boolean;
}

export async function listBlogs(params?: BlogListParams): Promise<PaginatedData<IBlog>> {
  return apiClient.get<PaginatedData<IBlog>>('/blogs', toQueryParams(params));
}

export async function getBlogBySlug(slug: string): Promise<IBlog> {
  return apiClient.get<IBlog>(`/blogs/${slug}`);
}

export async function createBlog(payload: Omit<IBlog, 'id'>): Promise<IBlog> {
  return apiClient.post<IBlog>('/blogs', payload);
}

export async function updateBlog(id: string, payload: Partial<IBlog>): Promise<IBlog> {
  return apiClient.put<IBlog>(`/blogs/${id}`, payload);
}

export async function publishBlog(id: string, isPublished: boolean): Promise<IBlog> {
  return apiClient.patch<IBlog>(`/blogs/${id}/publish`, { isPublished });
}

export async function deleteBlog(id: string): Promise<void> {
  await apiClient.delete(`/blogs/${id}`);
}

export const blogApi = {
  list: listBlogs,
  getBySlug: getBlogBySlug,
  create: createBlog,
  update: updateBlog,
  publish: publishBlog,
  delete: deleteBlog,
};
