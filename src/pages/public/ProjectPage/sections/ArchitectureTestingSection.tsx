import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

export const ArchitectureTestingSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const architecture = project.architecture;
  const testing = project.testing;

  if ((!architecture || architecture.length === 0) && (!testing || testing.length === 0)) {
    return null;
  }

  return (
    <section className="mb-14 md:mb-20 px-4 md:px-10 lg:px-14">
      <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
        {architecture && architecture.length > 0 && (
          <div>
            <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground tracking-tight mb-5">
              {isFr ? 'Architecture' : 'Architecture'}
            </h2>
            <ul className="space-y-0 divide-y divide-border/35 border-y border-border/35">
              {architecture.map((item, idx) => (
                <li key={idx} className="py-3 text-sm text-muted-foreground leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {testing && testing.length > 0 && (
          <div>
            <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground tracking-tight mb-5">
              {isFr ? 'Qualité' : 'Quality'}
            </h2>
            <ul className="space-y-3.5">
              {testing.map((item, idx) => (
                <li key={idx} className="text-sm text-muted-foreground leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
