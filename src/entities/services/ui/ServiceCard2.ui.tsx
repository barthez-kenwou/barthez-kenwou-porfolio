import { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { ServiceCardProps } from '../model/service.types';
import { AnimatedServicePrice } from './AnimatedServicePrice';
import { GlowingEffect } from '@/shared/ui/glowing-effect';

function useFinePointerGlow() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setEnabled(mq.matches && !reduced.matches);
    sync();
    mq.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
    };
  }, []);

  return enabled;
}

export const ServiceCard2: React.FC<ServiceCardProps> = ({ service, language }) => {
  const isFr = language === 'fr';
  const glowEnabled = useFinePointerGlow();

  return (
    <div
      className={cn(
        'group relative flex w-full max-w-[400px] items-center gap-2.5 rounded-md p-0.5',
        'shadow-sm transition-all duration-500 hover:shadow-sm hover:shadow-primary/5',
      )}
    >
      <GlowingEffect
        spread={36}
        glow
        disabled={!glowEnabled}
        proximity={88}
        inactiveZone={0.4}
        borderWidth={1.25}
        movementDuration={1.35}
      />

      <div
        className={cn(
          'relative z-10 flex h-full w-full items-center gap-5 rounded-[inherit] px-2 py-2 backdrop-blur-md md:px-4 md:py-3',
          'border border-border/40 bg-card/90 transition-colors duration-300',
          glowEnabled ? 'group-hover:border-transparent' : 'group-hover:border-primary/30',
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-0.5 flex items-center justify-between gap-4">
            <h3 className="truncate text-sm font-bold text-foreground drop-shadow-sm transition-colors duration-300 group-hover:text-primary">
              {isFr ? service.titleFr : service.titleEn}
            </h3>
            <span className="shrink-0 rounded border border-brand/25 bg-brand/10 px-2 py-0.5 text-brand shadow-none dark:border-primary/25 dark:bg-primary/10 dark:text-primary">
              <AnimatedServicePrice amountEur={service.priceEur} hourly={service.hourly} compact />
            </span>
          </div>
          <p className="line-clamp-2 text-xs leading-relaxed text-foreground/75">
            {isFr ? service.descFr : service.descEn}
          </p>
        </div>
      </div>
    </div>
  );
};
