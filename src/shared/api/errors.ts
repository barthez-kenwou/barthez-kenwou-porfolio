import type { ApiError } from './types';

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
}

export function toApiError(error: unknown, fallback = 'Request failed'): ApiError {
  if (isApiError(error)) return error;
  if (error instanceof Error) return { message: error.message };
  return { message: fallback };
}

export function isNetworkError(error: unknown): boolean {
  if (!isApiError(error)) return false;
  return error.statusCode === undefined || error.code === 'NETWORK_ERROR';
}

export function isServerError(error: unknown): boolean {
  if (!isApiError(error)) return false;
  return typeof error.statusCode === 'number' && error.statusCode >= 500;
}

export function isNotFoundError(error: unknown): boolean {
  return isApiError(error) && error.statusCode === 404;
}

/** True when public pages should fall back to mocks (network / 5xx). */
export function shouldUsePublicFallback(error: unknown): boolean {
  return isNetworkError(error) || isServerError(error);
}
