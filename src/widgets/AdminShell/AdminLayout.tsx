import { Outlet, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { SidebarInset, SidebarProvider, useSidebar } from '@/shared/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminMobileDock } from './AdminMobileDock';
import { ErrorBoundary } from '@/app/lib/ErrorBoundary';
import { RouteFallback } from '@/shared/ui/RouteFallback/RouteFallback';

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
  const location = useLocation();

  return (
    <SidebarProvider defaultOpen>
      <CloseMobileNavOnRouteChange />
      <AdminSidebar />
      <SidebarInset className="flex h-svh max-h-svh min-w-0 flex-col overflow-hidden bg-background">
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

        <main className="relative min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
          <div className="mx-auto w-full max-w-6xl px-4 py-5 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:px-6 md:py-6 md:pb-8 lg:px-8 lg:py-8">
            {/*
              Boundary around page content only — sidebar / header / dock stay up.
              key=pathname resets after navigation so a fixed page can recover.
            */}
            <ErrorBoundary key={location.pathname} variant="content">
              <Suspense fallback={<RouteFallback className="min-h-[16rem]" />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>

        <AdminMobileDock />
      </SidebarInset>
    </SidebarProvider>
  );
}
