import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Layers, TestTube2, CheckCircle2 } from 'lucide-react';

export const ArchitectureTestingSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const architecture = project.architecture;
  const testing = project.testing;

  if ((!architecture || architecture.length === 0) && (!testing || testing.length === 0)) {
    return null;
  }

  return (
    <section className="mb-16 px-4 md:px-10 lg:px-14 animate-fade-in-up">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Architecture */}
        {architecture && architecture.length > 0 && (
          <div className="bg-card border border-border/40 p-6 rounded-md shadow-sm hover:shadow-sm transition-shadow">
            <h2 className="text-lg md:text-xl font-bold mb-5 text-foreground flex items-center gap-3 tracking-tight">
              <div className="p-2 rounded-md bg-primary/10 text-primary">
                <Layers className="w-4 h-4" />
              </div>
              {language === 'fr' ? 'Architecture Technique' : 'Technical Architecture'}
            </h2>
            <ul className="space-y-4">
              {architecture.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Testing & QA */}
        {testing && testing.length > 0 && (
          <div className="bg-card border border-border/40 p-6 rounded-md shadow-sm hover:shadow-sm transition-shadow">
            <h2 className="text-lg md:text-xl font-bold mb-5 text-foreground flex items-center gap-3 tracking-tight">
              <div className="p-2 rounded-md bg-secondary text-secondary-foreground">
                <TestTube2 className="w-4 h-4" />
              </div>
              {language === 'fr' ? 'Assurance Qualité & Tests' : 'Testing & QA'}
            </h2>
            <ul className="space-y-4">
              {testing.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
