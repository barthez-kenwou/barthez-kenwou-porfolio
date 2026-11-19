import React, { useEffect } from 'react';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import { InternalErrorPage } from './InternalErrorPage/InternalError';
import { isChunkLoadError, reloadOnceForChunkError } from '@/shared/lib/chunkLoadError';

function normalizeRouteError(error: unknown): { error?: Error; errorId?: string } {
  if (isRouteErrorResponse(error)) {
    const message =
      typeof error.data === 'string' && error.data.trim()
        ? error.data
        : error.statusText || `HTTP ${error.status}`;
    return {
      error: new Error(message),
      errorId: `route-${error.status}`,
    };
  }
  if (error instanceof Error) {
    return { error };
  }
  return { error: new Error(typeof error === 'string' ? error : 'Unexpected error') };
}

/**
 * React Router `errorElement` — glass error UI that renders inside the
 * parent layout Outlet (header / aside / footer stay mounted).
 * Stale chunk errors reload once instead of flashing this screen.
 */
export const RouteErrorElement: React.FC = () => {
  const routeError = useRouteError();
  const navigate = useNavigate();
  const { error, errorId } = normalizeRouteError(routeError);

  useEffect(() => {
    if (isChunkLoadError(routeError) || isChunkLoadError(error)) {
      reloadOnceForChunkError();
    }
  }, [routeError, error]);

  if (isChunkLoadError(routeError) || isChunkLoadError(error)) {
    return null;
  }

  return (
    <InternalErrorPage
      variant="content"
      error={error}
      errorId={errorId}
      onRetry={() => navigate(0)}
    />
  );
};
