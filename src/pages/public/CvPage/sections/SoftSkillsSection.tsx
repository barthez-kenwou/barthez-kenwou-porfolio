import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { HeartHandshake } from 'lucide-react';
import { ISkill } from '@/entities/skills';

interface SoftSkillsProps {
  softSkills: ISkill[];
}

export const SoftSkillsSection: React.FC<SoftSkillsProps> = ({ softSkills }) => {
  const { language } = useLanguageStore();

  if (!softSkills || softSkills.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-foreground sm:mb-4">
        <div className="rounded-md bg-primary/10 p-1.5">
          <HeartHandshake className="h-4 w-4 text-primary" />
        </div>
        {language === 'fr' ? 'Compétences Comportementales' : 'Soft Skills'}
      </h2>

      <div className="flex flex-wrap gap-1.5">
        {softSkills.map((skill) => (
          <div
            key={skill.name}
            className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground sm:text-sm"
          >
            {skill.name}
          </div>
        ))}
      </div>
    </section>
  );
};
