import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';

export const ProjectLessonsSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const lessons = isFr ? project.lessonsFr : project.lessonsEn;

  if (!lessons || lessons.length === 0) return null;

  return (
    <ProjectSectionShell title={isFr ? 'Ce que j’en retiens' : 'Takeaways'} tone="plain">
      <ol className="space-y-4 list-none">
        {lessons.map((lesson, idx) => (
          <li key={idx} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
            <span className="mt-0.5 shrink-0 tabular-nums text-[11px] font-medium text-muted-foreground/80">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <span>{lesson}</span>
          </li>
        ))}
      </ol>
    </ProjectSectionShell>
  );
};
