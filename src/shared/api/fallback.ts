import { isNotFoundError, shouldUsePublicFallback, toApiError } from './errors';
import type { ResourceResult } from './types';

export type PublicFallbackOptions = {
  /**
   * Also use mocks when the API returns 404.
   * Needed for public detail pages while CMS/API catalogs are incomplete.
   */
  fallbackOnNotFound?: boolean;
};

/**
 * Public read path: try API, fall back to mocks on network/5xx
 * (and optionally 404 for detail routes).
 * Admin mutations must NOT use this — fail loudly instead.
 */
export async function withPublicFallback<T>(
  fetchFn: () => Promise<T>,
  mockFn: () => T | Promise<T>,
  options?: PublicFallbackOptions,
): Promise<ResourceResult<T>> {
  try {
    const data = await fetchFn();
    return { data, source: 'api' };
  } catch (error) {
    const allowNotFound = Boolean(options?.fallbackOnNotFound) && isNotFoundError(error);
    if (shouldUsePublicFallback(error) || allowNotFound) {
      try {
        const data = await mockFn();
        return { data, source: 'mock' };
      } catch (mockError) {
        // Prefer the mock miss message when we intentionally fell back on 404.
        if (allowNotFound) throw toApiError(mockError);
        throw toApiError(error);
      }
    }
    throw toApiError(error);
  }
}
