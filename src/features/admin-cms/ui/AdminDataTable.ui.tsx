import { useMemo, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { AdminEmptyState } from './AdminEmptyState.ui';

export type AdminDataTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
  /** Hide this column in the mobile card meta (still usable in desktop table). */
  hideOnMobile?: boolean;
};

export type AdminDataTableFilter<T = unknown> = {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  match?: (row: T, selected: string) => boolean;
};

export type AdminDataTableProps<T> = {
  columns: AdminDataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  emptyTitle: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => ReactNode;
  searchKeys?: string[];
  searchPlaceholder?: string;
  filters?: AdminDataTableFilter<T>[];
  toolbar?: ReactNode;
  className?: string;
  defaultPageSize?: 10 | 20 | 30 | 50;
};

function rowMatchesQuery<T>(row: T, query: string, searchKeys?: string[]) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  if (searchKeys && searchKeys.length > 0) {
    const record = row as Record<string, unknown>;
    return searchKeys.some((key) => {
      const value = record[key];
      if (value == null) return false;
      return String(value).toLowerCase().includes(normalized);
    });
  }

  try {
    return JSON.stringify(row).toLowerCase().includes(normalized);
  } catch {
    return false;
  }
}

function readCellValue<T>(row: T, key: string, isFr: boolean): ReactNode {
  const value = (row as Record<string, unknown>)[key];
  if (value == null) return '-';
  if (typeof value === 'boolean') return value ? (isFr ? 'Oui' : 'Yes') : isFr ? 'Non' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function AdminDataTable<T>({
  columns,
  data,
  getRowId,
  emptyTitle,
  emptyDescription,
  onRowClick,
  actions,
  searchKeys,
  searchPlaceholder,
  filters = [],
  toolbar,
  className,
  defaultPageSize = 10,
}: AdminDataTableProps<T>) {
  const language = useLanguageStore((s) => s.language);
  const isFr = language === 'fr';
  const allLabel = isFr ? 'Tous' : 'All';
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    return data.filter((row) => {
      if (!rowMatchesQuery(row, query, searchKeys)) return false;
      for (const f of filters) {
        const selected = filterValues[f.key];
        if (!selected || selected === 'all') continue;
        if (f.match) {
          if (!f.match(row, selected)) return false;
          continue;
        }
        const val = (row as Record<string, unknown>)[f.key];
        if (String(val) !== selected) return false;
      }
      return true;
    });
  }, [data, query, searchKeys, filters, filterValues]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const primaryCol = columns[0];
  const mobileMetaCols = columns.slice(1).filter((c) => !c.hideOnMobile);
  const activeFilterCount = Object.values(filterValues).filter((v) => v && v !== 'all').length;
  const hasActiveFilters = activeFilterCount > 0 || query.trim().length > 0;

  const clearFilters = () => {
    setFilterValues({});
    setQuery('');
    setPage(1);
  };

  const filterSelects = filters.map((f) => (
    <Select
      key={f.key}
      value={filterValues[f.key] || 'all'}
      onValueChange={(v) => {
        setFilterValues((prev) => ({ ...prev, [f.key]: v }));
        setPage(1);
      }}
    >
      <SelectTrigger className="h-10 w-full min-w-0 md:h-9 md:w-[9.5rem]" aria-label={f.label}>
        <SelectValue placeholder={f.label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          {allLabel} · {f.label}
        </SelectItem>
        {f.options.map((o) => (
          <SelectItem key={o.value} value={o.value} className="max-w-[18rem]">
            <span className="truncate">{o.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ));

  const pageSizeSelect = (
    <Select
      value={String(pageSize)}
      onValueChange={(v) => {
        setPageSize(Number(v));
        setPage(1);
      }}
    >
      <SelectTrigger
        className="h-10 w-full shrink-0 md:h-9 md:w-[4.25rem]"
        aria-label={isFr ? 'Lignes par page' : 'Rows per page'}
        title={isFr ? `${pageSize} par page` : `${pageSize} per page`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {[10, 20, 30, 50].map((n) => (
          <SelectItem key={n} value={String(n)}>
            {n}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const clearButton =
    hasActiveFilters || activeFilterCount > 0 ? (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-10 shrink-0 cursor-pointer gap-1.5 px-2 text-muted-foreground md:h-9"
        onClick={clearFilters}
      >
        <X className="size-3.5" />
        {isFr ? 'Effacer' : 'Clear'}
      </Button>
    ) : null;

  return (
    <div className={cn('min-w-0 space-y-3.5', className)}>
      <div className="flex flex-col gap-2.5">
        <div className="grid gap-2.5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground md:left-2.5 md:size-3.5" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder || (isFr ? 'Rechercher…' : 'Search…')}
              className="h-11 pl-10 shadow-none md:h-9 md:pl-8"
            />
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {filterSelects}
            {pageSizeSelect}
            {clearButton}
            {toolbar}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button type="button" variant="outline" className="h-11 flex-1 cursor-pointer gap-2 shadow-none">
                  <SlidersHorizontal className="size-4" />
                  {isFr ? 'Filtres' : 'Filters'}
                  {activeFilterCount > 0 ? (
                    <span className="rounded-sm bg-primary/15 px-1.5 text-[10px] font-semibold text-primary">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="gap-0 overflow-hidden rounded-t-xl border-t px-5 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-lg"
              >
                <SheetHeader className="space-y-0 px-0 pb-4 text-left">
                  <SheetTitle className="pr-10">
                    {isFr ? 'Filtres & pagination' : 'Filters & paging'}
                  </SheetTitle>
                </SheetHeader>
                <div className="grid gap-4">
                  {filterSelects.length > 0 ? (
                    <div className="grid gap-3">{filterSelects}</div>
                  ) : null}
                  <div className="grid gap-2 border-t border-border/50 pt-4">
                    <p className="cursor-default text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {isFr ? 'Lignes par page' : 'Rows per page'}
                    </p>
                    <div className="max-w-[6.5rem]">{pageSizeSelect}</div>
                  </div>
                  {hasActiveFilters ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full cursor-pointer gap-2"
                      onClick={clearFilters}
                    >
                      <X className="size-4" />
                      {isFr ? 'Effacer filtres' : 'Clear filters'}
                    </Button>
                  ) : null}
                </div>
              </SheetContent>
            </Sheet>
            {toolbar}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState title={emptyTitle} description={emptyDescription ?? ''} />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {pageRows.map((row) => (
              <article
                key={getRowId(row)}
                className={cn(
                  'min-w-0 overflow-hidden rounded-xl border border-border/60 bg-card/40 p-4',
                  onRowClick && 'cursor-pointer active:bg-muted/40',
                )}
                onClick={() => onRowClick?.(row)}
                onKeyDown={(e) => {
                  if (!onRowClick) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onRowClick(row);
                  }
                }}
                role={onRowClick ? 'button' : undefined}
                tabIndex={onRowClick ? 0 : undefined}
              >
                <div className="min-w-0 overflow-hidden break-words text-[15px] font-medium leading-snug [&_*]:break-words">
                  {primaryCol?.render
                    ? primaryCol.render(row)
                    : primaryCol
                      ? readCellValue(row, primaryCol.key, isFr)
                      : null}
                </div>

                {mobileMetaCols.length > 0 ? (
                  <dl className="mt-3.5 space-y-2.5 border-t border-border/50 pt-3.5">
                    {mobileMetaCols.map((col) => (
                      <div key={col.key} className="grid gap-0.5">
                        <dt className="cursor-default text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          {col.header}
                        </dt>
                        <dd
                          className="min-w-0 overflow-hidden break-all text-sm leading-snug"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          {col.render ? col.render(row) : readCellValue(row, col.key, isFr)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {actions ? (
                  <div
                    className="mt-3.5 flex flex-wrap justify-end gap-1.5 border-t border-border/50 pt-3.5 [&_button]:size-10 [&_a]:size-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actions(row)}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-xl border border-border/60 bg-card/30 md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {columns.map((col) => (
                      <TableHead
                        key={col.key}
                        className={cn('cursor-default select-none', col.className)}
                      >
                        {col.header}
                      </TableHead>
                    ))}
                    {actions ? (
                      <TableHead className="w-[1%] cursor-default text-right">
                        {isFr ? 'Actions' : 'Actions'}
                      </TableHead>
                    ) : null}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.map((row) => (
                    <TableRow
                      key={getRowId(row)}
                      className={cn(onRowClick && 'cursor-pointer')}
                      onClick={() => onRowClick?.(row)}
                    >
                      {columns.map((col) => (
                        <TableCell key={col.key} className={cn('max-w-[18rem]', col.className)}>
                          <div className="min-w-0 overflow-hidden">
                            {col.render ? col.render(row) : readCellValue(row, col.key, isFr)}
                          </div>
                        </TableCell>
                      ))}
                      {actions ? (
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1">{actions(row)}</div>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <p className="cursor-default">
              {filtered.length} {isFr ? 'élément(s)' : 'item(s)'}
              {' · '}
              {isFr ? 'Page' : 'Page'} {safePage}/{totalPages}
            </p>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="size-11 cursor-pointer shadow-none md:size-8"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="size-11 cursor-pointer shadow-none md:size-8"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
