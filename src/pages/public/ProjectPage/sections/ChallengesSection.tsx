import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Code2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { projectsData } from '@/entities/projets/api/mocks/projectData.mocks';
import { findByNumericId } from '@/shared/lib/entity-slug';

export const ChallengesSection: React.FC = () => {
  const { language } = useLanguageStore();

  const { id, projectID } = useParams();
  const project = findByNumericId(projectsData, projectID || id) || {
    challengesEn: [],
    challengesFr: [],
  };

  return (
    <div className="p-6 rounded-md bg-card border border-border">
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Code2 className="h-5 w-5 text-primary" />
        {language === 'fr' ? 'Défis' : 'Challenges'}
      </h3>
      <ul className="space-y-3">
        {(language === 'fr' ? project.challengesFr : project.challengesEn)?.map(
          (challenge: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-1">•</span>
              {challenge}
            </li>
          ),
        )}
      </ul>
    </div>
  );
};
