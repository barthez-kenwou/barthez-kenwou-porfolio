export type ListInsertPosition = 'start' | 'end';

const STORAGE_KEY = 'bk-admin-list-insert-position';

/** Default: top — long lists stay editable without scrolling to the bottom. */
export const DEFAULT_LIST_INSERT_POSITION: ListInsertPosition = 'start';

export function readListInsertPosition(): ListInsertPosition {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'start' || raw === 'end') return raw;
  } catch {
    /* private mode / SSR */
  }
  return DEFAULT_LIST_INSERT_POSITION;
}

export function writeListInsertPosition(position: ListInsertPosition): void {
  try {
    localStorage.setItem(STORAGE_KEY, position);
  } catch {
    /* ignore */
  }
}

export function insertIntoList<T>(
  list: readonly T[],
  item: T,
  position: ListInsertPosition = readListInsertPosition(),
): T[] {
  return position === 'start' ? [item, ...list] : [...list, item];
}

/** Insert several items (e.g. filtered + new url) respecting position. */
export function insertManyIntoList<T>(
  list: readonly T[],
  items: readonly T[],
  position: ListInsertPosition = readListInsertPosition(),
): T[] {
  if (items.length === 0) return [...list];
  return position === 'start' ? [...items, ...list] : [...list, ...items];
}
