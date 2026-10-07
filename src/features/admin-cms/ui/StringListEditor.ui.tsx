import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';

export type StringListEditorProps = {
  label?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  bilingual?: never;
  className?: string;
  hideLabel?: boolean;
};

export function StringListEditor({
  label,
  values,
  onChange,
  placeholder,
  className,
  hideLabel = false,
}: StringListEditorProps) {
  const language = useLanguageStore((s) => s.language);
  const isFr = language === 'fr';

  const updateAt = (index: number, next: string) => {
    onChange(values.map((value, i) => (i === index ? next : value)));
  };

  const removeAt = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item!);
    onChange(next);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div
        className={cn(
          'flex items-center gap-3',
          hideLabel || !label ? 'justify-end' : 'justify-between',
        )}
      >
        {!hideLabel && label ? <Label className="text-foreground">{label}</Label> : null}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...values, ''])}>
          <Plus className="size-3.5" aria-hidden />
          {isFr ? 'Ajouter' : 'Add'}
        </Button>
      </div>

      {values.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/70 bg-card/30 px-4 py-6 text-center text-sm text-muted-foreground">
          {isFr ? 'Aucun élément.' : 'No items yet.'}
        </p>
      ) : (
        <ul className="space-y-2">
          {values.map((value, index) => (
            <li
              key={index}
              className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-card/50 p-1.5 shadow-xs"
            >
              <Input
                value={value}
                onChange={(e) => updateAt(index, e.target.value)}
                placeholder={placeholder}
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                aria-label={
                  label
                    ? `${label} ${index + 1}`
                    : isFr
                      ? `Élément ${index + 1}`
                      : `Item ${index + 1}`
                }
              />
              <div className="flex shrink-0 items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  aria-label={isFr ? 'Monter' : 'Move up'}
                >
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={index === values.length - 1}
                  onClick={() => move(index, 1)}
                  aria-label={isFr ? 'Descendre' : 'Move down'}
                >
                  <ArrowDown className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeAt(index)}
                  aria-label={isFr ? 'Supprimer' : 'Remove'}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
