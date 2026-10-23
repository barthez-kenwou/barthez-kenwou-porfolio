import { describe, expect, it } from 'vitest';
import {
  ACCESS_REFRESH_SKEW_MS,
  ADMIN_SESSION_TTL_MS,
  getJwtExpiryMs,
  isAccessTokenExpiringSoon,
  sessionExpiresAtFromNow,
} from './jwt';

function fakeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  const body = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `${header}.${body}.sig`;
}

describe('jwt helpers', () => {
  it('reads exp as epoch ms', () => {
    const expSec = Math.floor(Date.now() / 1000) + 900;
    const token = fakeJwt({ exp: expSec, type: 'ACCESS' });
    expect(getJwtExpiryMs(token)).toBe(expSec * 1000);
  });

  it('returns null for garbage tokens', () => {
    expect(getJwtExpiryMs(null)).toBeNull();
    expect(getJwtExpiryMs('not-a-jwt')).toBeNull();
    expect(getJwtExpiryMs(fakeJwt({ sub: 'x' }))).toBeNull();
  });

  it('flags tokens inside the refresh skew window', () => {
    const soon = Math.floor((Date.now() + ACCESS_REFRESH_SKEW_MS / 2) / 1000);
    const later = Math.floor((Date.now() + ACCESS_REFRESH_SKEW_MS * 3) / 1000);
    expect(isAccessTokenExpiringSoon(fakeJwt({ exp: soon }))).toBe(true);
    expect(isAccessTokenExpiringSoon(fakeJwt({ exp: later }))).toBe(false);
  });

  it('aligns soft session TTL with 30 days', () => {
    const before = Date.now();
    const expiresAt = sessionExpiresAtFromNow();
    expect(expiresAt).toBeGreaterThanOrEqual(before + ADMIN_SESSION_TTL_MS);
    expect(expiresAt).toBeLessThanOrEqual(Date.now() + ADMIN_SESSION_TTL_MS);
    expect(ADMIN_SESSION_TTL_MS).toBe(30 * 24 * 60 * 60 * 1000);
  });
});
