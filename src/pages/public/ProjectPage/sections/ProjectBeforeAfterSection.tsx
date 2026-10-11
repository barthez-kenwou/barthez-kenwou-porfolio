import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';
import { Image } from '@/shared/ui/Image';

export const ProjectBeforeAfterSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const pairs = project.beforeAfter ?? [];

  if (pairs.length === 0) return null;

  return (
    <ProjectSectionShell title={isFr ? 'Évolution' : 'Evolution'} tone="ruled">
      <div className="space-y-10">
        {pairs.map((pair, idx) => {
          const caption = isFr ? pair.captionFr : pair.captionEn;
          return (
            <div key={idx}>
              <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                <figure className="overflow-hidden border border-border/40 bg-muted/20">
                  <Image
                    src={pair.beforeSrc}
                    alt={isFr ? 'Avant' : 'Before'}
                    className="w-full aspect-[16/10] object-cover"
                  />
                  <figcaption className="px-3 py-2 text-[11px] text-muted-foreground border-t border-border/30">
                    {isFr ? 'Avant' : 'Before'}
                  </figcaption>
                </figure>
                <figure className="overflow-hidden border border-border/40 bg-muted/20">
                  <Image
                    src={pair.afterSrc}
                    alt={isFr ? 'Après' : 'After'}
                    className="w-full aspect-[16/10] object-cover"
                  />
                  <figcaption className="px-3 py-2 text-[11px] text-muted-foreground border-t border-border/30">
                    {isFr ? 'Après' : 'After'}
                  </figcaption>
                </figure>
              </div>
              {caption && (
                <p className="text-sm text-muted-foreground mt-3 max-w-2xl">{caption}</p>
              )}
            </div>
          );
        })}
      </div>
    </ProjectSectionShell>
  );
};
