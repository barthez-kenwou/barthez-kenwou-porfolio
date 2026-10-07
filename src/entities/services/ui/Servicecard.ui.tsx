import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IServices } from '../model/service.types';
import { motion } from 'framer-motion';
import { GlowingEffect } from '@/shared/ui/glowing-effect';
import { cn } from '@/shared/lib/utils';
import { AnimatedServicePrice } from './AnimatedServicePrice';

export const ServiceCard: React.FC<{ Service: IServices }> = ({ Service }) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation();

  const { titleFr, titleEn, descFr, descEn, featuresFr, featuresEn, priceEur, hourly } = Service;

  const title = language === 'fr' ? titleFr : titleEn;
  const contactTo = `/contact?service=${encodeURIComponent(title)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative flex h-full w-full flex-col rounded-md p-0.5',
        'shadow-sm transition-all duration-500 hover:shadow-sm hover:shadow-primary/5',
      )}
    >
      <GlowingEffect
        spread={60}
        glow
        disabled={false}
        proximity={128}
        inactiveZone={0}
        borderWidth={2}
      />

      <div className="relative z-10 flex h-full flex-col rounded-[inherit] border border-border/40 bg-card/90 p-5 backdrop-blur-md transition-colors duration-300 group-hover:border-transparent md:p-6">
        <div className="mb-4 flex items-start gap-4">
          <h3 className="pt-0.5 text-sm leading-tight font-bold text-foreground transition-colors duration-300 group-hover:text-primary md:text-base">
            {title}
          </h3>
        </div>

        <p className="mb-5 text-[12px] leading-relaxed font-medium text-muted-foreground italic opacity-90 md:text-xs">
          {language === 'fr' ? descFr : descEn}
        </p>

        <div className="mb-6 flex-1 space-y-2.5">
          {(language === 'fr' ? featuresFr : featuresEn)
            .slice(0, 4)
            .map((feature: string, i: number) => (
              <div key={i} className="group/item flex items-start gap-2.5">
                <HiOutlineCheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70 transition-colors group-hover/item:text-primary" />
                <span className="text-[11px] leading-snug text-muted-foreground/90 md:text-[12px]">
                  {feature}
                </span>
              </div>
            ))}
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-border/40 pt-4">
          <div className="flex min-w-0 flex-col">
            <span className="mb-0.5 text-[10px] font-bold tracking-wider text-muted-foreground/60 uppercase">
              {language === 'fr' ? 'À partir de' : 'Starting at'}
            </span>
            <AnimatedServicePrice amountEur={priceEur} hourly={hourly} />
          </div>

          <Link
            to={contactTo}
            onMouseEnter={() => {
              void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
            }}
            onTouchStart={() => {
              void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
            }}
            className="group inline-flex shrink-0 items-center gap-0.5 text-[12px] font-semibold text-primary underline-offset-4 transition-colors hover:underline"
          >
            {t('services.cta')}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
