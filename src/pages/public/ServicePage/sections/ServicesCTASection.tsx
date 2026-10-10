import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { SpectrumButton } from '@/shared/ui/SpectrumButton';
import { BrandAmbientField } from '@/shared/ui/BrandAmbientField';
import { trackContactClick, trackCtaClick } from '@/app/lib/analytics';

const CONTACT_FROM_SERVICES = '/contact?from=services';

export const ServicesCTASection: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <section className="mb-0 px-4 md:px-10 lg:px-14">
      <div className="relative z-10 overflow-hidden rounded-lg border border-border">
        <BrandAmbientField intensity="calm" />
        <div className="relative z-10 mx-auto w-full p-2 text-center md:p-3">
          <div className="mx-auto max-w-xl rounded-md border border-border/50 bg-background/70 px-4 py-4 shadow-sm backdrop-blur-md dark:bg-background/55 sm:px-5 sm:py-5">
            <h2 className="mb-1.5 font-heading text-base font-bold text-foreground sm:text-lg md:text-xl">
              {isFr ? 'Un service adapté à votre besoin ?' : 'A service that fits your need?'}
            </h2>
            <p className="mb-4 mx-auto max-w-md text-[11px] font-medium leading-relaxed text-foreground/70 sm:text-xs">
              {isFr
                ? 'Cloud, DevOps ou full stack: décrivons le besoin et cadrons une proposition claire.'
                : 'Cloud, DevOps, or full stack: let us define the need and frame a clear proposal.'}
            </p>

            <div className="flex flex-col items-center gap-2.5">
              <SpectrumButton asChild variant="solid" size="default">
                <Link
                  to={CONTACT_FROM_SERVICES}
                  onClick={() => {
                    trackContactClick('services_cta');
                    trackCtaClick('contact', 'services_cta', CONTACT_FROM_SERVICES);
                  }}
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
                onClick={() => trackCtaClick('projects', 'services_cta', '/projects')}
                className="text-[12px] font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-primary hover:underline sm:text-[13px]"
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
