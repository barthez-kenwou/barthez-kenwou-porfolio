import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';
import { Lightbulb } from 'lucide-react';

export const ProjectLessonsSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const lessons = isFr ? project.lessonsFr : project.lessonsEn;

  if (!lessons || lessons.length === 0) return null;

  return (
    <ProjectSectionShell title={isFr ? 'Leçons apprises' : 'Lessons learned'}>
      <ul className="space-y-2.5">
        {lessons.map((lesson, idx) => (
          <li
            key={idx}
            className="flex gap-3 p-3.5 md:p-4 rounded-md bg-card/50 border border-border/40"
          >
            <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">{lesson}</p>
          </li>
        ))}
      </ul>
    </ProjectSectionShell>
  );
};
