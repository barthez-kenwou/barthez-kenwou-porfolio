import * as React from 'react';

/** Default shadcn / admin shell — docked sidebar from `md` (768px). */
export const MOBILE_BREAKPOINT = 768;

/**
 * Public portfolio shell — must match MobileNavbar / Navbar (`xl`).
 * Below this: mobile top + bottom nav (sidebar as Sheet only).
 * At/above: docked sidebar + desktop pill nav (no mobile dock).
 */
export const PUBLIC_SHELL_BREAKPOINT = 1280;

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < breakpoint);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  return !!isMobile;
}
