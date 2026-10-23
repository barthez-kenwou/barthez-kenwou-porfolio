/**
 * Cross-layer auth signals (API client → AuthProvider) without feature imports.
 */

export type SessionEndedReason = 'refresh_failed' | 'unauthorized';

type SessionEndedListener = (reason: SessionEndedReason) => void;

const listeners = new Set<SessionEndedListener>();

export function onSessionEnded(listener: SessionEndedListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitSessionEnded(reason: SessionEndedReason): void {
  for (const listener of listeners) {
    try {
      listener(reason);
    } catch {
      // Listeners must not break the API client.
    }
  }
}
