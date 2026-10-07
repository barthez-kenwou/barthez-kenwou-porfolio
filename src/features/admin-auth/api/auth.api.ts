import type { UserRole } from '../model/auth.types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: number;
}

const SESSION_KEY = 'bk-admin-session';

/** Solo-owner gate until the real auth API is wired. Credentials live in env only. */
export async function loginWithCredentials(email: string, password: string): Promise<AuthSession> {
  const expectedEmail = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.trim();
  const expectedPassword = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined)?.trim();

  // Prefer API when available
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '');
  if (apiBase && import.meta.env.VITE_ADMIN_USE_API === 'true') {
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => 'Login failed');
      throw new Error(msg || 'Login failed');
    }
    const data = (await res.json()) as AuthSession;
    persistSession(data);
    return data;
  }

  if (!expectedEmail || !expectedPassword) {
    throw new Error(
      'Admin credentials are not configured. Set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD.',
    );
  }

  // Constant-time-ish compare for short strings
  const emailOk = timingSafeEqual(email.trim().toLowerCase(), expectedEmail.toLowerCase());
  const passOk = timingSafeEqual(password, expectedPassword);
  if (!emailOk || !passOk) {
    await delay(400);
    throw new Error('Invalid email or password');
  }

  const session: AuthSession = {
    user: {
      id: 'owner-1',
      email: expectedEmail,
      name: 'Barthez Kenwou',
      role: 'admin',
    },
    token: await sha256(`bk:${expectedEmail}:${Date.now()}`),
    expiresAt: Date.now() + 1000 * 60 * 60 * 12, // 12h
  };
  persistSession(session);
  return session;
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
    return session;
  } catch {
    return null;
  }
}

export function persistSession(session: AuthSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
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
