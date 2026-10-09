import axios from 'axios';
import { env } from '@/app/config/env';
import { clearCsrfToken, csrfHeaderName, ensureCsrfToken, isUnsafeMethod } from './csrf';
import { clearAccessToken, getAccessToken, parseBearerHeader, setAccessToken } from './token';
import type { ApiError, ApiSuccessEnvelope } from './types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  url?: string;
  method?: HttpMethod | string;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
  _retry?: boolean;
  _csrfRetry?: boolean;
};

let refreshPromise: Promise<string | null> | null = null;

function buildBaseUrl(): string {
  const root = env.API_BASE_URL.replace(/\/$/, '');
  return root ? `${root}/api/v1` : '/api/v1';
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (!data) return fallback;
  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (!trimmed || /^error code:\s*\d+$/i.test(trimmed)) {
      return fallback;
    }
    return trimmed.slice(0, 200);
  }
  if (typeof data === 'object' && data !== null && 'message' in data) {
    const msg = (data as { message?: unknown }).message;
    if (typeof msg === 'string' && msg.trim()) return msg;
  }
  return fallback;
}

function mapAxiosError(error: {
  response?: { status: number; data?: unknown };
  request?: unknown;
  message?: string;
}): ApiError {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    const envelope = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;
    const fallback =
      status === 502 || status === 503 || status === 504
        ? 'API unavailable (bad gateway). Is the backend running on the proxy target?'
        : status >= 500
          ? 'API server error'
          : 'Request failed';
    return {
      message: extractErrorMessage(data, fallback),
      code: envelope.code ? String(envelope.code) : status >= 500 ? 'UPSTREAM_ERROR' : undefined,
      statusCode: status,
      details: envelope.details,
      requestId: envelope.requestId ? String(envelope.requestId) : undefined,
    };
  }

  if (error.request) {
    return {
      message: 'No response received from the API',
      code: 'NETWORK_ERROR',
      statusCode: undefined,
    };
  }

  return { message: error.message || 'Request failed', code: 'CLIENT_ERROR' };
}

function unwrapData<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'success' in payload &&
    (payload as ApiSuccessEnvelope<T>).success === true &&
    'data' in payload
  ) {
    return (payload as ApiSuccessEnvelope<T>).data;
  }
  return payload as T;
}

function readAuthHeader(headers: unknown): string | null {
  if (!headers || typeof headers !== 'object') return null;
  const h = headers as Record<string, string | undefined>;
  return parseBearerHeader(h.authorization ?? h.Authorization);
}

function isCsrfFailure(error: {
  response?: { status: number; data?: unknown };
}): boolean {
  if (error.response?.status !== 403) return false;
  const data = (error.response.data || {}) as Record<string, unknown>;
  return data.code === 'EBADCSRFTOKEN' || /csrf/i.test(String(data.message || ''));
}

class ApiClient {
  // axios typings vary across versions; keep the instance loosely typed.
  private readonly client: ReturnType<typeof axios.create>;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30_000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.client.interceptors.request.use(
      async (config: RequestOptions & { headers?: Record<string, string> }) => {
        const token = getAccessToken();
        config.headers = config.headers ?? {};
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (isUnsafeMethod(config.method)) {
          const csrf = await ensureCsrfToken();
          if (csrf) {
            config.headers[csrfHeaderName()] = csrf;
          }
        }

        return config;
      },
    );

    this.client.interceptors.response.use(
      (response: { data?: unknown; headers?: unknown }) => {
        const headerToken = readAuthHeader(response.headers);
        if (headerToken) setAccessToken(headerToken);
        return response;
      },
      async (error: {
        response?: { status: number; data?: unknown };
        request?: unknown;
        message?: string;
        config?: RequestOptions;
      }) => {
        const original = error.config;
        const status = error.response?.status;

        if (original && isCsrfFailure(error) && !original._csrfRetry) {
          original._csrfRetry = true;
          clearCsrfToken();
          const csrf = await ensureCsrfToken();
          if (csrf) {
            original.headers = {
              ...(original.headers ?? {}),
              [csrfHeaderName()]: csrf,
            };
            return this.client.request(original);
          }
        }

        if (
          status === 401 &&
          original &&
          !original._retry &&
          !String(original.url || '').includes('/auth/login') &&
          !String(original.url || '').includes('/auth/refresh')
        ) {
          original._retry = true;
          const token = await this.refreshAccessToken();
          if (token) {
            original.headers = { ...(original.headers ?? {}), Authorization: `Bearer ${token}` };
            return this.client.request(original);
          }
        }

        return Promise.reject(mapAxiosError(error));
      },
    );
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const response = await this.client.post(
            '/auth/refresh',
            {},
            { headers: { 'Content-Type': 'application/json' }, _retry: true },
          );
          const headerToken = readAuthHeader(response.headers);
          const bodyToken =
            response.data &&
            typeof response.data === 'object' &&
            'data' in response.data &&
            (response.data as { data?: { accessToken?: string } }).data?.accessToken
              ? String((response.data as { data: { accessToken: string } }).data.accessToken)
              : null;
          const token = bodyToken || headerToken;
          if (token) {
            setAccessToken(token);
            return token;
          }
          clearAccessToken();
          return null;
        } catch {
          clearAccessToken();
          return null;
        } finally {
          refreshPromise = null;
        }
      })();
    }
    return refreshPromise;
  }

  async request<T>(config: RequestOptions): Promise<T> {
    const response = await this.client.request(config);
    return unwrapData<T>(response.data);
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>({ url: endpoint, method: 'GET', params });
  }

  async post<T>(endpoint: string, data?: unknown, config?: RequestOptions): Promise<T> {
    return this.request<T>({ url: endpoint, method: 'POST', data, ...(config ?? {}) });
  }

  async put<T>(endpoint: string, data?: unknown, config?: RequestOptions): Promise<T> {
    return this.request<T>({ url: endpoint, method: 'PUT', data, ...(config ?? {}) });
  }

  async patch<T>(endpoint: string, data?: unknown, config?: RequestOptions): Promise<T> {
    return this.request<T>({ url: endpoint, method: 'PATCH', data, ...(config ?? {}) });
  }

  async delete<T>(endpoint: string, config?: RequestOptions): Promise<T> {
    return this.request<T>({ url: endpoint, method: 'DELETE', ...(config ?? {}) });
  }

  async loginRaw<T>(
    endpoint: string,
    body: unknown,
  ): Promise<{ data: T; accessToken: string | null }> {
    const response = await this.client.post(endpoint, body);
    const data = unwrapData<T & { accessToken?: string }>(response.data);
    const fromBody =
      data && typeof data === 'object' && typeof (data as { accessToken?: unknown }).accessToken === 'string'
        ? String((data as { accessToken: string }).accessToken)
        : null;
    const accessToken = fromBody || readAuthHeader(response.headers);
    if (accessToken) setAccessToken(accessToken);
    return { data: data as T, accessToken };
  }
}

const apiClient = new ApiClient(buildBaseUrl());

export { apiClient, ApiClient, buildBaseUrl };
