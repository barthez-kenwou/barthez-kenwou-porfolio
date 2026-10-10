import { apiClient } from './client';
import type { PaginatedData, PaginationParams } from './types';

type Id = string;

export type ListParams = PaginationParams & Record<string, unknown>;

/**
 * Thin CRUD client for backend modules that share the same REST shape.
 */
export function createResourceApi<TItem, TCreate = Partial<TItem>, TUpdate = Partial<TItem>>(
  basePath: string,
) {
  const normalized = basePath.startsWith('/') ? basePath : `/${basePath}`;

  return {
    list(params?: ListParams) {
      return apiClient.get<PaginatedData<TItem>>(normalized, params);
    },
    getById(id: Id) {
      return apiClient.get<TItem>(`${normalized}/${id}`);
    },
    create(body: TCreate) {
      return apiClient.post<TItem>(normalized, body);
    },
    update(id: Id, body: TUpdate) {
      return apiClient.put<TItem>(`${normalized}/${id}`, body);
    },
    remove(id: Id) {
      return apiClient.delete<unknown>(`${normalized}/${id}`);
    },
  };
}

/** Fetch all pages up to a safety cap (admin inventories). */
export async function fetchAllPages<T, P extends PaginationParams>(
  listFn: (params: P) => Promise<PaginatedData<T>>,
  params: P,
  pageSize = 100,
  maxPages = 20,
): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const result = await listFn({ ...params, page, limit: pageSize });
    items.push(...(result.items ?? []));
    totalPages = result.totalPages || 1;
    page += 1;
  } while (page <= totalPages && page <= maxPages);

  return items;
}
