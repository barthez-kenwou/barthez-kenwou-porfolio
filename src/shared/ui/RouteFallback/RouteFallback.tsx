import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/lib';
import { loadingTexts } from '@/shared/constants/loading.const';

type RouteFallbackProps = {
  className?: string;
  /** Full-viewport shell (app boot / protected route) */
  fullScreen?: boolean;
  /** Cycle status lines under the monogram (fullScreen boot only by default) */
  showStatus?: boolean;
};

/**
 * Branded route loader — BK monogram, dual orbits, shimmer rail.
 * Shared by lazy routes and the app boot screen (no flare image).
 */
export const RouteFallback: React.FC<RouteFallbackProps> = ({
  className,
  fullScreen = false,
  showStatus,
}) => {
  const statusEnabled = showStatus ?? fullScreen;
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (!statusEnabled) return;
    const id = window.setInterval(() => {
      setTextIndex((i) => (i + 1) % loadingTexts.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [statusEnabled]);

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center overflow-hidden px-4',
        fullScreen
          ? 'fixed inset-0 z-50 min-h-svh bg-background'
          : 'min-h-[calc(100svh-10rem)] flex-1',
        className,
      )}
      role="status"
      aria-label="Loading"
      aria-live="polite"
    >
      {/* Quiet atmosphere — no photography / flare */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--brand)_/_0.08),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)_/_0.1),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.28]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, hsl(var(--foreground) / 0.06) 0.8px, transparent 1px)',
          backgroundSize: '18px 18px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 72%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-7">
        <div className="relative size-[5.75rem] sm:size-28">
          <span
            className="pointer-events-none absolute -inset-10 rounded-full bg-brand/10 blur-3xl dark:bg-primary/15"
            aria-hidden
          />

          <span
            className="loader-orbit absolute inset-0 rounded-full border border-dashed border-brand/30 dark:border-primary/30"
            aria-hidden
          />
          <span
            className="loader-spin absolute inset-2 rounded-full border-2 border-transparent border-t-brand border-r-brand/35 dark:border-t-primary dark:border-r-primary/40"
            aria-hidden
          />
          <span
            className="absolute inset-[22%] rounded-full bg-gradient-to-br from-brand/20 via-transparent to-transparent dark:from-primary/25"
            aria-hidden
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display select-none text-2xl font-black tracking-tighter text-foreground sm:text-3xl">
              BK
            </span>
          </div>

          <span className="loader-orbit-fast absolute inset-0" aria-hidden>
            <span className="absolute top-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_10px_hsl(var(--brand))] dark:bg-primary dark:shadow-[0_0_10px_hsl(var(--primary))]" />
          </span>
          <span className="loader-orbit-reverse absolute inset-0" aria-hidden>
            <span className="absolute bottom-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-brand/70 dark:bg-primary/70" />
          </span>
        </div>

        <div className="flex flex-col items-center gap-2.5">
          {statusEnabled ? (
            <p
              key={textIndex}
              className="min-h-[1.25rem] text-center font-mono text-[10px] tracking-[0.28em] text-foreground/65 uppercase transition-opacity duration-500 sm:text-[11px]"
            >
              {loadingTexts[textIndex]}
            </p>
          ) : (
            <p className="font-mono text-[10px] tracking-[0.42em] text-muted-foreground uppercase">
              Barthez Kenwou
            </p>
          )}

          <div className="relative h-[2px] w-32 overflow-hidden rounded-full bg-border/70">
            <span className="loader-shimmer absolute inset-y-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-brand to-transparent dark:via-primary" />
          </div>

          {statusEnabled ? (
            <p className="mt-1 font-mono text-[9px] tracking-[0.45em] text-muted-foreground/70 uppercase">
              Barthez Kenwou
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
