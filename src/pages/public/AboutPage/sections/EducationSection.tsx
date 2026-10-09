import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React from 'react';
import { EducationCard, usePublicEducation } from '@/entities/education';
import { QueryState } from '@/shared/ui/QueryState';
import { AboutSectionIcon } from './AboutSectionIcon';

export const EducationSection: React.FC = () => {
  const { language } = useLanguageStore();
  const { data, isPending, isError, error } = usePublicEducation();
  const education = data?.data.items ?? [];

  return (
    <section className="glass rounded-md p-4 md:p-6 border border-border animate-fade-in">
      {/* title */}
      <div className="flex items-center gap-3 mb-6">
        <AboutSectionIcon variant="education" />
        <h3 className="cursor-default text-xl font-semibold text-foreground">
          {language === 'fr' ? 'Formation' : 'Education'}
        </h3>
      </div>

      {/* content */}
      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        source={data?.source}
        empty={!isPending && education.length === 0}
      >
        <div className="space-y-1.5">
          {education.map((edu, index) => (
            <EducationCard key={edu.id ?? index * 3} Education={edu} />
          ))}
        </div>
      </QueryState>
    </section>
  );
};
