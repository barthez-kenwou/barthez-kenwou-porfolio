import { useMemo, useState } from 'react';
import { trackProjectFilter } from '@/app/lib/analytics';
import { usePublicProjects } from '@/entities/projets/hooks/useProjects';
import type { IProject, ProjectRole, ProjectStatus } from '@/entities/projets/model/project.types';

// ─── Filter state ───────────────────────────────────────────────────────────────

export interface ProjectFilters {
  category: string;
  techs: string[];
  role: ProjectRole | null;
  status: ProjectStatus | null;
}

const INITIAL_FILTERS: ProjectFilters = {
  category: 'all',
  techs: [],
  role: null,
  status: null,
};

/** Skill-taxonomy chips → project category / stack matching (not exact equality). */
const CATEGORY_NEEDLES: Record<string, string[]> = {
  cloud: ['cloud', 'aws', 'saas', 'serverless'],
  devops: [
    'devops',
    'docker',
    'kubernetes',
    'ci/cd',
    'gitlab',
    'github actions',
    'terraform',
    'ansible',
    'observability',
  ],
  devsecops: ['devsecops', 'security', 'sonarqube', 'trivy', 'owasp', 'gitleaks'],
  backend: ['backend', 'node', 'express', 'nestjs', 'api'],
  frontend: ['frontend', 'react', 'vue', 'pwa', 'fullstack', 'full stack', 'full-stack'],
  database: ['database', 'postgres', 'postgresql', 'mysql', 'mongo', 'redis', 'dynamodb', 'sql'],
  tools: ['tool', 'figma', 'jira', 'notion'],
  architecture: ['architecture', 'microservices', 'modular'],
  softSkills: ['soft skill', 'leadership', 'communication'],
};

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const getProjectTechs = (p: IProject) => [
  ...(p.techStack?.frontend || []),
  ...(p.techStack?.backend || []),
  ...(p.techStack?.database || []),
  ...(p.techStack?.devops || []),
];

const matchesCategoryFilter = (project: IProject, filterId: string): boolean => {
  if (filterId === 'all') return true;

  if (filterId === 'frontend' && (project.techStack?.frontend?.length ?? 0) > 0) return true;
  if (filterId === 'backend' && (project.techStack?.backend?.length ?? 0) > 0) return true;
  if (filterId === 'database' && (project.techStack?.database?.length ?? 0) > 0) return true;
  if (filterId === 'devops' && (project.techStack?.devops?.length ?? 0) > 0) return true;

  const haystack = normalize(
    [project.category, ...getProjectTechs(project), ...(project.architecture || [])].join(' • '),
  );

  const needles = CATEGORY_NEEDLES[filterId] ?? [filterId];
  return needles.some((needle) => haystack.includes(normalize(needle)));
};

// ─── Hook ───────────────────────────────────────────────────────────────────────

export const useProjectFilters = () => {
  const [filters, setFilters] = useState<ProjectFilters>(INITIAL_FILTERS);
  const projectsQuery = usePublicProjects();
  const projects = projectsQuery.data?.data.items ?? [];

  const availableTechs = useMemo(
    () => Array.from(new Set(projects.flatMap(getProjectTechs))).sort(),
    [projects],
  );

  const availableRoles = useMemo(
    () => Array.from(new Set(projects.map((p) => p.role).filter(Boolean))) as ProjectRole[],
    [projects],
  );

  const availableStatuses = useMemo(
    () => Array.from(new Set(projects.map((p) => p.status).filter(Boolean))) as ProjectStatus[],
    [projects],
  );

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        if (project.isPublished === false) return false;
        const matchCategory = matchesCategoryFilter(project, filters.category);
        const matchTech =
          filters.techs.length === 0 ||
          filters.techs.some((t) => getProjectTechs(project).includes(t));
        const matchRole = !filters.role || project.role === filters.role;
        const matchStatus = !filters.status || project.status === filters.status;
        return matchCategory && matchTech && matchRole && matchStatus;
      }),
    [filters, projects],
  );

  // ── Derived counts ────────────────────────────────────────────────────────
  const secondaryActiveCount =
    filters.techs.length + (filters.role ? 1 : 0) + (filters.status ? 1 : 0);

  // ── Actions ───────────────────────────────────────────────────────────────
  const setCategory = (category: string) => {
    trackProjectFilter('category', category);
    setFilters((prev) => ({ ...prev, category }));
  };

  const toggleTech = (tech: string) => {
    trackProjectFilter('tech', tech);
    setFilters((prev) => ({
      ...prev,
      techs: prev.techs.includes(tech)
        ? prev.techs.filter((t) => t !== tech)
        : [...prev.techs, tech],
    }));
  };

  const setRole = (role: ProjectRole | null) => {
    if (role) trackProjectFilter('role', role);
    setFilters((prev) => ({ ...prev, role }));
  };

  const setStatus = (status: ProjectStatus | null) => {
    if (status) trackProjectFilter('status', status);
    setFilters((prev) => ({ ...prev, status }));
  };

  const resetSecondaryFilters = () =>
    setFilters((prev) => ({ ...prev, techs: [], role: null, status: null }));

  const resetAllFilters = () => setFilters(INITIAL_FILTERS);

  return {
    filters,
    filteredProjects,
    availableTechs,
    availableRoles,
    availableStatuses,
    secondaryActiveCount,
    setCategory,
    toggleTech,
    setRole,
    setStatus,
    resetSecondaryFilters,
    resetAllFilters,
    isPending: projectsQuery.isPending,
    isError: projectsQuery.isError,
    error: projectsQuery.error,
    source: projectsQuery.data?.source,
  };
};
