import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { DataSource } from '@/shared/api';

type QueryStateProps = {
  isPending?: boolean;
  isError?: boolean;
  errorMessage?: string;
  source?: DataSource;
  empty?: boolean;
  emptyTitle?: string;
  className?: string;
  children: React.ReactNode;
  /** Compact inline spinner for section embeds */
  variant?: 'section' | 'page';
};

export function QueryState({
  isPending,
  isError,
  errorMessage,
  source,
  empty,
  emptyTitle = 'Nothing here yet',
  className,
  children,
  variant = 'section',
}: QueryStateProps) {
  if (isPending) {
    return (
      <div
        className={cn(
          'flex items-center justify-center gap-2 text-muted-foreground',
          variant === 'page' ? 'min-h-[40vh]' : 'min-h-[12rem] py-10',
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <Loader2 className="size-5 animate-spin" />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={cn(
          'rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-6 text-sm text-destructive',
          className,
        )}
        role="alert"
      >
        {errorMessage || 'Failed to load data'}
      </div>
    );
  }

  if (empty) {
    return (
      <div className={cn('py-10 text-center text-sm text-muted-foreground', className)}>
        {emptyTitle}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {source === 'mock' ? (          
        <>
        </>
      ) : null}
      {children}
    </div>
  );
}
