import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { contactsInfo } from '@/shared/mocks/constContactInfo.mocks';
import { DualCtaButtons } from '@/shared/ui/DualCtaButtons';
import { AuroraRibbons } from '@/shared/ui/aurora-ribbons';

export const CTASection: React.FC = () => {
  const { language } = useLanguageStore();
  const { t } = useTranslation();

  return (
    <section className="px-4 md:px-10 lg:px-14 mb-8 md:mb-12">
      <div className="relative z-10 overflow-hidden rounded-lg border border-primary/25 shadow-[0_0_40px_-16px_hsla(268,52%,38%,0.35)]">
        <AuroraRibbons ribbonCount={6} />

        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-background/15 via-transparent to-background/30" />

        <div className="relative z-10 w-full mx-auto text-center p-5 sm:p-6 md:p-8">
          <div className="mx-auto max-w-xl rounded-md border border-border/40 bg-background/55 dark:bg-background/50 backdrop-blur-lg px-4 py-5 sm:px-6 sm:py-6 shadow-sm">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3">
              {language === 'fr'
                ? 'Prêt à Démarrer Votre Projet ?'
                : 'Ready to Start Your Project?'}
            </h2>

            <p className="text-muted-foreground mb-5 sm:mb-6 text-xs sm:text-sm font-medium leading-relaxed">
              {language === 'fr'
                ? 'Discutons de vos besoins et construisons ensemble une solution qui dépasse vos attentes.'
                : "Let's discuss your needs and build together a solution that exceeds your expectations."}
            </p>

            <DualCtaButtons
              primary={{
                label: t('hero.cta.contact'),
                to: '/contact',
                endIcon: (
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                ),
              }}
              secondary={{
                label: 'WhatsApp',
                to: contactsInfo.whatsappLink,
                external: true,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
