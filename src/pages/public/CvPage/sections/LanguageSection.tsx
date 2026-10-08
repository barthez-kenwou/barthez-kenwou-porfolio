import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Globe } from 'lucide-react';

interface LanguageProps {
  languages: { language: string; proficiencyFr: string; proficiencyEn: string }[];
}

export const LanguageSection: React.FC<LanguageProps> = ({ languages }) => {
  const { language } = useLanguageStore();

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-foreground sm:mb-4">
        <div className="rounded-md bg-primary/10 p-1.5">
          <Globe className="h-4 w-4 text-primary" />
        </div>
        {language === 'fr' ? 'Langues' : 'Languages'}
      </h2>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {languages.map((lang, index) => (
          <div
            key={index}
            className="rounded-md border border-border/40 bg-secondary/25 px-3 py-2 sm:px-3.5 sm:py-2.5"
          >
            <p className="text-xs font-semibold text-foreground sm:text-sm">{lang.language}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-foreground/70 sm:text-xs">
              {language === 'fr' ? lang.proficiencyFr : lang.proficiencyEn}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
