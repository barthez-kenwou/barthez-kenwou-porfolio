import { apiClient } from '@/shared/api';
import { cvData, type ICvData } from './mock/cv-data';
import type { ISkill } from '@/entities/skills';

type ApiCvPayload = {
  personalInfo?: ICvData['personalInfo'];
  contactInfo?: ICvData['personalInfo'];
  experiences?: ICvData['experiences'];
  education?: ICvData['education'];
  skills?: ISkill[] | Record<string, ISkill[]>;
  projects?: ICvData['projects'];
  featuredProjects?: ICvData['featuredProjects'];
  certifications?: ICvData['certifications'];
  languages?: ICvData['languages'];
  references?: ICvData['references'];
};

function groupSkillsByCategory(skills: ISkill[]): Record<string, ISkill[]> {
  const grouped: Record<string, ISkill[]> = {};
  for (const skill of skills) {
    const category = (skill as { category?: string }).category || 'tools';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(skill);
  }
  return grouped;
}

/** Map API `/cv` envelope fields onto the UI CV shape. */
export function normalizeCvData(raw: ApiCvPayload): ICvData {
  const personalInfo = raw.personalInfo ?? raw.contactInfo;
  if (!personalInfo) {
    throw new Error('CV payload missing contactInfo/personalInfo');
  }

  const skills = Array.isArray(raw.skills)
    ? groupSkillsByCategory(raw.skills)
    : ((raw.skills as Record<string, ISkill[]>) ?? {});

  return {
    personalInfo,
    experiences: raw.experiences ?? [],
    education: raw.education ?? [],
    skills: skills as ICvData['skills'],
    projects: raw.projects ?? raw.featuredProjects ?? [],
    featuredProjects: raw.featuredProjects ?? [],
    certifications: raw.certifications ?? [],
    languages: raw.languages ?? [],
    references: raw.references ?? [],
  };
}

export async function getCvData(): Promise<ICvData> {
  const payload = await apiClient.get<ApiCvPayload>('/cv');
  return normalizeCvData(payload);
}

export async function updateCvData(payload: Partial<ICvData>): Promise<ICvData> {
  const updated = await apiClient.put<ApiCvPayload>('/cv', payload);
  return normalizeCvData(updated);
}

export function cvDataMock(): ICvData {
  return cvData;
}

export const cvDataApi = {
  get: getCvData,
  update: updateCvData,
  mock: cvDataMock,
  normalize: normalizeCvData,
};
