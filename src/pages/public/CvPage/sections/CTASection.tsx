import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { BrandAmbientField } from '@/shared/ui/BrandAmbientField';
import { CvQuickActions } from './CvQuickActions';

type CTASectionProps = {
  onDownload: () => void;
  sectionRef?: React.Ref<HTMLElement>;
};

export const CTASection: React.FC<CTASectionProps> = ({ onDownload, sectionRef }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <section ref={sectionRef} className="relative mt-8 mb-0 px-0 print:hidden sm:mt-10">
      <div className="relative z-10 overflow-hidden rounded-lg border border-border">
        <BrandAmbientField intensity="soft" />
        <div className="relative z-10 mx-auto w-full p-2 text-center md:p-3">
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-md border border-border/50 bg-background/70 px-4 py-4 shadow-sm backdrop-blur-md dark:bg-background/55 sm:px-5 sm:py-5">
            <h2 className="mb-1.5 font-heading text-base font-bold text-foreground sm:text-lg md:text-xl">
              {isFr
                ? 'Un profil clair. Une prochaine étape simple.'
                : 'A clear profile. A simple next step.'}
            </h2>

            <p className="mb-4 max-w-md text-[11px] leading-relaxed text-foreground/70 sm:text-xs">
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
