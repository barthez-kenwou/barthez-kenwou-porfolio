import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { SpectrumButton } from '@/shared/ui/SpectrumButton';
import { trackContactClick, trackCtaClick } from '@/app/lib/analytics';

type MobileStickyCtaBarProps = {
  visible: boolean;
  to: string;
  label: string;
  /** Analytics location key, e.g. about_sticky */
  location: string;
  ctaId?: string;
  className?: string;
};

/**
 * Mobile conversion bar parked above the public bottom dock (CV pattern).
 */
export const MobileStickyCtaBar: React.FC<MobileStickyCtaBarProps> = ({
  visible,
  to,
  label,
  location,
  ctaId = 'contact',
  className,
}) => {
  return (
    <div
      className={cn(
        'fixed inset-x-0 z-40 px-3 print:hidden xl:hidden',
        'bottom-19',
        'transition-[opacity,transform] duration-300 ease-out',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto max-w-lg rounded-xl border border-border/60 bg-background/92 p-2 shadow-lg backdrop-blur-xl',
          'supports-backdrop-filter:bg-background/80',
        )}
      >
        <SpectrumButton asChild variant="solid" size="sm" className="h-10 w-full text-sm">
          <Link
            to={to}
            onClick={() => {
              trackContactClick(location);
              trackCtaClick(ctaId, location, to);
            }}
            onMouseEnter={() => {
              void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
            }}
            onTouchStart={() => {
              void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
            }}
          >
            {label}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </SpectrumButton>
      </div>
    </div>
  );
};
