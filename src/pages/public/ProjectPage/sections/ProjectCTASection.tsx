import React from 'react';
import { ArrowRight, Github } from 'lucide-react';
import { contactsInfo } from '@/shared/mocks/constContactInfo.mocks';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { GradientDots } from '@/shared/ui/gradient-dots';
import { DualCtaButtons } from '@/shared/ui/DualCtaButtons';

const CONTACT_FROM_PROJECTS = '/contact?from=projects';

export const ProjectCTASection: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <section className="relative z-10 mb-4 overflow-hidden rounded-lg border border-primary/25 shadow-[0_0_40px_-16px_hsla(268,52%,38%,0.35)]">
      <div className="absolute inset-0 z-0">
        <GradientDots duration={20} colorCycleDuration={4} />
      </div>
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-background/20 via-transparent to-background/35" />

      <div className="relative z-10 mx-auto w-full p-5 text-center sm:p-6 md:p-8">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-md border border-border/40 bg-background/55 px-4 py-5 shadow-sm backdrop-blur-md dark:bg-background/50 sm:px-6 sm:py-6">
          <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary uppercase sm:text-[11px]">
            {isFr ? 'Prochaine étape' : 'Next step'}
          </p>

          <h2 className="mb-2 text-lg font-bold text-foreground sm:mb-3 sm:text-xl md:text-2xl">
            {isFr ? 'Ces réalisations vous parlent ?' : 'Do these case studies speak to you?'}
          </h2>

          <p className="mb-5 max-w-md text-xs leading-relaxed text-muted-foreground sm:mb-6 sm:text-sm">
            {isFr
              ? "Vous venez de parcourir le portfolio. Si une approche, une stack ou un niveau d'exigence résonne avec votre contexte, démarrons un échange concret."
              : 'You have just browsed the portfolio. If an approach, a stack, or a delivery standard resonates with your context, let us start a focused conversation.'}
          </p>

          <DualCtaButtons
            className="w-full sm:w-auto"
            primary={{
              label: isFr ? "Discuter d'un projet" : 'Discuss a project',
              to: CONTACT_FROM_PROJECTS,
              endIcon: (
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              ),
            }}
            secondary={{
              label: isFr ? 'Voir sur GitHub' : 'View on GitHub',
              to: contactsInfo.repository,
              external: true,
              icon: <Github className="h-4 w-4" />,
            }}
          />
        </div>
      </div>
    </section>
  );
};
