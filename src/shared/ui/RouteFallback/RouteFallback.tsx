import React from 'react';
import { cn } from '@/shared/lib';

type RouteFallbackProps = {
  className?: string;
  /** Full-viewport shell (app boot / protected route) */
  fullScreen?: boolean;
  /**
   * Compact embed for data QueryState / section placeholders.
   * Same BK orbits — scaled down so nested loads stay branded.
   */
  compact?: boolean;
};

/**
 * Branded route & data loader — BK monogram, dual orbits, shimmer rail.
 * Single source of truth for lazy routes, boot, and query pending states.
 */
export const RouteFallback: React.FC<RouteFallbackProps> = ({
  className,
  fullScreen = false,
  compact = false,
}) => {
  const markSize = compact ? 'size-[3.75rem] sm:size-16' : 'size-[5.75rem] sm:size-28';
  const markType = compact
    ? 'text-lg font-black tracking-tighter sm:text-xl'
    : 'text-2xl font-black tracking-tighter sm:text-3xl';

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center overflow-hidden px-4',
        fullScreen
          ? 'fixed inset-0 z-50 min-h-svh bg-background'
          : compact
            ? 'min-h-[10rem] py-8'
            : 'min-h-[calc(100svh-10rem)] flex-1',
        className,
      )}
      role="status"
      aria-label="Loading"
      aria-live="polite"
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0',
          compact
            ? 'bg-[radial-gradient(ellipse_at_center,hsl(var(--brand)_/_0.06),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)_/_0.08),transparent_60%)]'
            : 'bg-[radial-gradient(ellipse_at_center,hsl(var(--brand)_/_0.08),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)_/_0.1),transparent_55%)]',
        )}
      />
      {!compact ? (
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
      ) : null}

      <div className={cn('relative z-10 flex flex-col items-center', compact ? 'gap-4' : 'gap-7')}>
        <div className={cn('relative', markSize)}>
          <span
            className={cn(
              'pointer-events-none absolute rounded-full bg-brand/10 blur-3xl dark:bg-primary/15',
              compact ? '-inset-6' : '-inset-10',
            )}
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
            className={cn(
              'absolute rounded-full bg-gradient-to-br from-brand/20 via-transparent to-transparent dark:from-primary/25',
              compact ? 'inset-[20%]' : 'inset-[22%]',
            )}
            aria-hidden
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn('font-display select-none text-foreground', markType)}>BK</span>
          </div>

          <span className="loader-orbit-fast absolute inset-0" aria-hidden>
            <span
              className={cn(
                'absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_10px_hsl(var(--brand))] dark:bg-primary dark:shadow-[0_0_10px_hsl(var(--primary))]',
                compact ? 'size-1' : 'size-1.5',
              )}
            />
          </span>
          {!compact ? (
            <span className="loader-orbit-reverse absolute inset-0" aria-hidden>
              <span className="absolute bottom-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-brand/70 dark:bg-primary/70" />
            </span>
          ) : null}
        </div>

        <div className={cn('flex flex-col items-center', compact ? 'gap-2' : 'gap-2.5')}>
          <p
            className={cn(
              'font-mono tracking-[0.42em] text-muted-foreground uppercase',
              compact ? 'text-[9px]' : 'text-[10px]',
            )}
          >
            Barthez Kenwou
          </p>

          <div
            className={cn(
              'relative h-[2px] overflow-hidden rounded-full bg-border/70',
              compact ? 'w-24' : 'w-32',
            )}
          >
            <span className="loader-shimmer absolute inset-y-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-brand to-transparent dark:via-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};
