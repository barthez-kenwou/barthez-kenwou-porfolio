import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';

export type LanguageDto = {
  id: string;
  language: string;
  proficiencyFr: string;
  proficiencyEn: string;
  sortOrder?: number;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LanguageInput = {
  language: string;
  proficiencyFr: string;
  proficiencyEn: string;
  sortOrder?: number;
};

export type LanguageListParams = PaginationParams;

export async function listLanguages(
  params?: LanguageListParams,
): Promise<PaginatedData<LanguageDto>> {
  return apiClient.get<PaginatedData<LanguageDto>>('/languages', toQueryParams(params));
}

export async function getLanguage(id: string): Promise<LanguageDto> {
  return apiClient.get<LanguageDto>(`/languages/${id}`);
}

export async function createLanguage(payload: LanguageInput): Promise<LanguageDto> {
  return apiClient.post<LanguageDto>('/languages', payload);
}

export async function updateLanguage(
  id: string,
  payload: Partial<LanguageInput>,
): Promise<LanguageDto> {
  return apiClient.put<LanguageDto>(`/languages/${id}`, payload);
}

export async function deleteLanguage(id: string): Promise<void> {
  await apiClient.delete(`/languages/${id}`);
}

export function languagesMock(): LanguageDto[] {
  return [
    {
      id: 'mock-lang-1',
      language: 'Français',
      proficiencyFr: 'Natif',
      proficiencyEn: 'Native',
      sortOrder: 0,
    },
    {
      id: 'mock-lang-2',
      language: 'English',
      proficiencyFr: 'Courant',
      proficiencyEn: 'Fluent',
      sortOrder: 1,
    },
  ];
}
