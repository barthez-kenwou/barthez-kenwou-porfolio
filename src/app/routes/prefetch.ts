// Prefetch critical route bundles during idle time / on hover.
import { useSkillIconsStore } from '@/entities/skills/model/useSkillIconsStore';

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
