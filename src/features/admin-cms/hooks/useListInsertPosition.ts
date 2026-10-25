import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import {
  type ListInsertPosition,
  readListInsertPosition,
  writeListInsertPosition,
} from '../lib/listInsertPosition';

const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function emit() {
  listeners.forEach((l) => l());
}

function getSnapshot(): ListInsertPosition {
  return readListInsertPosition();
}

function getServerSnapshot(): ListInsertPosition {
  return 'start';
}

/**
 * Shared CMS preference: where “Add” inserts in string/media/KV lists.
 * Synced across editors via localStorage + in-tab listeners.
 */
export function useListInsertPosition() {
  const position = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const setPosition = useCallback((next: ListInsertPosition) => {
    writeListInsertPosition(next);
    emit();
  }, []);

  const toggle = useCallback(() => {
    setPosition(position === 'start' ? 'end' : 'start');
  }, [position, setPosition]);

  return {
    position: hydrated ? position : 'start',
    setPosition,
    toggle,
    insertAtStart: position === 'start',
  } as const;
}
