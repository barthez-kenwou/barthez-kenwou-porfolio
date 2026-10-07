import { services } from '@/entities/services/api/mock/services.mocks';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { useThemeStore } from '@/shared/state/useThemeStore';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedList } from '@/shared/ui/animated-list';
import { ServiceCard2 } from '@/entities/services';
import { SpectrumButton } from '@/shared/ui/SpectrumButton';
import { cn } from '@/shared/lib';

const SERVICES_FLARE = '/images/services-flare.webp';

export const ServiceSection: React.FC = () => {
  const { language } = useLanguageStore();
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const isFr = language === 'fr';

  const previewServices = services.slice(0, 5);

  return (
    <section className="relative z-10 overflow-x-clip px-4 md:px-10 lg:px-14 py-8 md:py-8 lg:py-0">
      {/* Ambient flare - bottom-right, discreet (mirrors hero strategy) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className={cn(
            'absolute -right-[8%] -bottom-[12%] w-[72%] max-w-[520px]',
            'sm:-right-[6%] sm:-bottom-[10%] sm:w-[60%]',
            'md:-right-[4%] md:bottom-[-8%] md:w-[48%]',
            'lg:-right-[2%] lg:w-[42%] xl:w-[38%]',
          )}
        >
          <img
            src={SERVICES_FLARE}
            alt=""
            decoding="async"
            className={cn(
              'w-full h-auto select-none origin-bottom-right',
              'opacity-[0.38] dark:opacity-[0.55]',
              '[mask-image:linear-gradient(90deg,transparent_0%,black_22%,black_100%),linear-gradient(0deg,black_55%,transparent_100%)]',
              '[-webkit-mask-image:linear-gradient(90deg,transparent_0%,black_22%,black_100%),linear-gradient(0deg,black_55%,transparent_100%)]',
              '[mask-composite:intersect] [-webkit-mask-composite:source-in]',
            )}
            style={{
              mixBlendMode: isDark ? 'screen' : 'multiply',
              filter: isDark ? 'saturate(1.05)' : 'saturate(0.85) brightness(0.92) contrast(1.05)',
            }}
          />
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="flex flex-col items-start space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h2 className="section-title text-center md:!text-left">
              <span className="gradient-text">{isFr ? 'Mes Services' : 'My Services'}</span>
            </h2>

            <p className="section-subtitle text-center md:!text-left md:!mx-0 !mb-0">
              {isFr
                ? 'Ingénieur Cloud & DevOps, je vous aide à bâtir des infrastructures solides, sécurisées et hautement performantes.'
                : 'Cloud & DevOps Engineer, I help you build solid, secure, and highly performant infrastructures.'}
            </p>
          </div>

          <div className="w-full flex flex-wrap gap-3 justify-center md:justify-start">
            {['AWS Architecture', 'DevOps CI/CD', 'Security Audit', 'Full Stack'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1 rounded-full glass border-primary/30 text-xs font-semibold text-foreground/90 dark:text-violet-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mx-auto md:mx-0">
            <SpectrumButton asChild variant="solid" size="default">
              <Link to="/services">
                {isFr ? 'Explorer tous les services' : 'Explore all services'}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </SpectrumButton>
          </div>
        </div>

        <div className="relative h-[420px] md:h-[540px] w-full max-w-[450px] mx-auto lg:ml-auto overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]">
          <AnimatedList
            className="px-3 sm:px-4 py-6 sm:py-8 bg-transparent h-full"
            delay={1750}
            maxVisible={5}
            pauseOnHover
          >
            {previewServices.map((service, index) => (
              <ServiceCard2 key={index} service={service} language={language} />
            ))}
          </AnimatedList>
        </div>
      </div>
    </section>
  );
};
