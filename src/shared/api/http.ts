import type { PaginatedData } from './types';

type PaginateMockParams = {
  page?: number;
  limit?: number;
  offset?: number;
};

/**
 * Slice a mock collection like a real paginated API.
 * When no limit/offset/page is passed, returns the full list (legacy behavior).
 */
export function paginateMock<T>(
  items: readonly T[],
  params?: PaginateMockParams,
): PaginatedData<T> {
  const totalItems = items.length;
  const hasPaging =
    params?.limit !== undefined || params?.offset !== undefined || params?.page !== undefined;

  if (!hasPaging) {
    return {
      items: [...items],
      totalItems,
      totalPages: 1,
      currentPage: 1,
    };
  }

  const limit = Math.max(1, params?.limit ?? (totalItems || 1));
  const offset =
    params?.offset ??
    (params?.page && params.page > 0 ? (params.page - 1) * limit : 0);
  const safeOffset = Math.max(0, offset);
  const slice = items.slice(safeOffset, safeOffset + limit);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const currentPage = Math.floor(safeOffset / limit) + 1;

  return {
    items: slice,
    totalItems,
    totalPages,
    currentPage,
  };
}

export function toQueryParams(params?: object): Record<string, unknown> | undefined {
  if (!params) return undefined;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      out[key] = value;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export async function listAllPages<T>(
  fetchPage: (page: number) => Promise<PaginatedData<T>>,
): Promise<T[]> {
  const first = await fetchPage(1);
  if (first.totalPages <= 1) {
    return first.items;
  }
  const pages = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, index) => fetchPage(index + 2)),
  );
  return [first.items, ...pages.map((page) => page.items)].flat();
}
