// Types globaux partagés dans l'application
// Prefer importing HTTP/pagination types from `@/shared/api`.

export type ID = string | number;

export type {
  PaginationParams,
  PaginatedData as PaginatedResponse,
  ApiError,
} from '@/shared/api/types';
