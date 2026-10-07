import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { CheckCircle2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { projectsData } from '@/entities/projets/api/mocks/projectData.mocks';
import { findByNumericId } from '@/shared/lib/entity-slug';

export const SolutionSection: React.FC = () => {
  const { language } = useLanguageStore();
  const { id, projectID } = useParams();
  const project = findByNumericId(projectsData, projectID || id) || {
    solutionsFr: [],
    solutionsEn: [],
  };

  return (
    <div className="p-6 rounded-md bg-card border border-border">
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-primary" />
        {language === 'fr' ? 'Solutions' : 'Solutions'}
      </h3>
      <ul className="space-y-3">
        {(language === 'fr' ? project.solutionsFr : project.solutionsEn)?.map(
          (solution: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              {solution}
            </li>
          ),
        )}
      </ul>
    </div>
  );
};
