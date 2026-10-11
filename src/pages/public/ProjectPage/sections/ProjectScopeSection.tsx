import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';

export const ProjectScopeSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const scope = isFr ? project.scopeFr : project.scopeEn;
  const nonGoals = isFr ? project.nonGoalsFr : project.nonGoalsEn;
  const hasScope = scope && scope.length > 0;
  const hasNonGoals = nonGoals && nonGoals.length > 0;

  if (!hasScope && !hasNonGoals) return null;

  return (
    <ProjectSectionShell title={isFr ? 'Périmètre' : 'Scope'} tone="plain">
      <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
        {hasScope && (
          <div className="border-l-2 border-primary/45 pl-4 md:pl-5">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-primary/80 mb-4">
              {isFr ? 'Inclus' : 'In scope'}
            </h3>
            <ul className="space-y-3">
              {scope!.map((item, idx) => (
                <li key={idx} className="text-sm text-muted-foreground leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasNonGoals && (
          <div className={hasScope ? undefined : 'border-l-2 border-border/50 pl-4 md:pl-5'}>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-4">
              {isFr ? 'Hors périmètre' : 'Out of scope'}
            </h3>
            <ul className="space-y-3">
              {nonGoals!.map((item, idx) => (
                <li
                  key={idx}
                  className="text-sm text-muted-foreground/75 leading-relaxed pl-3 border-l border-border/50"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ProjectSectionShell>
  );
};
