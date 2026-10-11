import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';
import type {
  IPartner,
  PartnerCreatePayload,
  PartnerUpdatePayload,
} from '../model/partner.types';
import { partnersMock } from './mocks/partners.mocks';

export type PartnerListParams = PaginationParams & {
  isPublished?: boolean;
  includeUnpublished?: boolean;
};

export async function listPartners(
  params?: PartnerListParams,
): Promise<PaginatedData<IPartner>> {
  return apiClient.get<PaginatedData<IPartner>>('/partners', toQueryParams(params));
}

export async function getPartner(id: string): Promise<IPartner> {
  return apiClient.get<IPartner>(`/partners/${id}`);
}

export async function createPartner(payload: PartnerCreatePayload): Promise<IPartner> {
  return apiClient.post<IPartner>('/partners', payload);
}

export async function updatePartner(
  id: string,
  payload: PartnerUpdatePayload,
): Promise<IPartner> {
  return apiClient.put<IPartner>(`/partners/${id}`, payload);
}

export async function deletePartner(id: string): Promise<void> {
  await apiClient.delete(`/partners/${id}`);
}

export function partnersMockList(): IPartner[] {
  return partnersMock.map((p, index) => ({
    ...p,
    id: p.id || `mock-partner-${index}`,
  }));
}

export const partnerApi = {
  list: listPartners,
  getById: getPartner,
  create: createPartner,
  update: updatePartner,
  delete: deletePartner,
  mock: partnersMockList,
};
