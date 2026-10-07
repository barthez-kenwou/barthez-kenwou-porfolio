import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';
import { Image } from '@/shared/ui/Image';
import { ArrowRight } from 'lucide-react';

export const ProjectBeforeAfterSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const pairs = project.beforeAfter ?? [];

  if (pairs.length === 0) return null;

  return (
    <ProjectSectionShell title={isFr ? 'Avant / Après' : 'Before / After'}>
      <div className="space-y-8">
        {pairs.map((pair, idx) => {
          const caption = isFr ? pair.captionFr : pair.captionEn;
          return (
            <div key={idx}>
              <div className="grid md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-center">
                <figure className="rounded-md border border-border/40 overflow-hidden bg-card/30">
                  <Image
                    src={pair.beforeSrc}
                    alt={isFr ? 'Avant' : 'Before'}
                    className="w-full aspect-[16/10] object-cover"
                  />
                  <figcaption className="px-3 py-2 text-[10px] uppercase tracking-wide text-muted-foreground border-t border-border/30">
                    {isFr ? 'Avant' : 'Before'}
                  </figcaption>
                </figure>
                <ArrowRight className="hidden md:block w-5 h-5 text-primary mx-auto shrink-0" />
                <figure className="rounded-md border border-primary/25 overflow-hidden bg-card/30">
                  <Image
                    src={pair.afterSrc}
                    alt={isFr ? 'Après' : 'After'}
                    className="w-full aspect-[16/10] object-cover"
                  />
                  <figcaption className="px-3 py-2 text-[10px] uppercase tracking-wide text-primary border-t border-primary/20">
                    {isFr ? 'Après' : 'After'}
                  </figcaption>
                </figure>
              </div>
              {caption && (
                <p className="text-sm text-muted-foreground text-center mt-3">{caption}</p>
              )}
            </div>
          );
        })}
      </div>
    </ProjectSectionShell>
  );
};
