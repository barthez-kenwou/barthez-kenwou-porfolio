import { usePublicServices, mapServiceDtoToCard, ServiceCard2 } from '@/entities/services';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { QueryState } from '@/shared/ui/QueryState';
import { ArrowRight } from 'lucide-react';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedList } from '@/shared/ui/animated-list';

export const ServiceSection: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const { data, isPending, isError, error } = usePublicServices();

  const previewServices = useMemo(() => {
    const items = data?.data.items ?? [];
    return items.slice(0, 5).map(mapServiceDtoToCard);
  }, [data]);

  return (
    <section className="relative z-10 overflow-x-clip px-4 py-12 md:px-10 md:py-16 lg:px-14 lg:py-20">
      <div className="relative z-10 grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-20">
        {/* Stretches to the card column height, then spreads content top→bottom */}
        <div className="animate-fade-in mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-8 text-center lg:mx-0 lg:h-full lg:max-w-none lg:items-start lg:justify-between lg:py-8 lg:text-left">
          <div className="w-full space-y-4">
            <h2 className="section-title !text-center lg:!text-left">
              <span className="font-heading text-foreground">
                {isFr ? 'Mes Services' : 'My Services'}
              </span>
            </h2>

            <p className="section-subtitle !mx-auto !mb-0 !text-center lg:!mx-0 lg:!text-left">
              {isFr
                ? 'Ingénieur Cloud & DevOps, je vous aide à bâtir des infrastructures solides, sécurisées et hautement performantes.'
                : 'Cloud & DevOps Engineer, I help you build solid, secure, and highly performant infrastructures.'}
            </p>
          </div>

          <div className="flex w-full flex-wrap justify-center gap-2 lg:justify-start">
            {['AWS Architecture', 'DevOps CI/CD', 'Security Audit', 'Full Stack'].map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border bg-card px-3 py-1 font-mono text-[11px] font-medium tracking-wide text-foreground/80 uppercase"
              >
                {tag}
              </span>
            ))}
          </div>

          <div>
            <Link
              to="/services"
              onMouseEnter={() => {
                void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/services'));
              }}
              onTouchStart={() => {
                void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/services'));
              }}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors"
            >
              {isFr ? 'Explorer tous les services' : 'Explore all services'}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto flex h-[340px] w-full max-w-[450px] items-center overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] md:h-[400px] lg:ml-auto">
          <QueryState
            className="flex h-full w-full items-center justify-center"
            isPending={isPending}
            isError={isError}
            errorMessage={error instanceof Error ? error.message : undefined}
            source={data?.source}
            empty={!isPending && previewServices.length === 0}
          >
            <AnimatedList
              className="mx-auto w-full bg-transparent px-3 py-4 sm:px-4 sm:py-5"
              delay={2000}
              maxVisible={3}
              pauseOnHover
            >
              {previewServices.map((service, index) => (
                <ServiceCard2
                  key={service.id ?? index}
                  service={service}
                  language={language}
                />
              ))}
            </AnimatedList>
          </QueryState>
        </div>
      </div>
    </section>
  );
};
