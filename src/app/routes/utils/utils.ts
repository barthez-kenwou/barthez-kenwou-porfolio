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
  return lazyImport(loader, exportName);
}
