import { useAuth } from '@/app/providers/AuthProvider';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ADMIN_LOGIN } from '@/shared/config/admin';
import { rememberAdminReturnPath, toAdminReturnPath } from '@/shared/config/adminReturnPath';
import { LoadingPage } from '@/shared/ui/LoadingPage/LoadingPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    const returnPath = toAdminReturnPath(location);
    rememberAdminReturnPath(returnPath);
    return <Navigate to={ADMIN_LOGIN} replace state={{ from: returnPath }} />;
  }

  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    const returnPath = toAdminReturnPath(location);
    rememberAdminReturnPath(returnPath);
    return <Navigate to={ADMIN_LOGIN} replace state={{ from: returnPath }} />;
  }

  return <>{children}</>;
};
