/**
 * Client-side JWT helpers (decode only — never verify; verification is server-side).
 */

/** Soft admin session ceiling, aligned with backend JWT_REFRESH_EXPIRES_IN (30d). */
export const ADMIN_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Refresh this many ms before access JWT `exp`. */
export const ACCESS_REFRESH_SKEW_MS = 90_000;

function base64UrlToJson(segment: string): unknown {
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const json = atob(padded + pad);
  return JSON.parse(json) as unknown;
}

/** Return access-token expiry as epoch ms, or null if missing/unreadable. */
export function getJwtExpiryMs(token: string | null | undefined): number | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const payload = base64UrlToJson(parts[1]);
    if (!payload || typeof payload !== 'object') return null;
    const exp = (payload as { exp?: unknown }).exp;
    if (typeof exp !== 'number' || !Number.isFinite(exp)) return null;
    return exp * 1000;
  } catch {
    return null;
  }
}

export function isAccessTokenExpiringSoon(
  token: string | null | undefined,
  skewMs = ACCESS_REFRESH_SKEW_MS,
): boolean {
  const expMs = getJwtExpiryMs(token);
  if (expMs == null) return true;
  return expMs - Date.now() <= skewMs;
}

export function sessionExpiresAtFromNow(ttlMs = ADMIN_SESSION_TTL_MS): number {
  return Date.now() + ttlMs;
}
