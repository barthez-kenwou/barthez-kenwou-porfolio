import { AnimatePresence, motion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';
import { cn } from '@/shared/lib/utils';
import { eurToXaf } from '../lib/currency';
import { useServiceCurrencyStore } from '../model/useServiceCurrencyStore';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

type AnimatedServicePriceProps = {
  amountEur: number;
  hourly?: boolean;
  className?: string;
  compact?: boolean;
};

function RollingAmount({ value, className }: { value: number; className?: string }) {
  const spring = useSpring(value, { stiffness: 140, damping: 24, mass: 0.55 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString('fr-FR'));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className={className}>{display}</motion.span>;
}

/**
 * Smooth currency morph for service prices (EUR ↔ FCFA).
 */
export function AnimatedServicePrice({
  amountEur,
  hourly = false,
  className,
  compact = false,
}: AnimatedServicePriceProps) {
  const isEuro = useServiceCurrencyStore((s) => s.isEuro);
  const currency = isEuro ? 'EUR' : 'XAF';
  const language = useLanguageStore((s) => s.language);
  const amount = isEuro ? amountEur : eurToXaf(amountEur);

  return (
    <span className={cn('relative inline-flex items-baseline gap-1 tabular-nums', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={currency}
          initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-baseline gap-1"
        >
          <RollingAmount
            value={amount}
            className={cn('font-bold text-primary', compact ? 'text-[10px]' : 'text-xs')}
          />
          <span
            className={cn(
              'font-bold text-primary',
              compact
                ? isEuro
                  ? 'text-[10px]'
                  : 'text-[9px] tracking-wide'
                : isEuro
                  ? 'text-xs'
                  : 'text-[10px] tracking-wide',
            )}
          >
            {isEuro ? '€' : 'FCFA'}
          </span>
          {hourly && (
            <span
              className={cn(
                'font-semibold text-primary/75',
                compact ? 'text-[9px]' : 'text-[10px]',
              )}
            >
              /h
            </span>
          )}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only">
        {language === 'fr'
          ? isEuro
            ? `${amountEur} euros${hourly ? ' par heure' : ''}`
            : `${amount} francs CFA${hourly ? ' par heure' : ''}`
          : isEuro
            ? `${amountEur} euros${hourly ? ' per hour' : ''}`
            : `${amount} CFA francs${hourly ? ' per hour' : ''}`}
      </span>
    </span>
  );
}
