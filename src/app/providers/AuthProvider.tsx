import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  clearSession,
  fetchCurrentUser,
  loadSession,
  loginWithCredentials,
  logoutFromApi,
  persistSession,
  type AuthSession,
  type AuthUser,
} from '@/features/admin-auth';
import { env } from '@/app/config/env';
import { apiClient, getAccessToken, isNetworkError, onSessionEnded, toApiError } from '@/shared/api';
import { sessionExpiresAtFromNow } from '@/shared/api/jwt';
import {
  clearAdminReturnPath,
  rememberAdminReturnPath,
  toAdminReturnPath,
} from '@/shared/config/adminReturnPath';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loading: boolean;
  session: AuthSession | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

function rememberCurrentAdminLocation(): void {
  if (typeof window === 'undefined') return;
  const { pathname, search, hash } = window.location;
  rememberAdminReturnPath(toAdminReturnPath({ pathname, search, hash }));
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const stored = loadSession();
      if (!stored) {
        if (!cancelled) {
          setSession(null);
          setLoading(false);
        }
        return;
      }

      // Offline UI mode: trust local session without calling /auth/me
      if (!env.ADMIN_USE_API) {
        if (!cancelled) {
          setSession(stored);
          setLoading(false);
        }
        return;
      }

      if (!stored.viaApi) {
        clearSession();
        if (!cancelled) {
          setSession(null);
          setLoading(false);
        }
        return;
      }

      const adoptStoredOffline = () => {
        // Connectivity blip at boot: keep working UI; refresh when back online.
        apiClient.startSessionKeepAlive();
        if (!cancelled) setSession(stored);
      };

      try {
        // Expired access JWT → 401 → silent refresh → retry (see api client).
        // No bearer yet: still try /me after a refresh attempt via keep-alive.
        if (!getAccessToken()) {
          const refreshed = await apiClient.ensureFreshAccessToken();
          if (!refreshed) {
            if (typeof navigator !== 'undefined' && !navigator.onLine) {
              adoptStoredOffline();
              return;
            }
            // Refresh may have failed transiently (network) without ending session.
            // Still try /me — if that also fails as network, we keep the session below.
          }
        }

        const user = await fetchCurrentUser();
        const next: AuthSession = {
          ...stored,
          user,
          viaApi: true,
          token: getAccessToken() || stored.token,
          expiresAt: sessionExpiresAtFromNow(),
        };
        persistSession(next);
        apiClient.startSessionKeepAlive();
        if (!cancelled) setSession(next);
      } catch (error) {
        if (isNetworkError(toApiError(error))) {
          adoptStoredOffline();
          return;
        }
        // Invalid / expired API session — force re-login
        rememberCurrentAdminLocation();
        clearSession();
        apiClient.stopSessionKeepAlive();
        if (!cancelled) setSession(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return onSessionEnded(() => {
      rememberCurrentAdminLocation();
      clearSession();
      apiClient.stopSessionKeepAlive();
      setSession(null);
      const fr = useLanguageStore.getState().language === 'fr';
      toast.error(
        fr
          ? 'Session expirée — reconnecte-toi pour continuer'
          : 'Session expired — please sign in again',
        { id: 'bk-admin-session-expired' },
      );
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const next = await loginWithCredentials(email, password);
    apiClient.startSessionKeepAlive();
    setSession(next);
  }, []);

  const logout = useCallback(async () => {
    apiClient.stopSessionKeepAlive();
    clearAdminReturnPath();
    await logoutFromApi();
    setSession(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const stored = loadSession();
    if (!stored?.user) return;

    if (!env.ADMIN_USE_API || !stored.viaApi) {
      setSession(stored);
      return;
    }

    try {
      const user = await fetchCurrentUser();
      const next: AuthSession = {
        ...stored,
        user,
        viaApi: true,
        token: getAccessToken() || stored.token,
        expiresAt: sessionExpiresAtFromNow(),
      };
      persistSession(next);
      apiClient.startSessionKeepAlive();
      setSession(next);
    } catch {
      clearSession();
      apiClient.stopSessionKeepAlive();
      setSession(null);
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: !!session?.user && session.user.role === 'admin',
      login,
      logout,
      refreshUser,
      loading,
      session,
    }),
    [session, loading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
