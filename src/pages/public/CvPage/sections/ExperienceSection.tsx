import { CVExperienceCard, IExperience } from '@/entities/experiences';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Briefcase } from 'lucide-react';
import React from 'react';

interface ExperienceProps {
  experiences: IExperience[];
}

export const ExperienceSection: React.FC<ExperienceProps> = ({ experiences }) => {
  const { language } = useLanguageStore();

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-foreground sm:mb-4">
        <div className="rounded-md bg-primary/10 p-1.5">
          <Briefcase className="h-4 w-4 text-primary" />
        </div>
        {language === 'fr' ? 'Expérience Professionnelle' : 'Professional Experience'}
      </h2>

      {/* Experience content */}
      <div className="space-y-6">
        {experiences.map((experience: IExperience, index: number) => (
          <CVExperienceCard key={index + experience.titleFr} Experience={experience} />
        ))}
      </div>
    </section>
  );
};
