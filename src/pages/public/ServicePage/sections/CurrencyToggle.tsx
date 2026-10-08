import { AnimatePresence, motion } from 'motion/react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { useServiceCurrencyStore } from '@/entities/services/model/useServiceCurrencyStore';

/**
 * Compact EUR ↔ FCFA switch - ON = Euro (default), OFF = FCFA.
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
      <button
        type="button"
        role="switch"
        aria-checked={isEuro}
        aria-label={
          isFr
            ? isEuro
              ? 'Passer en FCFA'
              : 'Passer en Euro'
            : isEuro
              ? 'Switch to FCFA'
              : 'Switch to Euro'
        }
        onClick={() => setEuro(!isEuro)}
        className={cn(
          'group relative flex h-8 w-[7.25rem] cursor-pointer items-center rounded-full border p-0.5',
          'transition-[background-color,border-color,box-shadow] duration-500 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
          isEuro
            ? 'justify-end border-brand/35 bg-brand/10 shadow-none'
            : 'justify-start border-border bg-secondary shadow-inner',
        )}
      >
        <span
          className={cn(
            'pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-[8px] font-bold tracking-wider transition-opacity duration-300',
            isEuro ? 'opacity-0' : 'text-muted-foreground',
          )}
        >
          FCFA
        </span>
        <span
          className={cn(
            'pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[8px] font-bold tracking-wider transition-opacity duration-300',
            isEuro ? 'text-brand opacity-90 dark:text-primary' : 'opacity-0',
          )}
        >
          EUR
        </span>

        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 420, damping: 30, mass: 0.5 }}
          className={cn(
            'relative z-10 flex h-[26px] w-[3.35rem] items-center justify-center overflow-hidden rounded-full',
            'border border-border bg-background shadow-sm',
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-transparent dark:from-primary/25"
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isEuro ? 'eur' : 'xaf'}
              initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="relative text-[9px] font-black tracking-wide text-brand dark:text-primary"
            >
              {isEuro ? 'EUR €' : 'FCFA'}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </button>
    </div>
  );
}
