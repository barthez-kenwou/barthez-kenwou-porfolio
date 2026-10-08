import React from 'react';
import { cn } from '@/shared/lib';

/**
 * Branded route loader - monogram core, dual orbits, shimmer rail.
 * Vertically + horizontally centered in its container.
 */
export const RouteFallback: React.FC<{ className?: string; fullScreen?: boolean }> = ({
  className,
  fullScreen = false,
}) => {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center px-4',
        fullScreen ? 'min-h-svh bg-background' : 'flex-1 min-h-[calc(100svh-10rem)]',
        className,
      )}
      role="status"
      aria-label="Loading"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center gap-6">
        <div
          className="pointer-events-none absolute -inset-16 rounded-full bg-primary/10 blur-3xl animate-pulse"
          aria-hidden
        />

        <div className="relative size-[5.5rem] sm:size-24">
          <span
            className="loader-orbit absolute inset-0 rounded-full border border-dashed border-primary/25"
            aria-hidden
          />
          <span
            className="loader-spin absolute inset-2 rounded-full border-2 border-transparent border-t-primary border-r-primary/40"
            aria-hidden
          />
          <span
            className="absolute inset-[22%] rounded-full bg-gradient-to-br from-primary/25 via-primary/5 to-transparent"
            aria-hidden
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="select-none font-black tracking-tighter text-xl sm:text-2xl font-display text-foreground">
              BK
            </span>
          </div>

          <span className="loader-orbit-fast absolute inset-0" aria-hidden>
            <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
          </span>
          <span className="loader-orbit-reverse absolute inset-0" aria-hidden>
            <span className="absolute left-1/2 bottom-0 size-1 -translate-x-1/2 rounded-full bg-primary/70" />
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-muted-foreground">
            Barthez Kenwou
          </p>
          <div className="relative h-[2px] w-28 overflow-hidden rounded-full bg-border/60">
            <span className="loader-shimmer absolute inset-y-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};
