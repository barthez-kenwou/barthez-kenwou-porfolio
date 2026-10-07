import React, { useMemo } from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';
import { FileText, Presentation, BookOpen, ScrollText, ExternalLink } from 'lucide-react';

const ICONS = {
  spec: ScrollText,
  report: FileText,
  'case-study': BookOpen,
  slides: Presentation,
  other: FileText,
} as const;

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
    <ProjectSectionShell title={isFr ? 'Ressources' : 'Resources'}>
      <ul className="grid sm:grid-cols-2 gap-3">
        {resources.map((res, idx) => {
          const Icon = ICONS[res.type] ?? FileText;
          const label = isFr ? res.labelFr : res.labelEn;
          return (
            <li key={`${res.url}-${idx}`}>
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-md border border-border/40 bg-card/40 hover:border-primary/30 transition-colors group"
              >
                <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-foreground flex-1 min-w-0 truncate">
                  {label}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
              </a>
            </li>
          );
        })}
      </ul>
    </ProjectSectionShell>
  );
};
