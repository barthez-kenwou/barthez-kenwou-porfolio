import React from 'react';

import { PROJECT_ROLE_ICONS, PROJECT_STATUS_CONFIG } from '@/entities/projets/model/project.config';
import type { ProjectRole, ProjectStatus } from '@/entities/projets/model/project.types';

import { FilterDropdown } from './FilterDropdown.ui';
import { FaX } from 'react-icons/fa6';
import { User } from 'lucide-react';

// ─── Props ──────────────────────────────────────────────────────────────────────

interface ProjectFilterBarProps {
  /** Available options derived from data */
  availableTechs: string[];
  availableRoles: ProjectRole[];
  availableStatuses: ProjectStatus[];
  /** Current active filter values */
  activeTechs: string[];
  activeRole: ProjectRole | null;
  activeStatus: ProjectStatus | null;
  /** Total secondary active count - drives visibility of the reset button */
  secondaryActiveCount: number;
  /** Action callbacks */
  onTechToggle: (tech: string) => void;
  onRoleSelect: (role: ProjectRole | null) => void;
  onStatusSelect: (status: ProjectStatus | null) => void;
  onReset: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const ProjectFilterBar: React.FC<ProjectFilterBarProps> = ({
  availableTechs,
  availableRoles,
  availableStatuses,
  activeTechs,
  activeRole,
  activeStatus,
  secondaryActiveCount,
  onTechToggle,
  onRoleSelect,
  onStatusSelect,
  onReset,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-6 relative z-10">
      {/* ── Tech ── */}
      <FilterDropdown label="Tech" activeCount={activeTechs.length}>
        <div className="max-h-46 overflow-y-auto">
          {availableTechs.map((tech) => {
            const isActive = activeTechs.includes(tech);
            return (
              <button
                key={tech}
                type="button"
                onClick={() => onTechToggle(tech)}
                className={`w-full flex items-center gap-1 px-1 py-1.5 rounded-sm text-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primary/20 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                }`}
              >
                <span
                  className={`w-1 h-1 rounded-full flex-shrink-0 transition-colors ${
                    isActive ? 'bg-primary' : 'bg-border/60'
                  }`}
                />
                {tech}
              </button>
            );
          })}
        </div>
      </FilterDropdown>

      {/* ── Role ── */}
      <FilterDropdown label="Rôle" activeCount={activeRole ? 1 : 0}>
        {availableRoles.map((role) => {
          const RoleIcon = PROJECT_ROLE_ICONS[role] || User;
          const isActive = activeRole === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => onRoleSelect(isActive ? null : role)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-nowrap text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-primary/20 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              }`}
            >
              <RoleIcon className="h-3 w-3 flex-shrink-0" />
              {role}
            </button>
          );
        })}
      </FilterDropdown>

      {/* ── Status ── */}
      <FilterDropdown label="Status" activeCount={activeStatus ? 1 : 0}>
        {availableStatuses.map((status) => {
          const config = PROJECT_STATUS_CONFIG[status] || {
            dot: 'bg-primary',
            color: 'text-primary',
          };
          const isActive = activeStatus === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusSelect(isActive ? null : status)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-primary/20 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
              <span className={isActive ? '' : config.color}>{status}</span>
            </button>
          );
        })}
      </FilterDropdown>

      {/* ── Reset - only visible when secondary filters are active ── */}
      {secondaryActiveCount > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 px-2 py-1.5 rounded-sm text-xs border border-border/40 text-muted-foreground hover:text-foreground hover:border-border/70 hover:bg-secondary/40 transition-all duration-200 cursor-pointer"
        >
          <FaX className="h-3 w-3" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
};
