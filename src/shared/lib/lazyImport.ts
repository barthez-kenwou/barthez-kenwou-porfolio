import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { isChunkLoadError, reloadOnceForChunkError } from '@/shared/lib/chunkLoadError';

/**
 * `React.lazy` with one hard-reload on stale Vite chunks (post-deploy hash mismatch).
 * Keeps Suspense pending during reload so ErrorBoundary / route error UI never flash.
 *
 * Prefer `.then((m) => ({ default: m.NamedExport }))` so props stay typed.
 */
export function lazyImport<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
): LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      return await factory();
    } catch (error) {
      if (isChunkLoadError(error) && reloadOnceForChunkError()) {
        return new Promise(() => undefined);
      }
      throw error;
    }
  });
}
