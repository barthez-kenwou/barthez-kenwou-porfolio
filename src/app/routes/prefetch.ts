// Prefetch critical route bundles during idle time / on hover.
import { useSkillIconsStore } from '@/entities/skills/model/useSkillIconsStore';
import { ADMIN_BASE } from '@/shared/config/admin';

export function prefetchRoutes() {
  if (typeof window === 'undefined') return;

  // Only warm the most likely next navigation. Everything else: hover/touch via prefetchRoute().
  // Eager multi-route prefetch was showing up as a ~6s critical-path tail in Lighthouse.
  const doPrefetch = () => {
    void import('@/pages/public/Contact/contact');
  };

  const rIC =
    (
      window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }
    ).requestIdleCallback ??
    function (cb: () => void) {
      return window.setTimeout(cb, 1200);
    };

  rIC(doPrefetch, { timeout: 12000 });
}

/** Warm the admin pages people hit first — run once when AdminLayout mounts. */
export function prefetchAdminShellRoutes() {
  if (typeof window === 'undefined') return;

  const warm = () => {
    void import('@/pages/app/Admin/DashboardPage');
    void import('@/pages/app/Admin/BlogsPage');
    void import('@/pages/app/Admin/ProjectsPage');
  };

  const rIC =
    (
      window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }
    ).requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));

  rIC(warm, { timeout: 2500 });
}

export async function prefetchRoute(path: string) {
  const normalized = path.replace(/\/$/, '') || '/';

  switch (normalized) {
    case '/':
      return import('@/pages/public/HomePage/home');
    case '/about':
      return import('@/pages/public/AboutPage/About');
    case '/skills': {
      void useSkillIconsStore.getState().ensureLoaded();
      return import('@/pages/public/SkillPage/skill');
    }
    case '/projects':
      return import('@/pages/public/ProjectPage/project');
    case '/services':
      return import('@/pages/public/ServicePage/service');
    case '/blog':
      return import('@/pages/public/BlogPage/blog');
    case '/contact':
      return import('@/pages/public/Contact/contact');
    case '/cv':
      return import('@/pages/public/CvPage/cv');
    case ADMIN_BASE:
    case '/barthez-admin':
      return import('@/pages/app/Admin/DashboardPage');
    case `${ADMIN_BASE}/blogs`:
    case '/barthez-admin/blogs':
      return import('@/pages/app/Admin/BlogsPage');
    case `${ADMIN_BASE}/projects`:
    case '/barthez-admin/projects':
      return import('@/pages/app/Admin/ProjectsPage');
    case `${ADMIN_BASE}/skills`:
    case '/barthez-admin/skills':
      return import('@/pages/app/Admin/SkillsPage');
    case `${ADMIN_BASE}/services`:
    case '/barthez-admin/services':
      return import('@/pages/app/Admin/ServicesPage');
    default:
      if (normalized.startsWith(`${ADMIN_BASE}/`) || normalized.startsWith('/barthez-admin/')) {
        // Best-effort: list pages are the common hop; editors stay on-demand.
        return Promise.resolve();
      }
      return Promise.resolve();
  }
}
