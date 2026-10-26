import React, { Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { adminChildRoutes } from './routes/app-routes/admin/admin';
import { RouteFallback } from '@/shared/ui/RouteFallback/RouteFallback';
import { ProtectedRoute } from './routes/config/ProtectedRoute';
import { PublicLayout } from '@/pages/public/Layout';
import { ScrollToTop } from '@/shared/ui/ScrollToTop/ScrollToTop';
import { AdminLayout } from '@/widgets/AdminShell';
import { lazyPage } from './routes/utils/utils';
import { RouteErrorElement } from '@/pages/Errors/RouteErrorElement';
import { InternalErrorPage } from '@/pages/Errors/InternalErrorPage/InternalError';

const AdminLoginPage = lazyPage(() => import('@/pages/app/Admin/LoginPage'), 'AdminLoginPage');

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-foreground">
        <Outlet />
      </div>
    </>
  );
}

const publicRoutes = routes.filter((route) => route.meta?.layout === 'public');

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    // Last-resort when even a layout shell crashes
    errorElement: <InternalErrorPage variant="fullscreen" />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            // Pathless group: errors replace only the Outlet, not navbar/aside/footer
            errorElement: <RouteErrorElement />,
            children: publicRoutes.map((route) => ({
              path: route.path === '/' ? undefined : route.path.replace(/^\//, ''),
              index: route.path === '/',
              element: <route.component />,
            })),
          },
        ],
      },
      {
        path: 'barthez-admin/login',
        errorElement: <InternalErrorPage variant="fullscreen" />,
        element: (
          <Suspense fallback={<RouteFallback fullScreen />}>
            <AdminLoginPage />
          </Suspense>
        ),
      },
      {
        path: 'barthez-admin',
        element: (
          <ProtectedRoute requiredRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            // Pathless group: keep admin sidebar/header when a page blows up
            errorElement: <RouteErrorElement />,
            // Single Suspense lives in AdminLayout — avoid a second BK/skeleton gate per page.
            children: adminChildRoutes.map((route) => ({
              index: route.path === '',
              path: route.path === '' ? undefined : route.path,
              element: <route.component />,
            })),
          },
        ],
      },
    ],
  },
]);

export const App: React.FC = () => {
  React.useEffect(() => {
    // Warm secondary routes only after first paint — blog mocks alone are ~568 KiB.
    const warm = () => {
      void import('./routes/prefetch').then((m) => m.prefetchRoutes()).catch(() => {});
    };
    const ric =
      (
        window as Window & {
          requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        }
      ).requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));

    const onLoad = () => {
      // Wait well past LCP before warming any secondary chunks.
      window.setTimeout(() => ric(warm, { timeout: 15000 }), 10000);
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
  }, []);

  return <RouterProvider router={router} />;
};
