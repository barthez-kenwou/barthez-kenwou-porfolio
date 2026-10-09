import axios from 'axios';
import { env } from '@/app/config/env';

const CSRF_HEADER = 'X-XSRF-TOKEN';

let cachedToken: string | null = null;
let inflight: Promise<string | null> | null = null;

function apiOrigin(): string {
  const root = env.API_BASE_URL.replace(/\/$/, '');
  // Empty = same-origin (Vite proxy / nginx reverse proxy)
  return root;
}

function csrfUrls(): string[] {
  const origin = apiOrigin();
  const versioned = origin ? `${origin}/api/v1/csrf-token` : '/api/v1/csrf-token';
  const root = origin ? `${origin}/csrf-token` : '/csrf-token';
  // Prefer versioned path — works when the edge only proxies /api/
  return [versioned, root];
}

/**
 * Fetch CSRF token (GET /api/v1/csrf-token, fallback GET /csrf-token).
 * Safe to call repeatedly — caches until cleared.
 */
export async function ensureCsrfToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      for (const url of csrfUrls()) {
        try {
          const response = await axios.get(url, {
            withCredentials: true,
            timeout: 15_000,
            headers: { Accept: 'application/json' },
          });
          const payload = response.data as {
            success?: boolean;
            data?: { csrfEnabled?: boolean; csrfToken?: string | null };
          };
          const enabled = payload?.data?.csrfEnabled !== false;
          const token = payload?.data?.csrfToken ?? null;
          if (!enabled) {
            cachedToken = null;
            return null;
          }
          if (token) {
            cachedToken = token;
            return cachedToken;
          }
        } catch {
          // try next URL
        }
      }
      cachedToken = null;
      return null;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

export function clearCsrfToken(): void {
  cachedToken = null;
  inflight = null;
}

export function csrfHeaderName(): string {
  return CSRF_HEADER;
}

export function isUnsafeMethod(method?: string): boolean {
  const m = (method || 'GET').toUpperCase();
  return m !== 'GET' && m !== 'HEAD' && m !== 'OPTIONS';
}
