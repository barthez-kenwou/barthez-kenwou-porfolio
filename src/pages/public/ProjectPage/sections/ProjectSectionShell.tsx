import React from 'react';
import { cn } from '@/shared/lib/utils';

type HeadingTone = 'default' | 'plain' | 'ruled' | 'quiet';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  /** Visual rhythm — avoid identical chrome on every block */
  tone?: HeadingTone;
  /** Centered heading (use sparingly) */
  centered?: boolean;
};

/**
 * Shared section wrapper for project detail.
 * Tones differ on purpose so the page doesn't read as one repeated template.
 */
export const ProjectSectionShell: React.FC<Props> = ({
  title,
  subtitle,
  children,
  className,
  tone = 'default',
  centered = false,
}) => {
  return (
    <section className={cn('mb-14 md:mb-20 px-4 md:px-10 lg:px-14', className)}>
      <header
        className={cn(
          'mb-6 md:mb-8',
          centered && 'text-center',
          tone === 'ruled' && 'border-t border-border/50 pt-8 md:pt-10',
        )}
      >
        {tone === 'default' && !centered && (
          <div className="flex items-baseline gap-3 mb-1.5">
            <span className="w-6 h-px bg-primary shrink-0 translate-y-[-0.35em]" aria-hidden />
            <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground tracking-tight !mb-0">
              {title}
            </h2>
          </div>
        )}

        {(tone === 'plain' || (tone === 'default' && centered)) && (
          <div className={cn('flex items-baseline gap-3', centered && 'justify-center')}>
            {!centered && (
              <span className="w-6 h-px bg-primary/80 shrink-0 translate-y-[-0.35em]" aria-hidden />
            )}
            <h2
              className={cn(
                'font-heading text-lg md:text-xl font-semibold text-foreground tracking-tight !mb-0',
                centered && 'mx-auto',
              )}
            >
              {title}
            </h2>
          </div>
        )}

        {tone === 'ruled' && (
          <div className="flex items-baseline gap-3">
            <span className="w-6 h-px bg-primary shrink-0 translate-y-[-0.35em]" aria-hidden />
            <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground tracking-tight !mb-0">
              {title}
            </h2>
          </div>
        )}

        {tone === 'quiet' && (
          <h2 className="text-[11px] md:text-xs font-medium uppercase tracking-[0.14em] text-primary/80 !mb-0">
            {title}
          </h2>
        )}

        {subtitle && (
          <p
            className={cn(
              'mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed',
              centered && 'mx-auto',
              (tone === 'default' || tone === 'plain' || tone === 'ruled') && !centered && 'pl-9',
            )}
          >
            {subtitle}
          </p>
        )}
      </header>
      {children}
    </section>
  );
};
