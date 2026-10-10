import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

type AdminStickyActionsProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Sticky action rail for editors; stays in the thumb zone on mobile,
 * sits inline in the page header from md up. Renders children once.
 */
export function AdminStickyActions({ children, className }: AdminStickyActionsProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-end gap-2 md:w-auto',
        // Mobile: docked above the bottom nav
        'max-md:fixed max-md:inset-x-0 max-md:z-30 max-md:border-t max-md:border-border/70',
        'max-md:bg-background/95 max-md:px-4 max-md:py-3 max-md:backdrop-blur-md',
        'max-md:bottom-[calc(3.65rem+env(safe-area-inset-bottom))]',
        className,
      )}
    >
      {children}
    </div>
  );
}
