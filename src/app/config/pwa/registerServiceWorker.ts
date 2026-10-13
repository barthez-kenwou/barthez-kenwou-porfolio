/*
  Modular service worker registration helper.
  Registers the SW from `vite-plugin-pwa` and reloads once when a new SW takes control
  so open tabs do not keep importing deleted hashed chunks after a deploy.
*/
export async function registerServiceWorker(): Promise<void> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  if (!import.meta.env.PROD) return;

  try {
    const hadController = Boolean(navigator.serviceWorker.controller);
    const reg = await navigator.serviceWorker.register('/sw.js');

    // When autoUpdate SW activates, refresh once so the shell matches new asset hashes.
    // Skip the first-ever install (no previous controller) to avoid a double load.
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    reg.addEventListener?.('updatefound', () => {
      const newWorker = reg.installing;
      if (!newWorker) return;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          console.log('[PWA] Service worker installed/updated');
        }
      });
    });

    // Check for updates periodically while the tab is open.
    window.setInterval(
      () => {
        void reg.update().catch(() => undefined);
      },
      60 * 60 * 1000,
    );

    console.log('[PWA] Service worker registered', reg.scope);
  } catch (err) {
    console.warn('[PWA] Service worker registration failed', err);
  }
}

export async function unregisterServiceWorker(): Promise<void> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(regs.map((r) => r.unregister()));
}
