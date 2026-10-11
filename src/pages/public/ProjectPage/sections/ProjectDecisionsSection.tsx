import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';

export const ProjectDecisionsSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const decisions = project.decisions ?? [];

  if (decisions.length === 0) return null;

  return (
    <ProjectSectionShell title={isFr ? 'Arbitrages' : 'Trade-offs'} tone="ruled">
      <div className="divide-y divide-border/40 border-y border-border/40">
        {decisions.map((d, idx) => (
          <article key={idx} className="grid gap-1 py-5 sm:grid-cols-[auto_1fr] sm:gap-x-5">
            <span className="tabular-nums text-[11px] font-medium text-muted-foreground/80 pt-1">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground mb-1.5">
                {isFr ? d.titleFr : d.titleEn}
              </h3>
              <p className="text-sm text-foreground/85 leading-relaxed">
                {isFr ? d.decisionFr : d.decisionEn}
              </p>
              {(isFr ? d.rationaleFr : d.rationaleEn) && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {isFr ? d.rationaleFr : d.rationaleEn}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </ProjectSectionShell>
  );
};
