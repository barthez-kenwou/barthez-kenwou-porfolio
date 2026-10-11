import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { TechBadge } from '@/entities/projets/ui/TechBadge.ui';

export const TechStackSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const stack = project.techStack;

  if (!stack) return null;

  const categories = [
    { title: 'Frontend', items: stack.frontend },
    { title: 'Backend', items: stack.backend },
    { title: isFr ? 'Données' : 'Data', items: stack.database },
    { title: 'DevOps', items: stack.devops },
  ].filter((cat) => cat.items && cat.items.length > 0);

  if (categories.length === 0) return null;

  return (
    <section className="mb-10 md:mb-12 px-4 md:px-10 lg:px-14">
      <div className="border-t border-border/50 pt-8 md:pt-10">
        <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground tracking-tight mb-6 md:mb-8">
          {isFr ? 'Stack' : 'Stack'}
        </h2>

        <div className="space-y-5 md:space-y-6">
          {categories.map((category) => (
            <div
              key={category.title}
              className="grid gap-2 sm:grid-cols-[7rem_1fr] sm:gap-6 md:grid-cols-[8.5rem_1fr] items-start"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground pt-1">
                {category.title}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {category.items?.map((tech) => (
                  <TechBadge key={tech} tag={tech} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
