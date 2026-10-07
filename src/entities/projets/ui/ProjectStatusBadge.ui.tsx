import React from 'react';
import { PROJECT_STATUS_CONFIG } from '../model/project.config';
import type { ProjectStatus } from '../model/project.types';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const config = PROJECT_STATUS_CONFIG[status] || {
    color: 'text-primary',
    dot: 'bg-primary',
    label: status || 'Unknown',
  };

  return (
    <span
      className={`flex items-center gap-1 px-2 py-1 rounded-full bg-card/80 backdrop-blur-sm text-[9px] font-semibold uppercase tracking-wider border border-border/30 ${config.color} ${className}`}
    >
      <span className={`w-1 h-1 rounded-full animate-pulse ${config.dot}`} />
      {config.label}
    </span>
  );
};
