import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';

export const ProjectSecurityInfraSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const security = isFr ? project.securityFr : project.securityEn;
  const infra = isFr ? project.infraFr : project.infraEn;
  const hasSecurity = security && security.length > 0;
  const hasInfra = infra && infra.length > 0;

  if (!hasSecurity && !hasInfra) return null;

  return (
    <ProjectSectionShell title={isFr ? 'Sécurité et infra' : 'Security and ops'} tone="ruled">
      <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
        {hasSecurity && (
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-4">
              {isFr ? 'Sécurité' : 'Security'}
            </h3>
            <ul className="space-y-0 divide-y divide-border/35 border-y border-border/35">
              {security!.map((item, idx) => (
                <li key={idx} className="py-3 text-sm text-muted-foreground leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasInfra && (
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-4">
              {isFr ? 'Infrastructure' : 'Infrastructure'}
            </h3>
            <ul className="space-y-3.5">
              {infra!.map((item, idx) => (
                <li key={idx} className="text-sm text-muted-foreground leading-relaxed">
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
