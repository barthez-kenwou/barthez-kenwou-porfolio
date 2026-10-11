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
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border/30 bg-card/80 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider backdrop-blur-sm ${config.color} ${className}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full animate-pulse ${config.dot}`} />
      {config.label}
    </span>
  );
};
