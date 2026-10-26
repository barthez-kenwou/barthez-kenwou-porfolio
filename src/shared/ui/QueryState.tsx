import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { DataSource } from '@/shared/api';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ContentSkeleton } from '@/shared/ui/ContentSkeleton/ContentSkeleton';

type QueryStateProps = {
  isPending?: boolean;
  isError?: boolean;
  errorMessage?: string;
  source?: DataSource;
  /** Prefer leaving empty handling to AdminDataTable / AdminEmptyState in the CMS. */
  empty?: boolean;
  emptyTitle?: string;
  className?: string;
  children: React.ReactNode;
  /** section = compact table skeleton; page = taller skeleton under existing chrome */
  variant?: 'section' | 'page';
};

/**
 * Data-gate UI. Pending uses a light skeleton — never the branded BK boot spinner
 * (that is reserved for cold start / fullScreen RouteFallback only).
 */
export function QueryState({
  isPending,
  isError,
  errorMessage,
  empty,
  emptyTitle,
  className,
  children,
  variant = 'section',
}: QueryStateProps) {
  const language = useLanguageStore((s) => s.language);
  const fr = language === 'fr';

  if (isPending) {
    return (
      <ContentSkeleton
        rows={variant === 'page' ? 10 : 7}
        className={cn(variant === 'page' ? 'min-h-[40vh] py-6' : 'py-2', className)}
      />
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
        {errorMessage || (fr ? 'Impossible de charger les données' : 'Failed to load data')}
      </div>
    );
  }

  if (empty) {
    return (
      <div className={cn('py-10 text-center text-sm text-muted-foreground', className)}>
        {emptyTitle || (fr ? 'Rien ici pour le moment' : 'Nothing here yet')}
      </div>
    );
  }

  return <div className={cn('relative', className)}>{children}</div>;
}
