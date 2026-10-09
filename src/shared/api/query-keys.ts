import type { PaginationParams } from './types';

export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  dashboard: {
    root: ['admin', 'dashboard'] as const,
  },
  projects: {
    all: ['projects'] as const,
    list: (params?: PaginationParams & Record<string, unknown>) =>
      ['projects', 'list', params ?? {}] as const,
    detail: (id: string) => ['projects', 'detail', id] as const,
  },
  blogs: {
    all: ['blogs'] as const,
    list: (params?: PaginationParams & Record<string, unknown>) =>
      ['blogs', 'list', params ?? {}] as const,
    detail: (slugOrId: string) => ['blogs', 'detail', slugOrId] as const,
  },
  services: {
    all: ['services'] as const,
    list: (params?: PaginationParams & Record<string, unknown>) =>
      ['services', 'list', params ?? {}] as const,
    detail: (id: string) => ['services', 'detail', id] as const,
  },
  skills: {
    all: ['skills'] as const,
    list: (params?: PaginationParams & Record<string, unknown>) =>
      ['skills', 'list', params ?? {}] as const,
  },
  experiences: {
    all: ['experiences'] as const,
    list: (params?: PaginationParams & Record<string, unknown>) =>
      ['experiences', 'list', params ?? {}] as const,
  },
  education: {
    all: ['education'] as const,
    list: (params?: PaginationParams & Record<string, unknown>) =>
      ['education', 'list', params ?? {}] as const,
  },
  certifications: {
    all: ['certifications'] as const,
    list: (params?: PaginationParams & Record<string, unknown>) =>
      ['certifications', 'list', params ?? {}] as const,
  },
  achievements: {
    all: ['achievements'] as const,
    list: (params?: PaginationParams & Record<string, unknown>) =>
      ['achievements', 'list', params ?? {}] as const,
  },
  languages: {
    all: ['languages'] as const,
    list: (params?: PaginationParams & Record<string, unknown>) =>
      ['languages', 'list', params ?? {}] as const,
  },
  testimonials: {
    all: ['testimonials'] as const,
    list: (params?: PaginationParams & Record<string, unknown>) =>
      ['testimonials', 'list', params ?? {}] as const,
    public: ['testimonials', 'public'] as const,
  },
  references: {
    all: ['references'] as const,
    list: (params?: PaginationParams & Record<string, unknown>) =>
      ['references', 'list', params ?? {}] as const,
  },
  contactInfo: {
    root: ['contact-infos'] as const,
  },
  contactResponses: {
    all: ['contact-responses'] as const,
    list: (params?: PaginationParams & Record<string, unknown>) =>
      ['contact-responses', 'list', params ?? {}] as const,
  },
  cv: {
    root: ['cv'] as const,
  },
  newsletter: {
    stats: ['newsletter', 'stats'] as const,
    subscribers: (params?: PaginationParams & Record<string, unknown>) =>
      ['newsletter', 'subscribers', params ?? {}] as const,
    campaigns: (params?: PaginationParams & Record<string, unknown>) =>
      ['newsletter', 'campaigns', params ?? {}] as const,
  },
} as const;
