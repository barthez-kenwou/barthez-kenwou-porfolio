import type { ComponentType, LazyExoticComponent } from 'react';
import { lazyImport } from '@/shared/lib/lazyImport';

type ModuleMap = Record<string, unknown>;

/**
 * Standardize lazy-loaded pages.
 * On stale-chunk failures (post-deploy), reload once so the SW / shell pick up new hashes.
 */
export function lazyPage(
  loader: () => Promise<ModuleMap>,
  exportName?: string,
): LazyExoticComponent<ComponentType<unknown>> {
  return lazyImport(async () => {
    const mod = await loader();
    const Comp = (exportName ? mod[exportName] : mod.default) as ComponentType<unknown> | undefined;
    if (!Comp) {
      throw new Error(
        exportName
          ? `lazyPage: export "${exportName}" missing from module`
          : 'lazyPage: default export missing from module',
      );
    }
    return { default: Comp };
  });
}
