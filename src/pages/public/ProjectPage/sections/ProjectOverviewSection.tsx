import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

export const ProjectOverviewSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const fullDescription = isFr ? project.fullDescriptionFr : project.fullDescriptionEn;
  const businessContext = isFr ? project.businessContextFr : project.businessContextEn;
  const responsibilities = isFr ? project.responsibilitiesFr : project.responsibilitiesEn;

  const facts: { label: string; value: string }[] = [
    { label: isFr ? 'Durée' : 'Duration', value: project.duration },
    { label: isFr ? 'Période' : 'Period', value: project.date },
    ...(project.teamSize
      ? [
          {
            label: isFr ? 'Équipe' : 'Team',
            value: isFr
              ? `${project.teamSize} personne${project.teamSize > 1 ? 's' : ''}`
              : `${project.teamSize} ${project.teamSize > 1 ? 'people' : 'person'}`,
          },
        ]
      : []),
    { label: isFr ? 'Complexité' : 'Complexity', value: project.complexity },
    { label: isFr ? 'Rôle' : 'Role', value: project.role },
  ];

  return (
    <section className="mb-14 md:mb-20 px-4 md:px-10 lg:px-14">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28 self-start">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground mb-4">
            {isFr ? 'Fiche' : 'Facts'}
          </p>
          <dl className="space-y-0 divide-y divide-border/40 border-y border-border/40">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-xs text-muted-foreground shrink-0">{fact.label}</dt>
                <dd className="text-xs font-medium text-foreground text-right leading-snug">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className="lg:col-span-8 xl:col-span-9 space-y-9 min-w-0">
          {fullDescription && (
            <div>
              <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground tracking-tight mb-4">
                {isFr ? 'Vue d’ensemble' : 'Overview'}
              </h2>
              <div className="text-muted-foreground leading-relaxed text-sm md:text-[15px] whitespace-pre-line">
                {fullDescription}
              </div>
            </div>
          )}

          {businessContext && (
            <div className="border-l-2 border-primary/45 pl-4 md:pl-5">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary/80 mb-2">
                {isFr ? 'Contexte' : 'Context'}
              </h3>
              <p className="text-sm md:text-[15px] text-foreground/85 leading-relaxed">
                {businessContext}
              </p>
            </div>
          )}

          {(responsibilities ?? []).length > 0 && (
            <div>
              <h3 className="font-heading text-base md:text-lg font-semibold text-foreground tracking-tight mb-3">
                {isFr ? 'Mon rôle' : 'My role'}
              </h3>
              <ul className="space-y-0 divide-y divide-border/35 border-y border-border/35">
                {responsibilities!.map((item, idx) => (
                  <li key={idx} className="py-3 text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
