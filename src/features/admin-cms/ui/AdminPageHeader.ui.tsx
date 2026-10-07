import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

export type AdminPageHeaderProps = {
  title: string;
  /** @deprecated Prefer silent headers; kept optional for rare cases */
  description?: string;
  actions?: ReactNode;
  className?: string;
};

/**
 * Page title row only. Breadcrumbs live in AdminHeader; do not duplicate here.
 * On mobile, primary actions become full-width thumb targets.
 */
export function AdminPageHeader({ title, actions, className }: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-5 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4',
        className,
      )}
    >
      <h1 className="text-[1.35rem] font-semibold tracking-tight text-foreground sm:text-[1.65rem]">
        {title}
      </h1>
      {actions ? (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end [&_a]:min-h-11 [&_button]:min-h-11 sm:[&_a]:min-h-9 sm:[&_button]:min-h-9">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
