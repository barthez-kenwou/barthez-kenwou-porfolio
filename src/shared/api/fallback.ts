import { shouldUsePublicFallback, toApiError } from './errors';
import type { ResourceResult } from './types';

/**
 * Public read path: try API, fall back to mocks on network/5xx.
 * Admin mutations must NOT use this — fail loudly instead.
 */
export async function withPublicFallback<T>(
  fetchFn: () => Promise<T>,
  mockFn: () => T | Promise<T>,
): Promise<ResourceResult<T>> {
  try {
    const data = await fetchFn();
    return { data, source: 'api' };
  } catch (error) {
    if (shouldUsePublicFallback(error)) {
      const data = await mockFn();
      return { data, source: 'mock' };
    }
    throw toApiError(error);
  }
}
