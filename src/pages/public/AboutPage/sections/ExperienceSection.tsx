import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React from 'react';
import { usePublicExperiences } from '@/entities/experiences/hooks/useExperiences';
import { ExperienceCard } from '@/entities/experiences/ui/ExperienceCard.ui';
import { QueryState } from '@/shared/ui/QueryState';
import { AboutSectionIcon } from './AboutSectionIcon';

export const ExperienceSection: React.FC = () => {
  const { language } = useLanguageStore();
  const { data, isPending, isError, error } = usePublicExperiences();
  const experiences = data?.data.items ?? [];

  return (
    <section className="glass rounded-md p-4 md:p-6 border border-border animate-fade-in">
      {/* title */}
      <div className="flex items-center gap-3 mb-6">
        <AboutSectionIcon variant="experience" />
        <h3 className="text-xl font-semibold text-foreground">
          {language === 'fr' ? 'Expérience Professionnelle' : 'Professional Experience'}
        </h3>
      </div>

      {/* content */}
      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        source={data?.source}
        empty={!isPending && experiences.length === 0}
      >
        <div className="space-y-5">
          {experiences.map((exp, index) => (
            <ExperienceCard key={exp.id ?? index * 99} Experience={exp} />
          ))}
        </div>
      </QueryState>
    </section>
  );
};
