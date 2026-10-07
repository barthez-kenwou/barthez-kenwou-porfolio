import { SidebarTrigger, useSidebar } from '@/shared/ui/sidebar';
import React from 'react';
import { MobileNavbar, Navbar } from '../Navbar';
import { cn } from '@/shared/lib/utils';

export const Header: React.FC = () => {
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  return (
    <>
      <div
        className={cn(
          'fixed z-50 transition-all duration-250 hidden xl:block',
          isExpanded ? 'top-16 left-60' : 'top-10 left-14',
        )}
      >
        <SidebarTrigger className="cursor-pointer shadow-sm bg-background/80 backdrop-blur-sm ring-1 ring-sidebar-border" />
      </div>

      {/* Header remains in place; add spacer to preserve original layout alignment */}
      <header className="w-full relative flex items-center justify-between py-0 -mb-10">
        <div className="relative w-full">
          <Navbar />
          <MobileNavbar />
        </div>
      </header>
    </>
  );
};
