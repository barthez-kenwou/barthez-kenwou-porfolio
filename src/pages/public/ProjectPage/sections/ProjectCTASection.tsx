import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { contactsInfo } from '@/shared/mocks/constContactInfo.mocks';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { GradientDots } from '@/shared/ui/gradient-dots';
import { SpectrumButton } from '@/shared/ui/SpectrumButton';

const CONTACT_FROM_PROJECTS = '/contact?from=projects';

export const ProjectCTASection: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <section className="relative z-10 mb-4 overflow-hidden rounded-lg border border-primary/25 shadow-[0_0_40px_-16px_hsla(268,52%,38%,0.35)]">
      <div className="absolute inset-0 z-0">
        <GradientDots duration={20} colorCycleDuration={4} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/20 via-transparent to-background/35" />

      <div className="relative z-10 mx-auto w-full p-5 text-center sm:p-6 md:p-8">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-md border border-border/40 bg-background/55 px-4 py-5 shadow-sm backdrop-blur-md dark:bg-background/50 sm:px-6 sm:py-6">
          <h2 className="mb-2 text-lg font-bold text-foreground sm:mb-3 sm:text-xl md:text-2xl">
            {isFr ? 'Ces réalisations vous parlent ?' : 'Do these case studies speak to you?'}
          </h2>

          <p className="mb-5 max-w-md text-xs leading-relaxed text-muted-foreground sm:mb-6 sm:text-sm">
            {isFr
              ? "Si une approche, une stack ou un niveau d'exigence résonne avec votre contexte, démarrons un échange concret."
              : 'If an approach, a stack, or a delivery standard resonates with your context, let us start a focused conversation.'}
          </p>

          <div className="flex flex-col items-center gap-3">
            <SpectrumButton asChild variant="solid" size="default">
              <Link
                to={CONTACT_FROM_PROJECTS}
                onMouseEnter={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                }}
                onTouchStart={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                }}
              >
                {isFr ? "Discuter d'un projet" : 'Discuss a project'}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </SpectrumButton>

            <a
              href={contactsInfo.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline sm:text-[13px]"
            >
              {isFr ? 'Ou explorer sur GitHub' : 'Or explore on GitHub'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
