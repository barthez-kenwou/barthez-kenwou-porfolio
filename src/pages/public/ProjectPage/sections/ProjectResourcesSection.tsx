import React, { useMemo } from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';
import { ExternalLink } from 'lucide-react';

export const ProjectResourcesSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  const resources = useMemo(() => {
    const list = [...(project.resources ?? [])];
    if (project.documentation?.trim()) {
      list.push({
        labelFr: 'Documentation',
        labelEn: 'Documentation',
        url: project.documentation,
        type: 'other' as const,
      });
    }
    if (project.caseStudy?.trim()) {
      list.push({
        labelFr: 'Étude de cas',
        labelEn: 'Case study',
        url: project.caseStudy,
        type: 'case-study' as const,
      });
    }
    return list;
  }, [project.resources, project.documentation, project.caseStudy]);

  if (resources.length === 0) return null;

  return (
    <ProjectSectionShell title={isFr ? 'Documents' : 'Documents'} tone="plain">
      <ul className="divide-y divide-border/40 border-y border-border/40">
        {resources.map((res, idx) => {
          const label = isFr ? res.labelFr : res.labelEn;
          return (
            <li key={`${res.url}-${idx}`}>
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 py-3.5 text-sm text-foreground/90 hover:text-foreground group"
              >
                <span className="min-w-0 truncate font-medium">{label}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </a>
            </li>
          );
        })}
      </ul>
    </ProjectSectionShell>
  );
};
