import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

export const ImpactSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  const impacts = isFr ? project.impactFr : project.impactEn;
  const challenges = isFr ? project.challengesFr : project.challengesEn;
  const metrics = project.metrics;

  const hasImpacts = impacts && impacts.length > 0;
  const hasChallenges = challenges && challenges.length > 0;
  const hasMetrics = metrics && Object.keys(metrics).length > 0;

  if (!hasImpacts && !hasChallenges && !hasMetrics) return null;

  return (
    <section className="mb-14 md:mb-20 px-4 md:px-10 lg:px-14 space-y-12 md:space-y-14">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        {hasChallenges && (
          <div>
            <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground tracking-tight mb-5">
              {isFr ? 'Points de friction' : 'Friction'}
            </h2>
            <ul className="space-y-0 divide-y divide-border/35 border-y border-border/35">
              {challenges!.map((challenge, idx) => (
                <li key={idx} className="py-3.5 text-sm text-muted-foreground leading-relaxed">
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasImpacts && (
          <div>
            <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground tracking-tight mb-5">
              {isFr ? 'Résultats' : 'Outcomes'}
            </h2>
            <ul className="space-y-3.5">
              {impacts!.map((impact, idx) => (
                <li key={idx} className="text-sm text-muted-foreground leading-relaxed">
                  {impact}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {hasMetrics && (
        <div className="border-t border-border/50 pt-8 md:pt-10">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary/80 mb-6">
            {isFr ? 'Indicateurs' : 'Metrics'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6">
            {Object.entries(metrics!).map(([key, value]) => (
              <div key={key} className="min-w-0">
                <p className="text-sm md:text-base font-semibold text-foreground leading-snug break-words mb-1">
                  {value}
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight">{key}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
