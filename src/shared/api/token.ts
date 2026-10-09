/**
 * In-memory access token holder.
 * Refresh lives in an httpOnly cookie; access JWT stays out of localStorage.
 */

let accessToken: string | null = null;

const SESSION_ACCESS_KEY = 'bk-admin-access-token';

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
