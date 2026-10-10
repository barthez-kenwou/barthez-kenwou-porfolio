import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { DataSource } from '@/shared/api';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

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
  /** Compact inline spinner for section embeds */
  variant?: 'section' | 'page';
};

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
        <span className="text-sm">{fr ? 'Chargement…' : 'Loading…'}</span>
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
