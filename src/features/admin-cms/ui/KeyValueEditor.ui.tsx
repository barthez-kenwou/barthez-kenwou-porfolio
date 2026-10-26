import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { insertIntoList } from '../lib/listInsertPosition';
import { useListInsertPosition } from '../hooks/useListInsertPosition';
import { ListInsertPositionToggle } from './ListInsertPositionToggle.ui';

export type KeyValueRecord = Record<string, string | number>;

export type KeyValueEditorProps = {
  label: string;
  value: KeyValueRecord;
  onChange: (value: KeyValueRecord) => void;
  className?: string;
};

type Row = { id: string; key: string; value: string };

function parseValue(raw: string): string | number {
  const trimmed = raw.trim();
  if (trimmed === '') return '';
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const num = Number(trimmed);
    if (!Number.isNaN(num)) return num;
  }
  return raw;
}

function rowsFromRecord(record: KeyValueRecord): Row[] {
  return Object.entries(record).map(([key, val], index) => ({
    id: `${key}-${index}`,
    key,
    value: String(val),
  }));
}

function recordFromRows(rows: Row[]): KeyValueRecord {
  const next: KeyValueRecord = {};
  for (const row of rows) {
    const key = row.key.trim();
    if (!key) continue;
    next[key] = parseValue(row.value);
  }
  return next;
}

let rowSeq = 0;
function createRowId() {
  rowSeq += 1;
  return `kv-${Date.now()}-${rowSeq}`;
}

export function KeyValueEditor({ label, value, onChange, className }: KeyValueEditorProps) {
  const language = useLanguageStore((s) => s.language);
  const isFr = language === 'fr';
  const { position } = useListInsertPosition();
  const [rows, setRows] = useState<Row[]>(() => rowsFromRecord(value));

  useEffect(() => {
    setRows((prev) => {
      const nextKeys = Object.keys(value);
      const prevKeys = prev
        .map((r) => r.key.trim())
        .filter(Boolean)
        .sort()
        .join('\0');
      const incomingKeys = [...nextKeys].sort().join('\0');
      const prevRecord = recordFromRows(prev);
      const sameShape =
        prevKeys === incomingKeys &&
        nextKeys.every((k) => String(prevRecord[k]) === String(value[k]));
      if (sameShape) return prev;
      return rowsFromRecord(value);
    });
  }, [value]);

  const commit = (nextRows: Row[]) => {
    setRows(nextRows);
    onChange(recordFromRows(nextRows));
  };

  const updateRow = (id: string, patch: Partial<Pick<Row, 'key' | 'value'>>) => {
    commit(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const removeRow = (id: string) => {
    commit(rows.filter((row) => row.id !== id));
  };

  const addRow = () => {
    commit(insertIntoList(rows, { id: createRowId(), key: '', value: '' }, position));
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between gap-3">
        <Label className="text-foreground">{label}</Label>
        <div className="flex items-center gap-1.5">
          <ListInsertPositionToggle />
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus className="size-3.5" aria-hidden />
            {isFr ? 'Ajouter' : 'Add'}
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/70 bg-card/30 px-4 py-6 text-center text-sm text-muted-foreground">
          {isFr ? 'Aucune métrique.' : 'No metrics yet.'}
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row, index) => (
            <li
              key={row.id}
              className="grid grid-cols-[1fr_1fr_auto] items-center gap-2 rounded-xl border border-border/60 bg-card/50 p-2 shadow-xs"
            >
              <Input
                value={row.key}
                onChange={(e) => updateRow(row.id, { key: e.target.value })}
                placeholder={isFr ? 'Clé' : 'Key'}
                aria-label={isFr ? `Clé ${index + 1}` : `Key ${index + 1}`}
              />
              <Input
                value={row.value}
                onChange={(e) => updateRow(row.id, { value: e.target.value })}
                placeholder={isFr ? 'Valeur' : 'Value'}
                aria-label={isFr ? `Valeur ${index + 1}` : `Value ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeRow(row.id)}
                aria-label={isFr ? 'Supprimer' : 'Remove'}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
