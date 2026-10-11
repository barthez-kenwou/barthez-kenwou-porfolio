import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

export const ProblemSolutionSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const problem = isFr ? project.problemFr : project.problemEn;
  const solutions = isFr ? project.solutionFr : project.solutionEn;

  if (!problem && (!solutions || solutions.length === 0)) return null;

  return (
    <section className="mb-14 md:mb-20 px-4 md:px-10 lg:px-14">
      <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
        {problem && (
          <div className="min-w-0">
            <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground tracking-tight mb-4">
              {isFr ? 'Le contexte' : 'The brief'}
            </h2>
            <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
              {problem}
            </p>
          </div>
        )}

        {solutions && solutions.length > 0 && (
          <div className="min-w-0 md:border-l md:border-border/50 md:pl-10 lg:pl-12">
            <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground tracking-tight mb-4">
              {isFr ? 'Ce qui a été livré' : 'What shipped'}
            </h2>
            <ol className="space-y-3.5 list-none">
              {solutions.map((sol, idx) => (
                <li key={idx} className="flex gap-3 text-sm md:text-[15px] leading-relaxed">
                  <span className="mt-0.5 shrink-0 tabular-nums text-[11px] font-medium text-muted-foreground/80">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-muted-foreground">{sol}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
};
