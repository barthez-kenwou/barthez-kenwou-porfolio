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
    <ProjectSectionShell title={isFr ? 'Liens utiles' : 'Useful links'}>
      <ul className="flex flex-wrap gap-2.5">
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
              className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-md border border-border/40 bg-card/40 text-foreground hover:border-primary/30 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-primary" />
              {isFr ? link.labelFr : link.labelEn}
            </a>
          </li>
        ))}
      </ul>
    </ProjectSectionShell>
  );
};
