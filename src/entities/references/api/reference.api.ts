import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';
import type { IProfessionalReference } from '@/features/admin-cms/model/cms.types';
import { cvData } from '@/entities/cv/api/mock/cv-data';

export type ReferenceListParams = PaginationParams;

export async function listReferences(
  params?: ReferenceListParams,
): Promise<PaginatedData<IProfessionalReference>> {
  return apiClient.get<PaginatedData<IProfessionalReference>>('/references', toQueryParams(params));
}

export async function getReference(id: string): Promise<IProfessionalReference> {
  return apiClient.get<IProfessionalReference>(`/references/${id}`);
}

export async function createReference(
  payload: Omit<IProfessionalReference, 'id'>,
): Promise<IProfessionalReference> {
  return apiClient.post<IProfessionalReference>('/references', payload);
}

export async function updateReference(
  id: string,
  payload: Partial<IProfessionalReference>,
): Promise<IProfessionalReference> {
  return apiClient.put<IProfessionalReference>(`/references/${id}`, payload);
}

export async function deleteReference(id: string): Promise<void> {
  await apiClient.delete(`/references/${id}`);
}

export function referencesMock(): IProfessionalReference[] {
  return cvData.references.map((ref, index) => ({
    ...ref,
    id: `mock-ref-${index}`,
  }));
}

export const referenceApi = {
  list: listReferences,
  getById: getReference,
  create: createReference,
  update: updateReference,
  delete: deleteReference,
  mock: referencesMock,
};
