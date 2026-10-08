import { AppSidebar } from '@/widgets/AppSidebar';
import { Header } from '@/widgets/Header';
import { SidebarProvider } from '@/shared/ui/sidebar.tsx';
import { PUBLIC_SHELL_BREAKPOINT } from '@/shared/hooks/use-mobile';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from '@/widgets/Footer';
import { Suspense } from 'react';
import { RouteFallback } from '@/shared/ui/RouteFallback/RouteFallback';
import { ErrorBoundary } from '@/app/lib/ErrorBoundary';

function PageShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-enter">
      {children}
    </div>
  );
}

export const PublicLayout = () => {
  const location = useLocation();

  return (
    <SidebarProvider mobileBreakpoint={PUBLIC_SHELL_BREAKPOINT}>
      <div className="w-full flex min-h-screen">
        <AppSidebar />

        {/* Avoid overflow-x-clip here: it breaks position:sticky for page sections */}
        <div className="w-full min-w-0 flex-1 flex flex-col">
          <Header />

          <main className="flex flex-1 flex-col p-0">
            {/*
              Boundary around page content only - shell (aside / nav / footer) stays up.
              key=pathname resets the boundary when the user navigates elsewhere.
            */}
            <ErrorBoundary key={location.pathname}>
              <Suspense fallback={<RouteFallback className="flex-1 min-h-[calc(100svh-10rem)]" />}>
                <PageShell>
                  <Outlet />
                </PageShell>
              </Suspense>
            </ErrorBoundary>
          </main>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};
