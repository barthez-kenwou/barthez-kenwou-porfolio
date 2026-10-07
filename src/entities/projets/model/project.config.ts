import { Crown, Layers, Monitor, Server, Settings2, Target } from 'lucide-react';
import type React from 'react';
import type { ProjectRole, ProjectStatus } from './project.types';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type LucideIconComponent = React.ComponentType<{ className?: string }>;

export interface StatusConfig {
  color: string;
  dot: string;
  label: string;
}

// ─── Status config ──────────────────────────────────────────────────────────────

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, StatusConfig> = {
  Production: { color: 'text-foreground', dot: 'bg-foreground', label: 'Production' },
  'En cours': { color: 'text-primary', dot: 'bg-primary', label: 'En cours' },
  Actif: { color: 'text-muted-foreground', dot: 'bg-muted-foreground', label: 'Actif' },
  MVP: { color: 'text-primary/70', dot: 'bg-primary/70', label: 'MVP' },
  Archivé: { color: 'text-muted-foreground', dot: 'bg-muted-foreground', label: 'Archivé' },
};

// ─── Role icon map ──────────────────────────────────────────────────────────────

export const PROJECT_ROLE_ICONS: Record<ProjectRole, LucideIconComponent> = {
  'Lead Developer': Crown,
  'Full Stack Developer': Layers,
  'Full Stack JS Developer': Layers,
  'DevOps Engineer': Settings2,
  'Frontend Developer': Monitor,
  'Backend Developer': Server,
  'Scrum Master': Target,
};

// ─── All role values ────────────────────────────────────────────────────────────

export const ALL_PROJECT_ROLES: ProjectRole[] = [
  'Lead Developer',
  'Full Stack Developer',
  'Full Stack JS Developer',
  'DevOps Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Scrum Master',
];

export const ALL_PROJECT_STATUSES: ProjectStatus[] = [
  'Production',
  'En cours',
  'Actif',
  'MVP',
  'Archivé',
];
