import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Calendar, Clock, Users, Zap, Briefcase } from 'lucide-react';

export const ProjectOverviewSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const fullDescription = language === 'fr' ? project.fullDescriptionFr : project.fullDescriptionEn;
  const businessContext = language === 'fr' ? project.businessContextFr : project.businessContextEn;

  const stats = [
    { icon: Clock, label: language === 'fr' ? 'Durée' : 'Duration', value: project.duration },
    { icon: Calendar, label: 'Date', value: project.date },
    ...(project.teamSize
      ? [
          {
            icon: Users,
            label: language === 'fr' ? 'Équipe' : 'Team Size',
            value: `${project.teamSize} person(s)`,
          },
        ]
      : []),
    { icon: Zap, label: 'Complexité', value: project.complexity },
    { icon: Briefcase, label: 'Rôle', value: project.role },
  ];

  return (
    <section className="mb-16 px-4 md:px-10 lg:px-14 animate-fade-in-up">
      <div className="grid lg:grid-cols-3 gap-12 items-start">
        {/* Left Column: Stats - sticky until this section ends */}
        <div className="lg:col-span-1 lg:sticky lg:top-28 self-start bg-secondary/30 p-6 rounded-md border border-border/50 backdrop-blur-sm shadow-sm">
          <h3 className="text-lg font-bold mb-5 text-foreground">
            {language === 'fr' ? 'Détails du projet' : 'Project Details'}
          </h3>
          <div className="flex flex-col gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="p-2.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
                    {stat.label}
                  </p>
                  <p className="text-xs font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Full Description & Context */}
        <div className="lg:col-span-2 space-y-8">
          {fullDescription && (
            <div>
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-5 flex items-center gap-3 tracking-tight">
                <span className="w-5 h-0.5 bg-primary rounded-full shrink-0" />
                {language === 'fr' ? 'Aperçu du projet' : 'Project Overview'}
              </h2>
              <div className="text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-line">
                {fullDescription}
              </div>
            </div>
          )}

          {businessContext && (
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-md">
              <h3 className="text-base md:text-lg font-semibold mb-2.5 text-foreground flex items-center gap-2 tracking-tight">
                {language === 'fr' ? 'Contexte Métier' : 'Business Context'}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base italic leading-relaxed">
                "{businessContext}"
              </p>
            </div>
          )}

          {((language === 'fr' ? project.responsibilitiesFr : project.responsibilitiesEn) ?? [])
            .length > 0 && (
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-3 text-foreground tracking-tight">
                {language === 'fr' ? 'Responsabilités' : 'Responsibilities'}
              </h3>
              <ul className="space-y-2">
                {(language === 'fr'
                  ? project.responsibilitiesFr!
                  : project.responsibilitiesEn!
                ).map((item, idx) => (
                  <li
                    key={idx}
                    className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
