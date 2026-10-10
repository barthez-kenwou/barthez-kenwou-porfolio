import { analytics } from './analytics';

export type ErrorReportInfo = {
  componentStack?: string;
  context?: Record<string, unknown>;
};

/**
 * Centralized error reporting helper.
 * - Calls `analytics.trackError` (project analytics adapter)
 * - Optionally attempts to forward to Sentry if `SENTRY_DSN` is configured (dynamic import)
 */
export async function reportError(error: Error, info?: ErrorReportInfo) {
  try {
    const props: Record<string, string | number | boolean | undefined> = {
      errorBoundary: true,
      componentStack: info?.componentStack?.slice(0, 120),
    };
    if (info?.context) {
      for (const [key, value] of Object.entries(info.context)) {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          props[key] = value;
        } else if (value != null) {
          props[key] = String(value).slice(0, 80);
        }
      }
    }
    analytics.trackError(error, props);
  } catch (e: unknown) {
    // analytics adapter failed - swallow to avoid further crashes
    // eslint-disable-next-line no-console
    console.warn('analytics.trackError failed', e);
  }

  // Try to forward to Sentry if available at runtime (opt-in via env and install)
  try {
    if (
      typeof process !== 'undefined' &&
      (process.env.SENTRY_DSN || (window as any).__SENTRY_DSN__)
    ) {
      // Attempt a runtime import using a dynamically-created function so bundlers
      // (Vite/Rollup) do not attempt to statically analyze and resolve the module.
      // This keeps `@sentry/browser` optional and avoids build-time errors when
      // it's not installed.
      const runtimeImport = new Function('modulePath', 'return import(modulePath);');
      const Sentry = await runtimeImport('@sentry/browser').catch(() => null);
      if (Sentry && (Sentry as any).captureException) {
        (Sentry as any).captureException(error, { extra: info });
      }
    }
  } catch {
    // ignore failures - this package is optional and should not crash the app
  }
}
