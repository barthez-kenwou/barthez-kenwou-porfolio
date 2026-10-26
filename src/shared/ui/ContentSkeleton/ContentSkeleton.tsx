import React from 'react';
import { cn } from '@/shared/lib/utils';

type ContentSkeletonProps = {
  className?: string;
  /** Approximate list/table rows */
  rows?: number;
  /** Show a title bar pulse (page chrome already has the real title) */
  withTitle?: boolean;
};

/**
 * Lightweight in-shell placeholder — used while a lazy chunk or query settles.
 * Not the branded BK boot loader (that stays for cold start / fullScreen only).
 */
export function ContentSkeleton({ className, rows = 7, withTitle = false }: ContentSkeletonProps) {
  return (
    <div
      className={cn('w-full animate-pulse space-y-3', className)}
      role="status"
      aria-label="Loading"
      aria-live="polite"
    >
      {withTitle ? <div className="h-8 w-40 max-w-[40%] rounded-md bg-muted/55" /> : null}
      <div className="h-10 w-full rounded-md bg-muted/40" />
      <div className="space-y-2 pt-1">
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className="h-11 w-full rounded-md bg-muted/30"
            style={{ opacity: 1 - i * 0.07 }}
          />
        ))}
      </div>
    </div>
  );
}
