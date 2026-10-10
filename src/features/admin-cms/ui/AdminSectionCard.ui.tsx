import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

export type AdminSectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function AdminSectionCard({
  title,
  description,
  children,
  actions,
  className,
  contentClassName,
}: AdminSectionCardProps) {
  return (
    <Card className={cn('min-w-0 overflow-hidden rounded-xl shadow-none', className)}>
      <CardHeader className="flex flex-col gap-3 space-y-0 px-4 pt-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-5 sm:pt-5">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-[15px] sm:text-base">{title}</CardTitle>
          {description ? (
            <CardDescription className="text-[12px] leading-relaxed sm:text-sm">
              {description}
            </CardDescription>
          ) : null}
        </div>
        {actions ? (
          <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            {actions}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className={cn('space-y-4 px-4 pb-4 sm:px-5 sm:pb-5', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
