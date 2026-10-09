/**
 * In-memory access token holder.
 * Refresh lives in an httpOnly cookie; access JWT stays out of localStorage.
 */

let accessToken: string | null = null;

const SESSION_ACCESS_KEY = 'bk-admin-access-token';
/** Keep in sync with features/admin-auth AuthSession storage key. */
const ADMIN_SESSION_KEY = 'bk-admin-session';

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  try {
    const stored = sessionStorage.getItem(SESSION_ACCESS_KEY);
    if (stored) {
      accessToken = stored;
      return stored;
    }
  } catch {
    // ignore
  }
  return null;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
  try {
    if (token) {
      sessionStorage.setItem(SESSION_ACCESS_KEY, token);
      // Silent refresh updates the bearer store; keep the admin session blob aligned
      // so reload does not rehydrate a stale JWT and force a 401→refresh loop.
      const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw) as { token?: string; expiresAt?: number };
        if (session && typeof session === 'object') {
          session.token = token;
          session.expiresAt = Date.now() + 1000 * 60 * 60 * 12;
          sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
        }
      }
    } else {
      sessionStorage.removeItem(SESSION_ACCESS_KEY);
    }
  } catch {
    // ignore
  }
}

export function clearAccessToken(): void {
  setAccessToken(null);
}

/** Extract Bearer token from an Authorization response header value. */
export function parseBearerHeader(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (/^bearer\s+/i.test(trimmed)) {
    return trimmed.replace(/^bearer\s+/i, '').trim() || null;
  }
  return trimmed || null;
}
