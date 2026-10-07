import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { SpectrumButton } from '@/shared/ui/SpectrumButton';
import { AuroraRibbons } from '@/shared/ui/aurora-ribbons';

const CONTACT_FROM_SERVICES = '/contact?from=services';

export const ServicesCTASection: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <section className="mb-8 px-4 md:mb-12 md:px-10 lg:px-14">
      <div className="relative z-10 overflow-hidden rounded-lg border border-primary/25 shadow-[0_0_40px_-16px_hsla(268,52%,38%,0.35)]">
        <AuroraRibbons ribbonCount={6} />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/15 via-transparent to-background/30" />

        <div className="relative z-10 mx-auto w-full p-5 text-center sm:p-6 md:p-8">
          <div className="mx-auto max-w-xl rounded-md border border-border/40 bg-background/55 px-4 py-5 shadow-sm backdrop-blur-lg dark:bg-background/50 sm:px-6 sm:py-6">
            <h2 className="mb-2 text-lg font-bold text-foreground sm:mb-3 sm:text-xl md:text-2xl">
              {isFr ? 'Un service adapté à votre besoin ?' : 'A service that fits your need?'}
            </h2>
            <p className="mb-5 text-xs font-medium leading-relaxed text-muted-foreground sm:mb-6 sm:text-sm">
              {isFr
                ? 'Cloud, DevOps ou full stack: décrivons le besoin et cadrons une proposition claire.'
                : 'Cloud, DevOps, or full stack: let us define the need and frame a clear proposal.'}
            </p>

            <div className="flex flex-col items-center gap-3">
              <SpectrumButton asChild variant="solid" size="default">
                <Link
                  to={CONTACT_FROM_SERVICES}
                  onMouseEnter={() => {
                    void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                  }}
                  onTouchStart={() => {
                    void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                  }}
                >
                  {isFr ? 'Demander un devis' : 'Get a quote'}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </SpectrumButton>

              <Link
                to="/projects"
                className="text-[12px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline sm:text-[13px]"
              >
                {isFr ? 'Ou voir les réalisations' : 'Or view the case studies'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
