import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { SidebarInset, SidebarProvider, useSidebar } from '@/shared/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminMobileDock } from './AdminMobileDock';

function CloseMobileNavOnRouteChange() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  // Pathname only — including openMobile in deps caused instant auto-close on open.
  useEffect(() => {
    setOpenMobile(false);
  }, [location.pathname, setOpenMobile]);

  return null;
}

export function AdminLayout() {
  return (
    <SidebarProvider defaultOpen>
      <CloseMobileNavOnRouteChange />
      <AdminSidebar />
      <SidebarInset className="flex h-svh max-h-svh flex-col overflow-hidden bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 0)',
            backgroundSize: '22px 22px',
            maskImage: 'linear-gradient(to bottom, #000 0%, transparent 70%)',
          }}
        />

        <AdminHeader />

        <main className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto w-full max-w-6xl px-4 py-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:px-6 md:py-6 md:pb-8 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>

        <AdminMobileDock />
      </SidebarInset>
    </SidebarProvider>
  );
}
