import { ID } from '@/shared/types';

export type ProjectStatus = 'Production' | 'En cours' | 'Actif' | 'MVP' | 'Archivé';

export type ProjectRole =
  | 'Lead Developer'
  | 'Full Stack Developer'
  | 'DevOps Engineer'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Scrum Master'
  | 'Full Stack JS Developer';

export type ProjectComplexity = 'Débutant' | 'Intermédiaire' | 'Avancé';

export interface ITechStack {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  devops?: string[];
}

export type ProjectVideoType = 'demo' | 'walkthrough' | 'testimonial' | 'presentation';

export interface IProjectVideo {
  url: string;
  type: ProjectVideoType;
  titleFr?: string;
  titleEn?: string;
}

export type ProjectGalleryKind =
  | 'ui'
  | 'wip'
  | 'diagram'
  | 'metric'
  | 'test'
  | 'infra'
  | 'process'
  | 'other';

export interface IProjectGalleryItem {
  src: string;
  captionFr?: string;
  captionEn?: string;
  kind?: ProjectGalleryKind;
}

export interface IProjectDiagram {
  id: string;
  titleFr: string;
  titleEn: string;
  mermaid: string;
}

export type ProjectResourceType = 'spec' | 'report' | 'case-study' | 'slides' | 'other';

export interface IProjectResource {
  labelFr: string;
  labelEn: string;
  url: string;
  type: ProjectResourceType;
}

export interface IProjectMilestone {
  labelFr: string;
  labelEn: string;
  date?: string;
  descriptionFr?: string;
  descriptionEn?: string;
}

export interface IProjectDecision {
  titleFr: string;
  titleEn: string;
  decisionFr: string;
  decisionEn: string;
  rationaleFr?: string;
  rationaleEn?: string;
}

export interface IProjectLink {
  labelFr: string;
  labelEn: string;
  url: string;
}

export interface IProjectTestimonial {
  quoteFr: string;
  quoteEn: string;
  author: string;
  roleFr?: string;
  roleEn?: string;
  company?: string;
}

export interface IProjectBeforeAfter {
  beforeSrc: string;
  afterSrc: string;
  captionFr?: string;
  captionEn?: string;
}

export interface IProject {
  id: ID;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  fullDescriptionFr?: string;
  fullDescriptionEn?: string;
  problemFr: string;
  problemEn: string;
  solutionFr: string[];
  solutionEn: string[];
  /** @deprecated prefer solutionFr - kept for older section bindings */
  solutionsFr?: string[];
  solutionsEn?: string[];
  challengesFr?: string[];
  challengesEn?: string[];
  impactFr: string[];
  impactEn: string[];
  resultsFr?: string[];
  resultsEn?: string[];
  metrics?: Record<string, string | number>;
  techStack: ITechStack;
  architecture?: string[];
  testing?: string[];
  images: string[];
  preview: string;
  /** @deprecated prefer videos[] */
  videoDemo?: string;
  category: string;
  status: ProjectStatus;
  complexity: string;
  role: string;
  teamSize?: number;
  duration: string;
  date: string;
  github?: string;
  demo?: string;
  /** @deprecated prefer resources[] */
  caseStudy?: string;
  /** @deprecated prefer resources[] */
  documentation?: string;
  businessContextFr?: string;
  businessContextEn?: string;
  isFeatured?: boolean;

  /** When false, hidden from the public projects listing. */
  isPublished?: boolean;

  /** NDA / anonymized case study */
  confidential?: boolean;

  /** Precise responsibilities beyond the role title */
  responsibilitiesFr?: string[];
  responsibilitiesEn?: string[];

  videos?: IProjectVideo[];
  gallery?: IProjectGalleryItem[];
  diagrams?: IProjectDiagram[];
  resources?: IProjectResource[];
  milestones?: IProjectMilestone[];

  scopeFr?: string[];
  scopeEn?: string[];
  nonGoalsFr?: string[];
  nonGoalsEn?: string[];

  decisions?: IProjectDecision[];

  securityFr?: string[];
  securityEn?: string[];

  infraFr?: string[];
  infraEn?: string[];

  externalLinks?: IProjectLink[];

  testimonial?: IProjectTestimonial;

  lessonsFr?: string[];
  lessonsEn?: string[];

  beforeAfter?: IProjectBeforeAfter[];
}
