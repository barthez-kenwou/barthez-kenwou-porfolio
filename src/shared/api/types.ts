/** Shared HTTP contract types aligned with backend envelope. */

export interface ApiMeta {
  path?: string;
  method?: string;
  url?: string;
  ip?: string;
  userAgent?: string;
  responseTime?: string;
  timestamp?: string;
  uptime?: number;
}

export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  statusCode: number;
  message?: string;
  meta?: ApiMeta;
}

export interface ApiErrorEnvelope {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
  requestId?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
  requestId?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  /** Absolute skip — preferred for variable page sizes (e.g. 8 then +6). */
  offset?: number;
}

/** Backend paginated `data` payload. */
export interface PaginatedData<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export type DataSource = 'api' | 'mock';

export interface ResourceResult<T> {
  data: T;
  source: DataSource;
}
