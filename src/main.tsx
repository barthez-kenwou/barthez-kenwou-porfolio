import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AppRoot } from './app';
import { clearChunkReloadGuard } from '@/shared/lib/chunkLoadError';

// Successful boot after a chunk-miss reload — allow future deploys to recover again.
clearChunkReloadGuard();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
);

// PWA only in production — register after load so registerSW.js never competes with LCP.
if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_PWA === 'true') {
  const register = () => {
    const run = () =>
      import('./app/config/pwa/registerServiceWorker')
        .then((m) => m.registerServiceWorker())
        .catch((e) => console.warn('[PWA] registration failed', e));

    const ric =
      (
        window as Window & {
          requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        }
      ).requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    ric(run, { timeout: 5000 });
  };

  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}
