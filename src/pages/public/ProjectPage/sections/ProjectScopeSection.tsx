import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';
import { Check, Ban } from 'lucide-react';

export const ProjectScopeSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const scope = isFr ? project.scopeFr : project.scopeEn;
  const nonGoals = isFr ? project.nonGoalsFr : project.nonGoalsEn;
  const hasScope = scope && scope.length > 0;
  const hasNonGoals = nonGoals && nonGoals.length > 0;

  if (!hasScope && !hasNonGoals) return null;

  return (
    <ProjectSectionShell title={isFr ? 'Périmètre' : 'Scope'}>
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {hasScope && (
          <div className="rounded-md border border-border/40 bg-card/40 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              {isFr ? 'Inclus' : 'In scope'}
            </h3>
            <ul className="space-y-2.5">
              {scope!.map((item, idx) => (
                <li
                  key={idx}
                  className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed"
                >
                  <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasNonGoals && (
          <div className="rounded-md border border-border/40 bg-card/40 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Ban className="w-4 h-4 text-muted-foreground" />
              {isFr ? 'Hors périmètre' : 'Out of scope'}
            </h3>
            <ul className="space-y-2.5">
              {nonGoals!.map((item, idx) => (
                <li
                  key={idx}
                  className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed"
                >
                  <Ban className="w-3.5 h-3.5 text-muted-foreground/70 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ProjectSectionShell>
  );
};
