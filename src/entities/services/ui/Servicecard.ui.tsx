import { useEffect, useState } from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IServices } from '../model/service.types';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { AnimatedServicePrice } from './AnimatedServicePrice';
import { GlowingEffect } from '@/shared/ui/glowing-effect';
import { trackCtaClick } from '@/app/lib/analytics';

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

export const ServiceCard: React.FC<{ Service: IServices }> = ({ Service }) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation();
  const glowEnabled = useFinePointerGlow();

  const { titleFr, titleEn, descFr, descEn, featuresFr, featuresEn, priceEur, hourly } = Service;

  const title = language === 'fr' ? titleFr : titleEn;
  const contactTo = `/contact?service=${encodeURIComponent(title)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={glowEnabled ? { y: -3 } : undefined}
      className={cn(
        'group relative flex h-full w-full flex-col rounded-md p-0.5',
        'shadow-sm transition-all duration-500 hover:shadow-sm hover:shadow-primary/5',
      )}
    >
      <GlowingEffect
        spread={42}
        glow
        disabled={!glowEnabled}
        proximity={100}
        inactiveZone={0.35}
        borderWidth={1.5}
        movementDuration={1.4}
      />

      <div
        className={cn(
          'relative z-10 flex h-full flex-col rounded-[inherit] border border-border/40 bg-card/90 p-4 backdrop-blur-md md:p-5',
          'transition-colors duration-300',
          glowEnabled ? 'group-hover:border-transparent' : 'group-hover:border-primary/30',
        )}
      >
        <div className="mb-4 flex items-start gap-4">
          <h3 className="pt-0.5 text-sm leading-tight font-bold text-foreground transition-colors duration-300 group-hover:text-primary md:text-base">
            {title}
          </h3>
        </div>

        <p className="mb-4 line-clamp-3 min-h-[3.6em] text-[12px] leading-relaxed font-medium text-foreground/75 italic md:mb-5 md:text-xs">
          {language === 'fr' ? descFr : descEn}
        </p>

        <div className="mb-5 flex min-h-0 flex-1 flex-col justify-start gap-2.5 md:mb-6">
          {(language === 'fr' ? featuresFr : featuresEn)
            .slice(0, 4)
            .map((feature: string, i: number) => (
              <div key={i} className="group/item flex items-start gap-2.5">
                <HiOutlineCheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand transition-colors group-hover/item:text-brand-hover dark:text-primary" />
                <span className="line-clamp-2 text-[11px] leading-snug text-foreground/80 md:text-[12px]">
                  {feature}
                </span>
              </div>
            ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-border/40 pt-3">
          <div className="min-w-0 flex-1">
            <span className="mb-0.5 block whitespace-nowrap text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
              {language === 'fr' ? 'À partir de' : 'Starting at'}
            </span>
            <AnimatedServicePrice
              amountEur={priceEur}
              hourly={hourly}
              className="max-w-full truncate text-[12px] leading-none"
            />
          </div>

          <Link
            to={contactTo}
            onClick={() => trackCtaClick('service_quote', 'services_card', contactTo)}
            onMouseEnter={() => {
              void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
            }}
            onTouchStart={() => {
              void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
            }}
            className="group/link inline-flex shrink-0 items-center gap-0.5 pb-0.5 text-[11px] font-semibold whitespace-nowrap text-primary transition-colors"
          >
            {t('services.cta')}
            <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
