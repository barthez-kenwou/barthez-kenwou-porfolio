import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';
import type { Icertifications } from '../model/certification.types';

export interface ICertificationDto extends Icertifications {
  id: string;
  sortOrder?: number;
}

export type CertificationListParams = PaginationParams;

export async function listCertifications(
  params?: CertificationListParams,
): Promise<PaginatedData<ICertificationDto>> {
  return apiClient.get<PaginatedData<ICertificationDto>>('/certifications', toQueryParams(params));
}

export async function getCertification(id: string): Promise<ICertificationDto> {
  return apiClient.get<ICertificationDto>(`/certifications/${id}`);
}

export async function createCertification(
  payload: Omit<ICertificationDto, 'id'>,
): Promise<ICertificationDto> {
  return apiClient.post<ICertificationDto>('/certifications', payload);
}

export async function updateCertification(
  id: string,
  payload: Partial<ICertificationDto>,
): Promise<ICertificationDto> {
  return apiClient.put<ICertificationDto>(`/certifications/${id}`, payload);
}

export async function deleteCertification(id: string): Promise<void> {
  await apiClient.delete(`/certifications/${id}`);
}

export const certificationApi = {
  list: listCertifications,
  getById: getCertification,
  create: createCertification,
  update: updateCertification,
  delete: deleteCertification,
};
