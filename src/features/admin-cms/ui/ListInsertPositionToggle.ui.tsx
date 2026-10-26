import { ArrowDownToLine, ArrowUpToLine } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { useListInsertPosition } from '../hooks/useListInsertPosition';
import type { ListInsertPosition } from '../lib/listInsertPosition';

export type ListInsertPositionToggleProps = {
  className?: string;
  /** Controlled override — defaults to the shared CMS preference */
  value?: ListInsertPosition;
  onChange?: (value: ListInsertPosition) => void;
};

/**
 * Compact control next to “Add”: choose whether new rows prepend or append.
 */
export function ListInsertPositionToggle({
  className,
  value,
  onChange,
}: ListInsertPositionToggleProps) {
  const language = useLanguageStore((s) => s.language);
  const isFr = language === 'fr';
  const shared = useListInsertPosition();
  const position = value ?? shared.position;

  const setPosition = (next: ListInsertPosition) => {
    if (onChange) onChange(next);
    else shared.setPosition(next);
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border border-border/60 bg-muted/20 p-0.5',
        className,
      )}
      role="group"
      aria-label={isFr ? 'Position d’insertion des nouveaux éléments' : 'New item insert position'}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn(
          'size-7 rounded-sm',
          position === 'start' && 'bg-background text-foreground shadow-xs',
        )}
        aria-pressed={position === 'start'}
        aria-label={isFr ? 'Ajouter en haut de la liste' : 'Add at the top of the list'}
        title={isFr ? 'Nouveaux éléments en haut' : 'New items at the top'}
        onClick={() => setPosition('start')}
      >
        <ArrowUpToLine className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn(
          'size-7 rounded-sm',
          position === 'end' && 'bg-background text-foreground shadow-xs',
        )}
        aria-pressed={position === 'end'}
        aria-label={isFr ? 'Ajouter en bas de la liste' : 'Add at the bottom of the list'}
        title={isFr ? 'Nouveaux éléments en bas' : 'New items at the bottom'}
        onClick={() => setPosition('end')}
      >
        <ArrowDownToLine className="size-3.5" />
      </Button>
    </div>
  );
}
