import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { isChunkLoadError, reloadOnceForChunkError } from '@/shared/lib/chunkLoadError';

type ModuleMap = Record<string, unknown>;

/**
 * Standardize lazy-loaded pages.
 * On stale-chunk failures (post-deploy), reload once so the SW / shell pick up new hashes.
 */
export function lazyPage(
  loader: () => Promise<ModuleMap>,
  exportName?: string,
): LazyExoticComponent<ComponentType<unknown>> {
  return lazy(async () => {
    try {
      const mod = await loader();
      const Comp = (exportName ? mod[exportName] : mod.default) as ComponentType<unknown>;
      if (!Comp) {
        throw new Error(
          exportName
            ? `lazyPage: export "${exportName}" missing from module`
            : 'lazyPage: default export missing from module',
        );
      }
      return { default: Comp };
    } catch (error) {
      if (isChunkLoadError(error) && reloadOnceForChunkError()) {
        // Keep Suspense pending while the document reloads — avoids flashing the error UI.
        return new Promise(() => undefined);
      }
      throw error;
    }
  });
}
