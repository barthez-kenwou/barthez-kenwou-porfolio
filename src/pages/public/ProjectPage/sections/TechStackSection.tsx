import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Layout, Server, Database, Settings2 } from 'lucide-react';
import { TechBadge } from '@/entities/projets/ui/TechBadge.ui';

export const TechStackSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const stack = project.techStack;

  if (!stack) return null;

  const categories = [
    { title: 'Frontend', items: stack.frontend, icon: Layout },
    { title: 'Backend', items: stack.backend, icon: Server },
    { title: 'Database', items: stack.database, icon: Database },
    { title: 'DevOps & Infra', items: stack.devops, icon: Settings2 },
  ].filter((cat) => cat.items && cat.items.length > 0);

  if (categories.length === 0) return null;

  return (
    <section className="mb-16 px-4 md:px-10 lg:px-14 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-[1px] flex-grow bg-border/50"></div>
        <h2 className="text-lg md:text-xl font-bold px-4 text-center text-foreground tracking-tight shrink-0">
          {language === 'fr' ? 'Technologies Utilisées' : 'Technologies Used'}
        </h2>
        <div className="h-[1px] flex-grow bg-border/50"></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category, idx) => (
          <div
            key={idx}
            className="p-2 rounded-md bg-secondary/20 border border-border/40 hover:border-border/80 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-1 mb-2">
              <div className="p-2 rounded-md bg-background text-primary shadow-sm border border-border/30">
                <category.icon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-foreground">{category.title}</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {category.items?.map((tech) => (
                <div key={tech} className="scale-90 origin-left">
                  <TechBadge tag={tech} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
