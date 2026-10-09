function resolveApiBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (raw) return raw.replace(/\/$/, '');
  // Unset/empty: Vite proxy in dev; public API host in production builds.
  return import.meta.env.DEV ? '' : 'https://api.barthez-kenwou.dev';
}

// Configuration des variables d'environnement typées
export const env = {
  /**
   * API origin only (no /api/v1). Empty = same-origin proxy (recommended in `vite` dev).
   * Example prod: https://api.barthez-kenwou.dev
   */
  API_BASE_URL: resolveApiBaseUrl(),
  NODE_ENV: import.meta.env.NODE_ENV,
  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE || 'Frontend App',
  /** Offline admin only — used exclusively when ADMIN_USE_API is false */
  ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL as string | undefined,
  ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD as string | undefined,
  /**
   * Default true: login hits POST /auth/login (JWT). No silent mock fallback.
   * Set VITE_ADMIN_USE_API=false for offline UI with VITE_ADMIN_EMAIL/PASSWORD.
   */
  ADMIN_USE_API: import.meta.env.VITE_ADMIN_USE_API !== 'false',
} as const;

export type Env = typeof env;
