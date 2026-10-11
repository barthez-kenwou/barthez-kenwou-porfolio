import React from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';

export type DateFieldProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
  /** Inclusive year bounds for the year select */
  minYear?: number;
  maxYear?: number;
};

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toIsoDate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, day] = value.split('-').map(Number);
  const d = new Date(y, m - 1, day);
  if (d.getFullYear() !== y || d.getMonth() !== m - 1 || d.getDate() !== day) return null;
  return d;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildMonthGrid(view: Date): (Date | null)[] {
  const first = startOfMonth(view);
  // Monday-first (ISO) — natural for FR, fine for EN
  const weekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < weekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(view.getFullYear(), view.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function DateField({
  value,
  onChange,
  id,
  disabled,
  className,
  minYear,
  maxYear,
}: DateFieldProps) {
  const language = useLanguageStore((s) => s.language);
  const fr = language === 'fr';
  const locale = fr ? 'fr-FR' : 'en-GB';

  const selected = parseIsoDate(value.slice(0, 10));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState(() => startOfMonth(selected ?? today));

  React.useEffect(() => {
    if (!open) return;
    setView(startOfMonth(selected ?? today));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-sync only when the sheet opens
  }, [open]);

  const yearNow = today.getFullYear();
  const yearsFrom = minYear ?? yearNow - 8;
  const yearsTo = maxYear ?? yearNow + 3;
  const years = Array.from({ length: yearsTo - yearsFrom + 1 }, (_, i) => yearsFrom + i);

  const months = Array.from({ length: 12 }, (_, month) => ({
    value: String(month),
    label: new Date(2000, month, 1).toLocaleDateString(locale, { month: 'long' }),
  }));

  const weekdays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2024, 0, 1 + i); // Monday
    return d.toLocaleDateString(locale, { weekday: 'short' });
  });

  const cells = buildMonthGrid(view);

  const label = selected
    ? selected.toLocaleDateString(locale, {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : fr
      ? 'Choisir une date'
      : 'Pick a date';

  const pick = (d: Date) => {
    onChange(toIsoDate(d));
    setOpen(false);
  };

  return (
    <>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={cn(
          'border-input dark:bg-input/30 flex h-11 w-full cursor-pointer items-center gap-2 rounded-sm border bg-transparent px-3 text-left text-base outline-none transition-[color,box-shadow] sm:h-9 md:text-sm',
          'focus-visible:border-primary/50 focus-visible:ring-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          !selected && 'text-muted-foreground',
          className,
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <CalendarDays className="size-4 shrink-0 text-primary/80" aria-hidden />
        <span className="min-w-0 flex-1 truncate capitalize">{label}</span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="gap-0 rounded-t-xl border-border/70 bg-background p-0 sm:mx-auto sm:max-w-md"
        >
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border sm:hidden" aria-hidden />

          <SheetHeader className="gap-1 px-4 pt-3 pb-2 text-left sm:px-5 sm:pt-5">
            <SheetTitle className="text-base">
              {fr ? 'Date de publication' : 'Publication date'}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-3 px-4 pb-2 sm:px-5">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-11 shrink-0 sm:size-9"
                onClick={() => setView((v) => addMonths(v, -1))}
                aria-label={fr ? 'Mois précédent' : 'Previous month'}
              >
                <ChevronLeft className="size-4" />
              </Button>

              <Select
                value={String(view.getMonth())}
                onValueChange={(m) => setView(new Date(view.getFullYear(), Number(m), 1))}
              >
                <SelectTrigger className="h-11 min-w-0 flex-1 capitalize sm:h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[60]">
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value} className="capitalize">
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={String(view.getFullYear())}
                onValueChange={(y) => setView(new Date(Number(y), view.getMonth(), 1))}
              >
                <SelectTrigger className="h-11 w-[5.75rem] shrink-0 sm:h-9 sm:w-[5.5rem]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[60]">
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-11 shrink-0 sm:size-9"
                onClick={() => setView((v) => addMonths(v, 1))}
                aria-label={fr ? 'Mois suivant' : 'Next month'}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {weekdays.map((wd) => (
                <div
                  key={wd}
                  className="py-1.5 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {wd.replace(/\.$/, '').slice(0, 3)}
                </div>
              ))}
              {cells.map((cell, i) => {
                if (!cell) {
                  return <div key={`e-${i}`} className="min-h-11 sm:min-h-10" />;
                }
                const isSelected = selected ? sameDay(cell, selected) : false;
                const isToday = sameDay(cell, today);
                return (
                  <button
                    key={toIsoDate(cell)}
                    type="button"
                    onClick={() => pick(cell)}
                    className={cn(
                      'flex min-h-11 cursor-pointer items-center justify-center rounded-sm text-sm font-medium transition-colors sm:min-h-10',
                      'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35',
                      isSelected &&
                        'bg-brand text-brand-foreground hover:bg-brand-hover hover:text-brand-foreground',
                      !isSelected && isToday && 'border border-primary/50 text-primary',
                      !isSelected && !isToday && 'text-foreground',
                    )}
                  >
                    {cell.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          <SheetFooter className="flex-row justify-end border-t border-border/60 px-4 py-3 sm:px-5">
            <Button
              type="button"
              variant="secondary"
              className="h-11 w-full sm:h-9 sm:w-auto"
              onClick={() => pick(today)}
            >
              {fr ? "Aujourd'hui" : 'Today'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
