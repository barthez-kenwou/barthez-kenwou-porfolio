import React from 'react';
import { cn } from '@/shared/lib/utils';
import { CvQuickActions } from './CvQuickActions';

type CvMobileStickyBarProps = {
  onDownload: () => void;
  /** Hide when the end CTA is already visible */
  visible?: boolean;
};

/**
 * Mobile-only conversion bar, parked above the bottom dock.
 */
export const CvMobileStickyBar: React.FC<CvMobileStickyBarProps> = ({
  onDownload,
  visible = true,
}) => {
  return (
    <div
      className={cn(
        'fixed inset-x-0 z-40 px-3 print:hidden xl:hidden',
        // Sit above MobileNavbar (~72px)
        'bottom-19',
        'transition-[opacity,transform] duration-300 ease-out',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <div
        className={cn(
          'mx-auto max-w-lg rounded-xl border border-border/60 bg-background/92 p-2 shadow-lg backdrop-blur-xl',
          'supports-backdrop-filter:bg-background/80',
        )}
      >
        <CvQuickActions variant="sticky" onDownload={onDownload} />
      </div>
    </div>
  );
};
