const CHUNK_RELOAD_KEY = 'bk:chunk-reload';

/** True when a Vite/React lazy chunk failed to load (usually stale deploy / SW cache). */
export function isChunkLoadError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error ?? '');
  const name = error instanceof Error ? error.name : '';
  return (
    name === 'ChunkLoadError' ||
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /error loading dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg) ||
    /Loading chunk [\w-]+ failed/i.test(msg)
  );
}

/**
 * One hard reload per tab session to pick up the new hashed assets.
 * Returns true if a reload was triggered (caller should stop rendering errors).
 */
export function reloadOnceForChunkError(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (sessionStorage.getItem(CHUNK_RELOAD_KEY) === '1') {
      return false;
    }
    sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
  } catch {
    // private mode / blocked storage — still try a single reload
  }
  window.location.reload();
  return true;
}

/**
 * Clear the reload guard after the app has stayed healthy for a bit.
 * Clearing immediately on boot would allow an infinite reload loop when a
 * nested lazy chunk keeps 404’ing after deploy.
 */
export function clearChunkReloadGuard(): void {
  if (typeof window === 'undefined') return;
  window.setTimeout(() => {
    try {
      sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    } catch {
      // ignore
    }
  }, 8_000);
}
