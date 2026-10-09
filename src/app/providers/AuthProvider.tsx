import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import { getAccessToken } from '@/shared/api';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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

      if (!stored.viaApi || !getAccessToken()) {
        clearSession();
        if (!cancelled) {
          setSession(null);
          setLoading(false);
        }
        return;
      }

      try {
        const user = await fetchCurrentUser();
        const next: AuthSession = {
          ...stored,
          user,
          viaApi: true,
          token: getAccessToken() || stored.token,
          expiresAt: Date.now() + 1000 * 60 * 60 * 12,
        };
        persistSession(next);
        if (!cancelled) setSession(next);
      } catch {
        // Invalid / expired API session — force re-login
        clearSession();
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

  const login = useCallback(async (email: string, password: string) => {
    const next = await loginWithCredentials(email, password);
    setSession(next);
  }, []);

  const logout = useCallback(async () => {
    await logoutFromApi();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: !!session?.user && session.user.role === 'admin',
      login,
      logout,
      loading,
      session,
    }),
    [session, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
