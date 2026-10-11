import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';

export const ProjectTimelineSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const milestones = project.milestones ?? [];

  if (milestones.length === 0) return null;

  return (
    <ProjectSectionShell title={isFr ? 'Jalons' : 'Milestones'} tone="default">
      <ol className="space-y-0 divide-y divide-border/40 border-y border-border/40">
        {milestones.map((m, idx) => (
          <li key={idx} className="grid gap-1 py-4 sm:grid-cols-[6.5rem_1fr] sm:gap-6">
            <span className="text-[11px] tabular-nums text-muted-foreground pt-0.5">
              {m.date || '—'}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground">
                {isFr ? m.labelFr : m.labelEn}
              </h3>
              {(isFr ? m.descriptionFr : m.descriptionEn) && (
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  {isFr ? m.descriptionFr : m.descriptionEn}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </ProjectSectionShell>
  );
};
