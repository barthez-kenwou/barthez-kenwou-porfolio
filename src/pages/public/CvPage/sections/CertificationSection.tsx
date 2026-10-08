import { CVEducationCard, IEducation } from '@/entities/education';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { GraduationCap } from 'lucide-react';
import React from 'react';

interface CertificationProps {
  education: IEducation[];
}

export const CertificationSection: React.FC<CertificationProps> = ({ education }) => {
  const { language } = useLanguageStore();

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-foreground sm:mb-4">
        <div className="rounded-md bg-primary/10 p-1.5">
          <GraduationCap className="h-4 w-4 text-primary" />
        </div>
        {language === 'fr' ? 'Formation & Certifications' : 'Education & Certifications'}
      </h2>

      <div className="space-y-1.5 sm:space-y-3">
        {education.map((edu: IEducation, index: number) => (
          <CVEducationCard key={index} Education={edu} />
        ))}
      </div>
    </section>
  );
};
