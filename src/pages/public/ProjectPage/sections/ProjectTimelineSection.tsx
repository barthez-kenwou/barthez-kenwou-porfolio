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
    <ProjectSectionShell title={isFr ? 'Timeline' : 'Timeline'}>
      <ol className="relative border-l border-border/50 ml-2 space-y-6 pl-6">
        {milestones.map((m, idx) => (
          <li key={idx} className="relative">
            <span className="absolute -left-[1.9rem] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
            <div className="flex flex-wrap items-baseline gap-2 mb-1">
              <h3 className="text-sm font-semibold text-foreground">
                {isFr ? m.labelFr : m.labelEn}
              </h3>
              {m.date && (
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {m.date}
                </span>
              )}
            </div>
            {(isFr ? m.descriptionFr : m.descriptionEn) && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isFr ? m.descriptionFr : m.descriptionEn}
              </p>
            )}
          </li>
        ))}
      </ol>
    </ProjectSectionShell>
  );
};
