// Prefetch critical route bundles during idle time / on hover.
import { useSkillIconsStore } from '@/entities/skills/model/useSkillIconsStore';

export function prefetchRoutes() {
  if (typeof window === 'undefined') return;

  const doPrefetch = () => {
    // Keep the first idle pass light. Blog/project pages pull large mock chunks —
    // those warm only on hover/touch via prefetchRoute().
    void import('@/pages/public/AboutPage/About');
    void import('@/pages/public/ServicePage/service');
    void import('@/pages/public/Contact/contact');
    void import('@/pages/public/CvPage/cv');
  };

  const warmHeavy = () => {
    void import('@/pages/public/SkillPage/skill');
    void import('@/pages/public/ProjectPage/project');
    void useSkillIconsStore.getState().ensureLoaded();
  };

  const rIC =
    (
      window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }
    ).requestIdleCallback ??
    function (cb: () => void) {
      return window.setTimeout(cb, 300);
    };

  rIC(doPrefetch, { timeout: 6000 });
  window.setTimeout(() => rIC(warmHeavy, { timeout: 10000 }), 8000);
}

export async function prefetchRoute(path: string) {
  switch (path) {
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
    case '/barthez-admin':
      return import('@/pages/app/Admin/DashboardPage');
    default:
      return Promise.resolve();
  }
}
