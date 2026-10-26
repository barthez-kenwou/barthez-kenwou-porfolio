import React, { useState } from 'react';
import { SlidersHorizontal, User, X } from 'lucide-react';

import { PROJECT_ROLE_ICONS, PROJECT_STATUS_CONFIG } from '@/entities/projets/model/project.config';
import type { ProjectRole, ProjectStatus } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/sheet';

import { FilterDropdown } from './FilterDropdown.ui';

// ─── Props ──────────────────────────────────────────────────────────────────────

interface ProjectFilterBarProps {
  availableTechs: string[];
  availableRoles: ProjectRole[];
  availableStatuses: ProjectStatus[];
  activeTechs: string[];
  activeRole: ProjectRole | null;
  activeStatus: ProjectStatus | null;
  secondaryActiveCount: number;
  onTechToggle: (tech: string) => void;
  onRoleSelect: (role: ProjectRole | null) => void;
  onStatusSelect: (status: ProjectStatus | null) => void;
  onReset: () => void;
}

// ─── Shared option lists ────────────────────────────────────────────────────────

const TechOptions: React.FC<{
  availableTechs: string[];
  activeTechs: string[];
  onTechToggle: (tech: string) => void;
  denser?: boolean;
}> = ({ availableTechs, activeTechs, onTechToggle, denser }) => (
  <div className={cn(denser ? 'flex flex-wrap gap-1.5' : 'max-h-46 overflow-y-auto')}>
    {availableTechs.map((tech) => {
      const isActive = activeTechs.includes(tech);
      if (denser) {
        return (
          <button
            key={tech}
            type="button"
            onClick={() => onTechToggle(tech)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer',
              isActive
                ? 'border-brand bg-brand text-brand-foreground'
                : 'border-border/50 bg-secondary/40 text-muted-foreground active:bg-secondary',
            )}
          >
            {tech}
          </button>
        );
      }
      return (
        <button
          key={tech}
          type="button"
          onClick={() => onTechToggle(tech)}
          className={cn(
            'flex w-full cursor-pointer items-center gap-1 rounded-sm px-1 py-1.5 text-xs transition-colors',
            isActive
              ? 'bg-primary/20 font-medium text-primary'
              : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
          )}
        >
          <span
            className={cn(
              'h-1 w-1 shrink-0 rounded-full transition-colors',
              isActive ? 'bg-primary' : 'bg-border/60',
            )}
          />
          {tech}
        </button>
      );
    })}
  </div>
);

const RoleOptions: React.FC<{
  availableRoles: ProjectRole[];
  activeRole: ProjectRole | null;
  onRoleSelect: (role: ProjectRole | null) => void;
  denser?: boolean;
}> = ({ availableRoles, activeRole, onRoleSelect, denser }) => (
  <div className={cn(denser ? 'flex flex-col gap-1' : undefined)}>
    {availableRoles.map((role) => {
      const RoleIcon = PROJECT_ROLE_ICONS[role] || User;
      const isActive = activeRole === role;
      return (
        <button
          key={role}
          type="button"
          onClick={() => onRoleSelect(isActive ? null : role)}
          className={cn(
            'flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-xs transition-colors',
            denser && 'border border-border/40',
            isActive
              ? denser
                ? 'border-brand/40 bg-brand/10 font-medium text-brand'
                : 'bg-primary/20 font-medium text-primary'
              : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
          )}
        >
          <RoleIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="text-left leading-snug">{role}</span>
        </button>
      );
    })}
  </div>
);

const StatusOptions: React.FC<{
  availableStatuses: ProjectStatus[];
  activeStatus: ProjectStatus | null;
  onStatusSelect: (status: ProjectStatus | null) => void;
  denser?: boolean;
}> = ({ availableStatuses, activeStatus, onStatusSelect, denser }) => (
  <div className={cn(denser ? 'flex flex-wrap gap-1.5' : undefined)}>
    {availableStatuses.map((status) => {
      const config = PROJECT_STATUS_CONFIG[status] || {
        dot: 'bg-primary',
        color: 'text-primary',
      };
      const isActive = activeStatus === status;
      if (denser) {
        return (
          <button
            key={status}
            type="button"
            onClick={() => onStatusSelect(isActive ? null : status)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors',
              isActive
                ? 'border-brand bg-brand text-brand-foreground'
                : 'border-border/50 bg-secondary/40 text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                isActive ? 'bg-brand-foreground' : config.dot,
              )}
            />
            {status}
          </button>
        );
      }
      return (
        <button
          key={status}
          type="button"
          onClick={() => onStatusSelect(isActive ? null : status)}
          className={cn(
            'flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors',
            isActive
              ? 'bg-primary/20 font-medium text-primary'
              : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
          )}
        >
          <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', config.dot)} />
          <span className={isActive ? '' : config.color}>{status}</span>
        </button>
      );
    })}
  </div>
);

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
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      {/* Desktop — inline dropdowns */}
      <div className="relative z-10 mb-6 hidden items-center justify-center gap-2 md:flex">
        <FilterDropdown label="Tech" activeCount={activeTechs.length}>
          <TechOptions
            availableTechs={availableTechs}
            activeTechs={activeTechs}
            onTechToggle={onTechToggle}
          />
        </FilterDropdown>

        <FilterDropdown label={isFr ? 'Rôle' : 'Role'} activeCount={activeRole ? 1 : 0}>
          <RoleOptions
            availableRoles={availableRoles}
            activeRole={activeRole}
            onRoleSelect={onRoleSelect}
          />
        </FilterDropdown>

        <FilterDropdown label="Status" activeCount={activeStatus ? 1 : 0}>
          <StatusOptions
            availableStatuses={availableStatuses}
            activeStatus={activeStatus}
            onStatusSelect={onStatusSelect}
          />
        </FilterDropdown>

        {secondaryActiveCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="flex cursor-pointer items-center gap-1 rounded-sm border border-border/40 px-2 py-1.5 text-xs text-muted-foreground transition-all duration-200 hover:border-border/70 hover:bg-secondary/40 hover:text-foreground"
          >
            <X className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Mobile — one control + bottom sheet */}
      <div className="relative z-10 mb-5 flex items-center gap-2 md:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className={cn(
              'flex h-10 flex-1 items-center justify-between gap-2 rounded-md border px-3.5',
              'text-sm font-semibold transition-colors cursor-pointer',
              secondaryActiveCount > 0
                ? 'border-brand/45 bg-brand/8 text-foreground'
                : 'border-border/50 bg-secondary/30 text-foreground',
            )}
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              {isFr ? 'Filtres' : 'Filters'}
            </span>
            {secondaryActiveCount > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-brand-foreground tabular-nums">
                {secondaryActiveCount}
              </span>
            ) : (
              <span className="text-[11px] font-medium text-muted-foreground">
                {isFr ? 'Tech · Rôle · Status' : 'Tech · Role · Status'}
              </span>
            )}
          </button>

          <SheetContent side="bottom" className="gap-0 rounded-t-xl border-border/50 p-0">
            <SheetHeader className="border-b border-border/40 px-4 py-4 text-left">
              <SheetTitle className="font-heading text-base">
                {isFr ? 'Affiner la sélection' : 'Refine selection'}
              </SheetTitle>
            </SheetHeader>

            <div className="max-h-[70dvh] space-y-5 overflow-y-auto px-4 py-4">
              <section className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Tech
                  </h3>
                  {activeTechs.length > 0 && (
                    <span className="text-[10px] font-semibold tabular-nums text-brand">
                      {activeTechs.length}
                    </span>
                  )}
                </div>
                <TechOptions
                  availableTechs={availableTechs}
                  activeTechs={activeTechs}
                  onTechToggle={onTechToggle}
                  denser
                />
              </section>

              <section className="space-y-2.5">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  {isFr ? 'Rôle' : 'Role'}
                </h3>
                <RoleOptions
                  availableRoles={availableRoles}
                  activeRole={activeRole}
                  onRoleSelect={onRoleSelect}
                  denser
                />
              </section>

              <section className="space-y-2.5">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Status
                </h3>
                <StatusOptions
                  availableStatuses={availableStatuses}
                  activeStatus={activeStatus}
                  onStatusSelect={onStatusSelect}
                  denser
                />
              </section>
            </div>

            <div className="flex gap-2 border-t border-border/40 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {secondaryActiveCount > 0 && (
                <button
                  type="button"
                  onClick={onReset}
                  className="h-11 flex-1 rounded-md border border-border/50 text-sm font-semibold text-muted-foreground cursor-pointer"
                >
                  {isFr ? 'Réinitialiser' : 'Reset'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="h-11 flex-[1.4] rounded-md bg-brand text-sm font-semibold text-brand-foreground cursor-pointer"
              >
                {isFr ? 'Voir les résultats' : 'See results'}
              </button>
            </div>
          </SheetContent>
        </Sheet>

        {secondaryActiveCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            aria-label={isFr ? 'Réinitialiser les filtres' : 'Reset filters'}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/50 bg-secondary/30 text-muted-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </>
  );
};
