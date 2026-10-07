import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { contactsInfo } from '@/shared/mocks/constContactInfo.mocks';
import { GradientDots } from '@/shared/ui/gradient-dots';
import { DualCtaButtons } from '@/shared/ui/DualCtaButtons';

export const CTADetailsSection: React.FC = () => {
  const { language } = useLanguageStore();

  return (
    <section className="px-4 md:px-10 lg:px-14 mb-10 md:mb-12 text-center">
      <div className="relative z-10 overflow-hidden rounded-lg border border-primary/25 shadow-[0_0_40px_-16px_hsla(268,52%,38%,0.35)]">
        <div className="absolute inset-0 z-0">
          <GradientDots duration={20} colorCycleDuration={4} />
        </div>
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-background/20 via-transparent to-background/35" />

        <div className="relative z-10 w-full mx-auto text-center p-5 sm:p-6 md:p-8">
          <div className="mx-auto max-w-2xl rounded-md border border-border/40 bg-background/55 dark:bg-background/50 backdrop-blur-md px-4 py-5 sm:px-6 sm:py-6 shadow-sm flex flex-col items-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 leading-tight">
              {language === 'fr'
                ? 'Prêt à propulser votre prochain projet ?'
                : 'Ready to launch your next project?'}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed max-w-xl">
              {language === 'fr'
                ? "Si vous avez aimé ce projet et que vous souhaitez des résultats similaires pour votre entreprise, parlons-en dès aujourd'hui !"
                : "If you loved this project and want to achieve similar results for your business, let's talk today!"}
            </p>

            <DualCtaButtons
              primary={{
                label: language === 'fr' ? 'Me Contacter' : 'Contact Me',
                to: '/contact',
                endIcon: (
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                ),
              }}
              secondary={{
                label: 'WhatsApp',
                to: contactsInfo.whatsappLink,
                external: true,
                icon: <MessageCircle className="h-4 w-4" />,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
