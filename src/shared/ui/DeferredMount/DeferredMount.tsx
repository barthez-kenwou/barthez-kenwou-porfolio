import { useEffect, useRef, useState, type ReactNode } from 'react';

type DeferredMountProps = {
  children: ReactNode;
  /** Idle timeout before mount (ms). Default 600 */
  timeout?: number;
  /** Only mount when near viewport */
  whenVisible?: boolean;
  rootMargin?: string;
  fallback?: ReactNode;
  className?: string;
};

/**
 * Defers heavy widgets until idle (and optionally visible).
 * Keep fallback sized like the real widget to avoid layout shift.
 */
export function DeferredMount({
  children,
  timeout = 600,
  whenVisible = true,
  rootMargin = '160px',
  fallback = null,
  className,
}: DeferredMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleHandle: number | undefined;

    const cancelIdle = (id: number) => {
      const w = window as Window & { cancelIdleCallback?: (n: number) => void };
      if (w.cancelIdleCallback) w.cancelIdleCallback(id);
      else clearTimeout(id);
    };

    const scheduleIdle = (cb: () => void) => {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      };
      if (w.requestIdleCallback) return w.requestIdleCallback(cb, { timeout });
      return window.setTimeout(cb, Math.min(timeout, 400));
    };

    const arm = () => {
      idleHandle = scheduleIdle(() => {
        if (!cancelled) setMount(true);
      });
    };

    if (!whenVisible) {
      arm();
      return () => {
        cancelled = true;
        if (idleHandle !== undefined) cancelIdle(idleHandle);
      };
    }

    const node = ref.current;
    if (!node) {
      arm();
      return () => {
        cancelled = true;
        if (idleHandle !== undefined) cancelIdle(idleHandle);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          arm();
        }
      },
      { rootMargin },
    );
    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (idleHandle !== undefined) cancelIdle(idleHandle);
    };
  }, [timeout, whenVisible, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {mount ? children : fallback}
    </div>
  );
}
