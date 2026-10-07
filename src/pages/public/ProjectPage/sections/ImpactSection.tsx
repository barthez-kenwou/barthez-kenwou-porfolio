import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Trophy, Activity, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';

export const ImpactSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();

  const impacts = language === 'fr' ? project.impactFr : project.impactEn;
  const challenges = language === 'fr' ? project.challengesFr : project.challengesEn;
  const metrics = project.metrics;

  const hasImpacts = impacts && impacts.length > 0;
  const hasChallenges = challenges && challenges.length > 0;
  const hasMetrics = metrics && Object.keys(metrics).length > 0;

  if (!hasImpacts && !hasChallenges && !hasMetrics) return null;

  const impactIcons = [Trophy, TrendingUp, Activity];

  return (
    <section className="mb-16 px-4 md:px-10 lg:px-14 animate-fade-in-up space-y-12">
      <div className="grid lg:grid-cols-2 gap-8 md:gap-10">
        {hasChallenges && (
          <div>
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight !mb-0">
                {language === 'fr' ? 'Défis Rencontrés' : 'Challenges Faced'}
              </h2>
              <div className="h-px flex-grow bg-border/50" />
            </div>
            <div className="space-y-2.5">
              {challenges!.map((challenge, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 p-3.5 md:p-4 rounded-md bg-card/50 border border-border/40 hover:border-primary/25 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 text-primary/80 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{challenge}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasImpacts && (
          <div>
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight !mb-0">
                {language === 'fr' ? 'Impact & Résultats' : 'Impact & Results'}
              </h2>
              <div className="h-px flex-grow bg-border/50" />
            </div>
            <div className="space-y-2.5">
              {impacts!.map((impact, idx) => {
                const Icon = impactIcons[idx % impactIcons.length];
                return (
                  <div
                    key={idx}
                    className="flex gap-3 p-3.5 md:p-4 rounded-md bg-primary/5 border border-primary/15 hover:border-primary/30 transition-colors"
                  >
                    <div className="shrink-0 mt-0.5 p-1 bg-primary/10 rounded-full">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{impact}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {hasMetrics && (
        <div className="rounded-md border border-border/40 bg-secondary/20 p-5 md:p-7">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight !mb-0 text-center">
              {language === 'fr' ? 'Métriques Clés' : 'Key Metrics'}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {Object.entries(metrics!).map(([key, value], idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center text-center rounded-md bg-card/40 border border-border/30 px-3 py-4 min-w-0"
              >
                <span className="text-sm md:text-base lg:text-lg font-bold text-primary leading-snug break-words mb-1.5">
                  {value}
                </span>
                <span className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide leading-tight">
                  {key}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
