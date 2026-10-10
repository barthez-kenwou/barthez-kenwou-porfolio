import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';
import type { IBlog } from '../model/blog.type';

export interface BlogListParams extends PaginationParams {
  isPublished?: boolean;
  category?: string;
  tag?: string;
  search?: string;
  includeUnpublished?: boolean;
}

export async function listBlogs(params?: BlogListParams): Promise<PaginatedData<IBlog>> {
  return apiClient.get<PaginatedData<IBlog>>('/blogs', toQueryParams(params));
}

/** Fetch by URL slug or Mongo ObjectId (admin JWT sees drafts). */
export async function getBlogBySlug(slugOrId: string): Promise<IBlog> {
  return apiClient.get<IBlog>(`/blogs/${encodeURIComponent(slugOrId)}`);
}

export async function createBlog(payload: Omit<IBlog, 'id'>): Promise<IBlog> {
  const date = normalizeBlogDate(payload.date);
  return apiClient.post<IBlog>('/blogs', {
    ...payload,
    date,
    contentFr: ensureMinContent(payload.contentFr),
    contentEn: ensureMinContent(payload.contentEn),
    image: payload.image?.trim() || 'https://barthez-kenwou.dev/og-image.jpg',
    tags: payload.tags ?? [],
  });
}

export async function updateBlog(id: string, payload: Partial<IBlog>): Promise<IBlog> {
  const next: Partial<IBlog> = { ...payload };
  if (next.date !== undefined) next.date = normalizeBlogDate(next.date);
  if (next.contentFr !== undefined) next.contentFr = ensureMinContent(next.contentFr);
  if (next.contentEn !== undefined) next.contentEn = ensureMinContent(next.contentEn);
  return apiClient.put<IBlog>(`/blogs/${id}`, next);
}

export async function publishBlog(id: string, isPublished: boolean): Promise<IBlog> {
  return apiClient.patch<IBlog>(`/blogs/${id}/publish`, { isPublished });
}

function normalizeBlogDate(value: string | undefined): string {
  const raw = (value || '').trim();
  if (!raw) return new Date().toISOString();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return `${raw}T00:00:00.000Z`;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

/** Backend rejects content shorter than 10 chars. */
function ensureMinContent(value: string | undefined): string {
  const text = (value || '').trim();
  if (text.length >= 10) return text;
  return `${text}\n\n<!-- draft -->`.trim();
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
