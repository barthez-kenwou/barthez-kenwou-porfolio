import { apiClient, clearAccessToken, getAccessToken, setAccessToken, isApiError } from '@/shared/api';
import { env } from '@/app/config/env';
import type { UserRole } from '../model/auth.types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isActive?: boolean;
  totpEnabled?: boolean;
  roles?: string[];
  permissions?: string[];
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: number;
  /** True when session was minted by real API JWT auth */
  viaApi: boolean;
}

const SESSION_KEY = 'bk-admin-session';

interface LoginProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileUrl?: string;
  roles?: string[];
  permissions?: string[];
}

interface MeProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isActive?: boolean;
  totpEnabled?: boolean;
  roles?: string[];
  permissions?: string[];
}

function isAdminRole(roles: string[] | undefined): boolean {
  if (!roles?.length) return false;
  return roles.some((r) => {
    const n = r.toLowerCase();
    return n === 'admin' || n === 'super-admin' || n === 'super_admin' || n === 'superadmin';
  });
}

function toAuthUser(profile: LoginProfile | MeProfile): AuthUser {
  const roles = profile.roles ?? [];
  if (!isAdminRole(roles)) {
    throw new Error('Insufficient permissions for admin access');
  }
  const firstName = profile.firstName ?? '';
  const lastName = profile.lastName ?? '';
  const me = profile as MeProfile;
  return {
    id: profile.id,
    email: profile.email,
    name: [firstName, lastName].filter(Boolean).join(' ') || profile.email,
    role: 'admin',
    firstName,
    lastName,
    phone: me.phone ?? (profile as LoginProfile).phone,
    avatarUrl: me.avatarUrl ?? (profile as LoginProfile).profileUrl,
    isVerified: me.isVerified,
    isActive: me.isActive,
    totpEnabled: me.totpEnabled,
    roles,
    permissions: profile.permissions,
  };
}

function buildSession(user: AuthUser, token: string, viaApi: boolean): AuthSession {
  return {
    user,
    token,
    viaApi,
    // Access JWT is short-lived; refresh cookie keeps the session alive.
    expiresAt: Date.now() + 1000 * 60 * 60 * 12,
  };
}

function formatValidationDetails(details: unknown): string | null {
  if (!Array.isArray(details) || details.length === 0) return null;
  const parts = details
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as { field?: unknown; message?: unknown };
      const message = typeof row.message === 'string' ? row.message : null;
      if (!message) return null;
      const field = typeof row.field === 'string' ? row.field : null;
      return field ? `${field}: ${message}` : message;
    })
    .filter(Boolean);
  return parts.length ? parts.join(' · ') : null;
}

function loginErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    if (error.code === 'NETWORK_ERROR' || error.statusCode === undefined) {
      const target = env.API_BASE_URL || 'same-origin /api (Vite proxy)';
      return `API unreachable (${target}). Check VITE_API_BASE_URL / proxy and that the API is up.`;
    }
    if (error.statusCode === 429) {
      return 'Too many login attempts. Wait a few minutes, then try again.';
    }
    if (error.code === 'EBADCSRFTOKEN' || /csrf/i.test(error.message)) {
      return 'CSRF token rejected. Refresh the page and retry.';
    }
    if (error.statusCode === 400 || error.code === 'BAD_REQUEST') {
      return (
        formatValidationDetails(error.details) ||
        error.message ||
        'Invalid login request'
      );
    }
    if (error.statusCode === 401 || error.code === 'UNAUTHORIZED') {
      return 'Invalid email or password';
    }
    if (error.statusCode === 403 || error.code === 'FORBIDDEN') {
      return 'Account is not allowed to access admin';
    }
    return error.message || 'Login failed';
  }
  if (error instanceof Error) return error.message;
  return 'Login failed';
}

/**
 * Admin login.
 * - `VITE_ADMIN_USE_API=true` (default): real JWT against `/auth/login` only — no silent mock.
 * - `VITE_ADMIN_USE_API=false`: offline env credentials for UI work without a backend.
 */
export async function loginWithCredentials(email: string, password: string): Promise<AuthSession> {
  if (!env.ADMIN_USE_API) {
    return loginWithLocalCredentials(email, password);
  }

  try {
    const { data, accessToken } = await apiClient.loginRaw<LoginProfile>('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });
    if (!accessToken) {
      throw new Error('Login succeeded but no access token was returned');
    }
    const user = toAuthUser(data);
    const session = buildSession(user, accessToken, true);
    persistSession(session);
    return session;
  } catch (error) {
    throw new Error(loginErrorMessage(error));
  }
}

async function loginWithLocalCredentials(email: string, password: string): Promise<AuthSession> {
  const expectedEmail = env.ADMIN_EMAIL?.trim();
  const expectedPassword = env.ADMIN_PASSWORD?.trim();

  if (!expectedEmail || !expectedPassword) {
    throw new Error(
      'Offline admin mode requires VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD (and VITE_ADMIN_USE_API=false).',
    );
  }

  const emailOk = timingSafeEqual(email.trim().toLowerCase(), expectedEmail.toLowerCase());
  const passOk = timingSafeEqual(password, expectedPassword);
  if (!emailOk || !passOk) {
    await delay(400);
    throw new Error('Invalid email or password');
  }

  const token = await sha256(`bk:${expectedEmail}:${Date.now()}`);
  setAccessToken(token);
  const session = buildSession(
    {
      id: 'owner-1',
      email: expectedEmail,
      name: 'Barthez Kenwou',
      role: 'admin',
    },
    token,
    false,
  );
  persistSession(session);
  return session;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const me = await apiClient.get<MeProfile>('/auth/me');
  return toAuthUser(me);
}

export async function logoutFromApi(): Promise<void> {
  try {
    const session = loadSession();
    if (session?.viaApi && getAccessToken() && env.ADMIN_USE_API) {
      await apiClient.post('/auth/logout');
    }
  } catch {
    // Always clear local session even if network fails
  } finally {
    clearSession();
  }
}

export function loadSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (!session?.user || session.user.role !== 'admin') return null;
    if (session.expiresAt < Date.now()) {
      clearSession();
      return null;
    }
    // Reject legacy offline sessions when API auth is required
    if (env.ADMIN_USE_API && session.viaApi === false) {
      clearSession();
      return null;
    }
    if (session.token) setAccessToken(session.token);
    return session;
  } catch {
    return null;
  }
}

export function persistSession(session: AuthSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  if (session.token) setAccessToken(session.token);
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  clearAccessToken();
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function sha256(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
