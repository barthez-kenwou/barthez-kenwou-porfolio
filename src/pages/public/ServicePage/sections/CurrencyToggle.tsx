import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { useServiceCurrencyStore } from '@/entities/services/model/useServiceCurrencyStore';

/**
 * Segmented EUR / FCFA control - large tap targets, both labels always visible.
 */
export function CurrencyToggle({ className }: { className?: string }) {
  const { language } = useLanguageStore();
  const isEuro = useServiceCurrencyStore((s) => s.isEuro);
  const setEuro = useServiceCurrencyStore((s) => s.setEuro);
  const isFr = language === 'fr';

  return (
    <div
      className={cn(
        'relative z-20 mb-4 flex justify-center px-4 sm:mb-5 sm:justify-end md:px-10 lg:px-14',
        className,
      )}
    >
      <div
        role="group"
        aria-label={isFr ? 'Devise des prix' : 'Price currency'}
        className={cn(
          'inline-flex items-center rounded-full border border-border/70 bg-secondary/60 p-1',
          'shadow-inner backdrop-blur-sm',
        )}
      >
        <button
          type="button"
          aria-pressed={!isEuro}
          onClick={() => setEuro(false)}
          className={cn(
            'min-h-9 min-w-[4.5rem] rounded-full px-3.5 text-[11px] font-bold tracking-wide transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
            !isEuro
              ? 'bg-background text-brand shadow-sm dark:text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          FCFA
        </button>
        <button
          type="button"
          aria-pressed={isEuro}
          onClick={() => setEuro(true)}
          className={cn(
            'min-h-9 min-w-[4.5rem] rounded-full px-3.5 text-[11px] font-bold tracking-wide transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
            isEuro
              ? 'bg-background text-brand shadow-sm dark:text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          EUR €
        </button>
      </div>
    </div>
  );
}
