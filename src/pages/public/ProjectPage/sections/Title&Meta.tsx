import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Calendar, Clock, ExternalLink, Github } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { projectsData } from '@/entities/projets/api/mocks/projectData.mocks';
import { findByNumericId } from '@/shared/lib/entity-slug';

export const TitleMeta: React.FC = () => {
  const { language } = useLanguageStore();
  const { id, projectID } = useParams();

  const projectDef = {
    titleFr: '',
    titleEn: '',
    date: '',
    duration: '',
    techStack: { frontend: [], backend: [], database: [], devops: [] },
    github: '',
    demo: '',
  };
  const project = findByNumericId(projectsData, projectID || id) || projectDef;

  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        {language === 'fr' ? project.titleFr : project.titleEn}
      </h1>
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {project.date}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {project.duration}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          ...(project.techStack?.frontend || []),
          ...(project.techStack?.backend || []),
          ...(project.techStack?.database || []),
          ...(project.techStack?.devops || []),
        ].map((tag: string) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-md bg-secondary text-sm text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-4">
        {project.github && project.github !== '#' && (
          <Link
            to={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
          >
            <Github className="h-4 w-4" />
            {language === 'fr' ? 'Code Source' : 'Source Code'}
          </Link>
        )}
        {project.demo && project.demo !== '#' && (
          <Link
            to={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-brand text-brand-foreground hover:bg-brand-hover transition-all"
          >
            <ExternalLink className="h-4 w-4" />
            {language === 'fr' ? 'Voir la Démo' : 'View Demo'}
          </Link>
        )}
      </div>
    </div>
  );
};
