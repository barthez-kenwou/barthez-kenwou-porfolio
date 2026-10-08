import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import {
  Building,
  Cloud,
  Code,
  Database,
  MonitorSmartphone,
  Server,
  Shield,
  ToolboxIcon,
} from 'lucide-react';
import { SkillBadge } from '@/entities/skills/ui/SkillBadge.ui';
import { ISkill } from '@/entities/skills';

interface SkillsProps {
  skills: Record<string, ISkill[]>;
}

export const SkillsSection: React.FC<SkillsProps> = ({ skills }) => {
  const { language } = useLanguageStore();

  const categories = [
    { key: 'cloud', label: 'AWS Cloud', icon: <Cloud className="h-4 w-4 text-primary" /> },
    { key: 'devops', label: 'DevOps & Cloud', icon: <Server className="h-4 w-4 text-primary" /> },
    { key: 'devsecops', label: 'DevSecOps', icon: <Shield className="h-4 w-4 text-primary" /> },
    { key: 'backend', label: 'Backend', icon: <Code className="h-4 w-4 text-primary" /> },
    {
      key: 'frontend',
      label: 'Frontend',
      icon: <MonitorSmartphone className="h-4 w-4 text-primary" />,
    },
    { key: 'database', label: 'Database', icon: <Database className="h-4 w-4 text-primary" /> },
    {
      key: 'tools',
      label: 'Tools & Environment',
      icon: <ToolboxIcon className="h-4 w-4 text-primary" />,
    },
    {
      key: 'architecture',
      label: 'Architecture & Design',
      icon: <Building className="h-4 w-4 text-primary" />,
    },
  ];

  return (
    <section>
      {/* Title */}
      <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-foreground sm:mb-4">
        <div className="rounded-md bg-primary/10 p-1.5">
          <Server className="h-4 w-4 text-primary" />
        </div>
        {language === 'fr' ? 'Compétences Techniques' : 'Technical Skills'}
      </h2>

      {/* Content */}
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        {categories.map(({ key, label, icon }) => (
          <div key={key}>
            <h4 className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-foreground sm:text-sm">
              {icon} {label}
            </h4>

            <div className="flex flex-wrap gap-1.5">
              {skills[key]?.map((skill: ISkill) => (
                <SkillBadge key={skill.name} Skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
