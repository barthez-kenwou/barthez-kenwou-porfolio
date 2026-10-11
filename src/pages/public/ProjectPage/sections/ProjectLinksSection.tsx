import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';
import { ExternalLink } from 'lucide-react';

export const ProjectLinksSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const links = project.externalLinks ?? [];

  if (links.length === 0) return null;

  return (
    <ProjectSectionShell title={isFr ? 'Liens' : 'Links'} tone="quiet">
      <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
        {links.map((link, idx) => (
          <li key={`${link.url}-${idx}`}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                void import('@/app/lib/analytics').then((m) =>
                  m.trackOutboundClick(link.url, isFr ? link.labelFr : link.labelEn),
                );
              }}
              className="inline-flex items-center gap-1.5 text-sm text-foreground/85 underline-offset-4 hover:underline"
            >
              {isFr ? link.labelFr : link.labelEn}
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </a>
          </li>
        ))}
      </ul>
    </ProjectSectionShell>
  );
};
