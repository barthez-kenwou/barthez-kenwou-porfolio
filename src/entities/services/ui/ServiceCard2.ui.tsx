import { cn } from '@/lib/utils';
import { ServiceCardProps } from '../model/service.types';
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

      <div className="relative flex items-center gap-5 py-2 md:py-3 px-2 md:px-4 w-full h-full rounded-[inherit] bg-card/90 backdrop-blur-md border border-border/40 z-10 transition-colors duration-300 group-hover:border-primary/30">
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4 mb-0.5">
            <h3 className="text-sm font-bold text-foreground truncate drop-shadow-sm transition-colors duration-300 group-hover:text-primary">
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
