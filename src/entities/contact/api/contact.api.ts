import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';
import type {
  ContactResponseStatus,
  IContactInfo,
  IContactResponse,
} from '@/features/admin-cms/model/cms.types';
import type { ContactFormValues } from '../model/contact.schema';
import { contactsInfo } from '@/shared/mocks/constContactInfo.mocks';

export interface ContactResponseListParams extends PaginationParams {
  status?: ContactResponseStatus;
}

export async function getContactInfo(): Promise<IContactInfo> {
  return apiClient.get<IContactInfo>('/contact-infos');
}

export async function updateContactInfo(payload: IContactInfo): Promise<IContactInfo> {
  return apiClient.put<IContactInfo>('/contact-infos', payload);
}

export async function submitContactResponse(
  payload: ContactFormValues,
): Promise<IContactResponse> {
  return apiClient.post<IContactResponse>('/contact-responses', payload);
}

export async function listContactResponses(
  params?: ContactResponseListParams,
): Promise<PaginatedData<IContactResponse>> {
  return apiClient.get<PaginatedData<IContactResponse>>(
    '/contact-responses',
    toQueryParams(params),
  );
}

export async function getContactResponse(id: string): Promise<IContactResponse> {
  return apiClient.get<IContactResponse>(`/contact-responses/${id}`);
}

export async function updateContactResponse(
  id: string,
  payload: Partial<IContactResponse>,
): Promise<IContactResponse> {
  return apiClient.patch<IContactResponse>(`/contact-responses/${id}`, payload);
}

export async function deleteContactResponse(id: string): Promise<void> {
  await apiClient.delete(`/contact-responses/${id}`);
}

export function contactInfoMock(): IContactInfo {
  return { ...contactsInfo };
}

export const contactApi = {
  getInfo: getContactInfo,
  updateInfo: updateContactInfo,
  submit: submitContactResponse,
  listResponses: listContactResponses,
  getResponse: getContactResponse,
  updateResponse: updateContactResponse,
  deleteResponse: deleteContactResponse,
  mockInfo: contactInfoMock,
};
