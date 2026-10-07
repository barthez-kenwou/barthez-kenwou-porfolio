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
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground sm:text-xl">
        <div className="rounded-md bg-primary/10 p-2">
          <Server className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
        </div>
        {language === 'fr' ? 'Compétences Techniques' : 'Technical Skills'}
      </h2>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-4">
        {categories.map(({ key, label, icon }) => (
          <div key={key}>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
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
