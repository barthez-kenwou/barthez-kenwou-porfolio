import { cn } from '@/lib/utils';
import { ServiceCardProps } from '../model/service.types';
import { GlowingEffect } from '@/shared/ui/glowing-effect';
import { AnimatedServicePrice } from './AnimatedServicePrice';

export const ServiceCard2: React.FC<ServiceCardProps> = ({ service, language }) => {
  const isFr = language === 'fr';

  return (
    <div
      className={cn(
        'relative group flex items-center gap-2.5 p-0.5 rounded-md w-full max-w-[400px]',
        'shadow-sm transition-all duration-500 hover:shadow-sm hover:shadow-primary/5',
      )}
    >
      <GlowingEffect
        spread={60}
        glow={true}
        disabled={false}
        proximity={128}
        inactiveZone={0}
        borderWidth={2}
      />

      <div className="relative flex items-center gap-5 py-2 md:py-3 px-2 md:px-4 w-full h-full rounded-[inherit] bg-card/90 backdrop-blur-md border border-border/40 z-10 transition-colors duration-300 group-hover:border-transparent">
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4 mb-0.5">
            <h3 className="text-sm font-bold text-foreground truncate drop-shadow-sm transition-colors duration-300 group-hover:text-primary">
              {isFr ? service.titleFr : service.titleEn}
            </h3>
            <span className="shrink-0 text-primary px-2 py-0.5 rounded bg-primary/10 shadow-sm border border-primary/20">
              <AnimatedServicePrice amountEur={service.priceEur} hourly={service.hourly} compact />
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {isFr ? service.descFr : service.descEn}
          </p>
        </div>
      </div>
    </div>
  );
};
