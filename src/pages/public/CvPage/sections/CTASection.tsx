import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { GradientDots } from '@/shared/ui/gradient-dots';
import { CvQuickActions } from './CvQuickActions';

type CTASectionProps = {
  onDownload: () => void;
  sectionRef?: React.Ref<HTMLElement>;
};

export const CTASection: React.FC<CTASectionProps> = ({ onDownload, sectionRef }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <section ref={sectionRef} className="relative mt-8 px-0 print:hidden sm:mt-10">
      <div className="relative z-10 overflow-hidden rounded-lg border border-primary/25 shadow-[0_0_40px_-16px_hsla(268,52%,38%,0.35)]">
        <div className="absolute inset-0 z-0">
          <GradientDots duration={20} colorCycleDuration={4} />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/20 via-transparent to-background/35" />

        <div className="relative z-10 mx-auto w-full p-4 text-center sm:p-6 md:p-8">
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-md border border-border/40 bg-background/55 px-4 py-5 shadow-sm backdrop-blur-md dark:bg-background/50 sm:px-6 sm:py-6">
            <h2 className="mb-2 text-lg font-bold leading-tight text-foreground sm:mb-3 sm:text-xl md:text-2xl">
              {isFr
                ? 'Un profil clair. Une prochaine étape simple.'
                : 'A clear profile. A simple next step.'}
            </h2>

            <p className="mb-5 max-w-md text-xs leading-relaxed text-muted-foreground sm:mb-6 sm:text-sm">
              {isFr
                ? 'Téléchargez le CV pour le partager en interne, ou démarrons directement la conversation sur votre besoin.'
                : 'Download the CV to share internally, or let us start the conversation about your need right away.'}
            </p>

            <CvQuickActions variant="footer" onDownload={onDownload} />
          </div>
        </div>
      </div>
    </section>
  );
};
