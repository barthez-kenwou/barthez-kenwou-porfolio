import { useThemeStore } from '@/shared/state/useThemeStore';
import React, { createContext, useContext, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

function readPersistedTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('frontend-starter-theme');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { theme?: Theme; state?: { theme?: Theme } };
    // Zustand persist: { state: { theme }, version }
    const t = parsed?.state?.theme ?? parsed?.theme;
    return t === 'light' || t === 'dark' ? t : null;
  } catch {
    return null;
  }
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const setTheme = useThemeStore((s) => s.setTheme);

  // Hydrate from persist once; default remains dark when nothing stored
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const persisted = readPersistedTheme();
    const next: Theme = persisted ?? 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');

    const color = theme === 'dark' ? '#1a1548' : '#ece8f7';
    document.querySelectorAll('meta[name="theme-color"]').forEach((el) => {
      el.setAttribute('content', color);
    });
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
