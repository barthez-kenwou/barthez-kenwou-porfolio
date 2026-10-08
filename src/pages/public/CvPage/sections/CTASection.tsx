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
    <section ref={sectionRef} className="relative mt-8 px-0 print:hidden sm:mt-10">
      <div className="relative z-10 overflow-hidden rounded-lg border border-border">
        <BrandAmbientField intensity="soft" />
        <div className="relative z-10 mx-auto w-full p-4 text-center sm:p-6 md:p-8">
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-md border border-border/50 bg-background/70 px-4 py-5 shadow-sm backdrop-blur-md dark:bg-background/55 sm:px-6 sm:py-6">
            <h2 className="mb-2 font-heading text-lg font-bold leading-tight text-foreground sm:mb-3 sm:text-xl md:text-2xl">
              {isFr
                ? 'Un profil clair. Une prochaine étape simple.'
                : 'A clear profile. A simple next step.'}
            </h2>

            <p className="mb-5 max-w-md text-xs leading-relaxed text-foreground/75 sm:mb-6 sm:text-sm">
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
