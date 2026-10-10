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
    children: [
      {
        element: <PublicLayout />,
        children: publicRoutes.map((route) => ({
          path: route.path === '/' ? undefined : route.path.replace(/^\//, ''),
          index: route.path === '/',
          element: <route.component />,
        })),
      },
      {
        path: 'barthez-admin/login',
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
        children: adminChildRoutes.map((route) => ({
          index: route.path === '',
          path: route.path === '' ? undefined : route.path,
          element: (
            <Suspense fallback={<RouteFallback />}>
              <route.component />
            </Suspense>
          ),
        })),
      },
    ],
  },
]);

export const App: React.FC = () => {
  React.useEffect(() => {
    import('./routes/prefetch').then((m) => m.prefetchRoutes()).catch(() => {});
  }, []);

  return <RouterProvider router={router} />;
};
