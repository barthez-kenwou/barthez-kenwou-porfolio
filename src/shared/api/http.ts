import type { PaginatedData } from './types';

export function paginateMock<T>(items: readonly T[]): PaginatedData<T> {
  return {
    items: [...items],
    totalItems: items.length,
    totalPages: 1,
    currentPage: 1,
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
