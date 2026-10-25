import { ADMIN_BASE } from './admin';

const RETURN_PATH_KEY = 'bk-admin-return-path';

/** Full in-app path: pathname + search + hash. */
export function toAdminReturnPath(location: {
  pathname: string;
  search?: string;
  hash?: string;
}): string {
  return `${location.pathname}${location.search ?? ''}${location.hash ?? ''}`;
}

/**
 * Only same-origin admin paths — never login, never open redirects.
 */
export function isSafeAdminReturnPath(path: string | null | undefined): path is string {
  if (!path || typeof path !== 'string') return false;
  const trimmed = path.trim();
  if (!trimmed.startsWith(ADMIN_BASE)) return false;
  if (trimmed === `${ADMIN_BASE}/login` || trimmed.startsWith(`${ADMIN_BASE}/login?`)) {
    return false;
  }
  if (trimmed.includes('/login')) return false;
  if (trimmed.includes('://') || trimmed.startsWith('//')) return false;
  if (trimmed.includes('\\')) return false;
  return true;
}

/** Persist across auth redirects (location.state alone is fragile). */
export function rememberAdminReturnPath(path: string): void {
  if (!isSafeAdminReturnPath(path)) return;
  try {
    sessionStorage.setItem(RETURN_PATH_KEY, path);
  } catch {
    /* private mode / quota */
  }
}

export function peekAdminReturnPath(): string | null {
  try {
    const raw = sessionStorage.getItem(RETURN_PATH_KEY);
    return isSafeAdminReturnPath(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function clearAdminReturnPath(): void {
  try {
    sessionStorage.removeItem(RETURN_PATH_KEY);
  } catch {
    /* ignore */
  }
}

/** Prefer router state, then sessionStorage; always clear storage after resolve. */
export function takeAdminReturnPath(fromState?: string | null): string {
  if (isSafeAdminReturnPath(fromState)) {
    clearAdminReturnPath();
    return fromState;
  }
  const stored = peekAdminReturnPath();
  clearAdminReturnPath();
  return stored ?? ADMIN_BASE;
}
