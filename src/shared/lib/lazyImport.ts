import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { isChunkLoadError, reloadOnceForChunkError } from '@/shared/lib/chunkLoadError';

type ModuleMap = Record<string, unknown>;

/**
 * `React.lazy` with one hard-reload on stale Vite chunks (post-deploy hash mismatch).
 * Keeps Suspense pending during reload so ErrorBoundary / route error UI never flash.
 */
export function lazyImport<T extends ComponentType<unknown>>(
  loader: () => Promise<ModuleMap>,
  exportName?: string,
): LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      const mod = await loader();
      const Comp = (exportName ? mod[exportName] : mod.default) as T | undefined;
      if (!Comp) {
        throw new Error(
          exportName
            ? `lazyImport: export "${exportName}" missing from module`
            : 'lazyImport: default export missing from module',
        );
      }
      return { default: Comp };
    } catch (error) {
      if (isChunkLoadError(error) && reloadOnceForChunkError()) {
        return new Promise(() => undefined);
      }
      throw error;
    }
  }) as LazyExoticComponent<T>;
}
