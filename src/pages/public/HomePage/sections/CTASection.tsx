import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { SpectrumButton } from '@/shared/ui/SpectrumButton';
import { BrandAmbientField } from '@/shared/ui/BrandAmbientField';

const CONTACT_FROM_HOME = '/contact?from=home';

export const CTASection: React.FC = () => {
  const { language } = useLanguageStore();
  const { t } = useTranslation();
  const isFr = language === 'fr';

  return (
    <section className="relative z-10 mb-8 px-4 md:mb-12 md:px-10 lg:px-14">
      <div className="relative z-10 overflow-hidden rounded-lg border border-border">
        <BrandAmbientField intensity="calm" />
        <div className="relative z-10 mx-auto w-full p-5 text-center sm:p-6 md:p-8">
          <div className="mx-auto max-w-xl rounded-md border border-border/50 bg-background/70 px-4 py-5 shadow-sm backdrop-blur-md dark:bg-background/55 sm:px-6 sm:py-6">
            <h2 className="mb-2 font-heading text-lg font-bold text-foreground sm:mb-3 sm:text-xl md:text-2xl">
              {isFr ? 'Prêt à démarrer votre projet ?' : 'Ready to start your project?'}
            </h2>

            <p className="mb-5 text-xs font-medium leading-relaxed text-foreground/75 sm:mb-6 sm:text-sm">
              {isFr
                ? 'Discutons de vos besoins et construisons une solution fiable, scalable et exploitable.'
                : 'Let us discuss your needs and build a reliable, scalable, production-ready solution.'}
            </p>

            <div className="flex flex-col items-center gap-3">
              <SpectrumButton asChild variant="solid" size="default">
                <Link
                  to={CONTACT_FROM_HOME}
                  onMouseEnter={() => {
                    void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                  }}
                  onTouchStart={() => {
                    void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                  }}
                >
                  {t('hero.cta.contact')}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </SpectrumButton>

              <Link
                to="/projects"
                onMouseEnter={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/projects'));
                }}
                onTouchStart={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/projects'));
                }}
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
