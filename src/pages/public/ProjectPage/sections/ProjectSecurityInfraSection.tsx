import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';
import { ShieldCheck, Server, CheckCircle2 } from 'lucide-react';

export const ProjectSecurityInfraSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const security = isFr ? project.securityFr : project.securityEn;
  const infra = isFr ? project.infraFr : project.infraEn;
  const hasSecurity = security && security.length > 0;
  const hasInfra = infra && infra.length > 0;

  if (!hasSecurity && !hasInfra) return null;

  return (
    <ProjectSectionShell title={isFr ? 'Sécurité & Infrastructure' : 'Security & Infrastructure'}>
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {hasSecurity && (
          <div className="rounded-md border border-border/40 bg-card/40 p-5 md:p-6">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="p-2 rounded-md bg-primary/10 text-primary">
                <ShieldCheck className="w-4 h-4" />
              </div>
              {isFr ? 'Sécurité' : 'Security'}
            </h3>
            <ul className="space-y-3">
              {security!.map((item, idx) => (
                <li
                  key={idx}
                  className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasInfra && (
          <div className="rounded-md border border-border/40 bg-card/40 p-5 md:p-6">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="p-2 rounded-md bg-secondary text-secondary-foreground">
                <Server className="w-4 h-4" />
              </div>
              {isFr ? 'Infrastructure & déploiement' : 'Infrastructure & deployment'}
            </h3>
            <ul className="space-y-3">
              {infra!.map((item, idx) => (
                <li
                  key={idx}
                  className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-secondary-foreground shrink-0 mt-0.5" />
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
