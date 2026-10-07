import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';
import { GitBranch } from 'lucide-react';

export const ProjectDecisionsSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const decisions = project.decisions ?? [];

  if (decisions.length === 0) return null;

  return (
    <ProjectSectionShell title={isFr ? 'Décisions clés' : 'Key decisions'}>
      <div className="space-y-3">
        {decisions.map((d, idx) => (
          <article key={idx} className="rounded-md border border-border/40 bg-card/40 p-4 md:p-5">
            <div className="flex items-start gap-3 mb-2">
              <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0 mt-0.5">
                <GitBranch className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground">
                  {isFr ? d.titleFr : d.titleEn}
                </h3>
                <p className="text-sm text-primary/90 mt-1 leading-relaxed">
                  {isFr ? d.decisionFr : d.decisionEn}
                </p>
                {(isFr ? d.rationaleFr : d.rationaleEn) && (
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {isFr ? d.rationaleFr : d.rationaleEn}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </ProjectSectionShell>
  );
};
