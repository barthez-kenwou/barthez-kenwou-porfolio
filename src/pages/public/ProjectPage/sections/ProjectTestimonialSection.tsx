import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';

export const ProjectTestimonialSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const t = project.testimonial;

  if (!t) return null;

  const quote = isFr ? t.quoteFr : t.quoteEn;
  const role = isFr ? t.roleFr : t.roleEn;

  return (
    <ProjectSectionShell title={isFr ? 'Avis client' : 'Client note'} tone="quiet">
      <blockquote className="max-w-3xl border-l-2 border-foreground/25 pl-5 md:pl-6">
        <p className="text-sm md:text-[15px] text-foreground/90 leading-relaxed mb-5">“{quote}”</p>
        <footer className="text-sm">
          <cite className="not-italic font-medium text-foreground">{t.author}</cite>
          {(role || t.company) && (
            <p className="text-muted-foreground mt-0.5 text-[13px]">
              {[role, t.company].filter(Boolean).join(' · ')}
            </p>
          )}
        </footer>
      </blockquote>
    </ProjectSectionShell>
  );
};
