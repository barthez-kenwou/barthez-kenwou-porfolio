import { useEffect } from 'react';
import { trackEngagementTime, trackScrollDepth } from '@/app/lib/analytics';

const SCROLL_MARKS = [25, 50, 75, 100] as const;
const TIME_MARKS = [15, 30, 60, 120, 300] as const;

/**
 * Tracks scroll depth + dwell time for the current path (session-deduped).
 * Skip on admin routes (handled inside analytics helpers).
 */
export function usePageEngagement(path?: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const trackedPath = path || `${window.location.pathname}${window.location.search}`;
    let visibleMs = 0;
    let lastVisibleAt = document.visibilityState === 'visible' ? Date.now() : 0;
    const firedTimes = new Set<number>();

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        trackScrollDepth(trackedPath, 100);
        return;
      }
      const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      for (const mark of SCROLL_MARKS) {
        if (pct >= mark) trackScrollDepth(trackedPath, mark);
      }
    };

    const flushVisibility = () => {
      if (lastVisibleAt > 0) {
        visibleMs += Date.now() - lastVisibleAt;
        lastVisibleAt = document.visibilityState === 'visible' ? Date.now() : 0;
      }
      for (const mark of TIME_MARKS) {
        if (visibleMs >= mark * 1000 && !firedTimes.has(mark)) {
          firedTimes.add(mark);
          trackEngagementTime(trackedPath, mark);
        }
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        lastVisibleAt = Date.now();
      } else {
        flushVisibility();
      }
    };

    const interval = window.setInterval(flushVisibility, 5000);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    onScroll();

    return () => {
      flushVisibility();
      window.clearInterval(interval);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [path]);
}
