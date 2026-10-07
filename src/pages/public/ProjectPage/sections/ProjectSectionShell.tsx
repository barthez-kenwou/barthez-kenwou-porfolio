import React from 'react';
import { cn } from '@/shared/lib/utils';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  /** Centered heading (metrics-style) */
  centered?: boolean;
};

/** Shared chrome for project detail sections - one job, one headline. */
export const ProjectSectionShell: React.FC<Props> = ({
  title,
  subtitle,
  children,
  className,
  centered = false,
}) => {
  return (
    <section className={cn('mb-16 px-4 md:px-10 lg:px-14 animate-fade-in-up', className)}>
      <div className={cn('mb-6 md:mb-8', centered && 'text-center')}>
        <div className={cn('flex items-center gap-3 mb-2', centered && 'justify-center')}>
          {!centered && <span className="w-5 h-0.5 bg-primary rounded-full shrink-0" />}
          <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight !mb-0">
            {title}
          </h2>
          {!centered && <div className="h-px flex-grow bg-border/50" />}
        </div>
        {subtitle && (
          <p
            className={cn('text-sm text-muted-foreground max-w-2xl', centered ? 'mx-auto' : 'pl-8')}
          >
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
};
