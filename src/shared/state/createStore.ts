import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type SetFn<T> = (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;

interface CreateOptions {
  name?: string; // used for persist key and devtools name
  enableDevtools?: boolean;
  enablePersist?: boolean;
}

// LocalStorage wrapper compatible with zustand PersistStorage typing
const browserLocalStorage = (_name: string) => {
  return {
    getItem: (key: string) => {
      try {
        const raw = window.localStorage.getItem(key);
        return raw;
      } catch {
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // ignore quota errors
      }
    },
    removeItem: (key: string) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
    },
  } as const;
};

/**
 * Create a zustand store with sensible defaults for large projects.
 * - Enables `devtools` only when `enableDevtools` is true
 * - Enables `persist` only when `enablePersist` is true
 *
 * Usage:
 * const useStore = createAppStore((set, get) => ({ ... }), { name: 'my-store', enablePersist: true });
 */
export function createAppStore<TState extends object>(
  initializer: (set: SetFn<TState>, get: () => TState, api?: any) => TState,
  options?: CreateOptions,
) {
  const name = options?.name ?? 'app-store';
  const enableDevtools = options?.enableDevtools ?? process.env.NODE_ENV !== 'production';
  const enablePersist = options?.enablePersist ?? false;

  let enhanced = initializer as any;

  if (enableDevtools) {
    enhanced = devtools(enhanced, { name });
  }

  if (enablePersist) {
    const storage = typeof window !== 'undefined' ? browserLocalStorage(name) : undefined;
    enhanced = persist(enhanced, { name, storage: storage as any });
  }

  return create<TState>(enhanced);
}
