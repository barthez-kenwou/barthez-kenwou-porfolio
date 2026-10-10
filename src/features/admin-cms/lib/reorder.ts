export type ReorderDirection = 'up' | 'down';

export type SortableItem = {
  id: string;
  sortOrder?: number;
};

export type ReorderPatch = {
  id: string;
  sortOrder: number;
};

export function sortBySortOrder<T extends { sortOrder?: number }>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const ao = a.item.sortOrder;
      const bo = b.item.sortOrder;
      if (ao == null && bo == null) return a.index - b.index;
      if (ao == null) return 1;
      if (bo == null) return -1;
      if (ao !== bo) return ao - bo;
      return a.index - b.index;
    })
    .map(({ item }) => item);
}

export function getReorderTargets(
  items: SortableItem[],
  id: string,
  direction: ReorderDirection,
): ReorderPatch[] {
  const sorted = sortBySortOrder(items);
  const index = sorted.findIndex((item) => String(item.id) === String(id));
  if (index < 0) return [];

  const neighborIndex = direction === 'up' ? index - 1 : index + 1;
  if (neighborIndex < 0 || neighborIndex >= sorted.length) return [];

  const current = sorted[index];
  const neighbor = sorted[neighborIndex];
  const currentOrder = current.sortOrder ?? index;
  const neighborOrder = neighbor.sortOrder ?? neighborIndex;

  if (currentOrder === neighborOrder) {
    return [
      { id: String(current.id), sortOrder: neighborIndex },
      { id: String(neighbor.id), sortOrder: index },
    ];
  }

  return [
    { id: String(current.id), sortOrder: neighborOrder },
    { id: String(neighbor.id), sortOrder: currentOrder },
  ];
}
