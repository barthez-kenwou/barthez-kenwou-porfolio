export type {
  IProject,
  ITechStack,
  ProjectStatus,
  ProjectRole,
  IProjectVideo,
  IProjectGalleryItem,
  IProjectDiagram,
  IProjectResource,
  IProjectMilestone,
  IProjectDecision,
  IProjectLink,
  IProjectTestimonial,
  IProjectBeforeAfter,
} from './model/project.types';
export { ProjectSchema, TechStackSchema, ProjectStatusSchema } from './model/project.schema';
export type { ProjectInput, TechStackInput } from './model/project.schema';
export { projectApi } from './api/project.api';
export {
  PROJECT_STATUS_CONFIG,
  PROJECT_ROLE_ICONS,
  ALL_PROJECT_ROLES,
  ALL_PROJECT_STATUSES,
} from './model/project.config';
export type { LucideIconComponent, StatusConfig } from './model/project.config';

// UI components
export { FeaturedProjectCard } from './ui/FeaturedProjectCard.ui';
export { ProjectCard } from './ui/ProjectCard.ui';
export { ProjectStatusBadge } from './ui/ProjectStatusBadge.ui';
export { TechBadge } from './ui/TechBadge.ui';
