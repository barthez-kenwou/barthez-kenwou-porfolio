import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';
import { services as servicesMock } from './mock/services.mocks';

export const SERVICE_ICON_KEYS = ['cloud', 'server', 'code', 'shield', 'bolt', 'academic'] as const;

export type ServiceIconKey = (typeof SERVICE_ICON_KEYS)[number];

export interface IServiceDto {
  id: string;
  iconKey: string;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  featuresFr: string[];
  featuresEn: string[];
  priceEur: number;
  hourly: boolean;
  priceFr: string;
  priceEn: string;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface ServiceListParams extends PaginationParams {
  isPublished?: boolean;
  includeUnpublished?: boolean;
}

export function mapServicesMockToDto(): IServiceDto[] {
  return servicesMock.map((service, index) => ({
    id: `mock-svc-${index}`,
    iconKey: SERVICE_ICON_KEYS[index % SERVICE_ICON_KEYS.length],
    titleFr: service.titleFr,
    titleEn: service.titleEn,
    descFr: service.descFr,
    descEn: service.descEn,
    featuresFr: [...service.featuresFr],
    featuresEn: [...service.featuresEn],
    priceEur: service.priceEur,
    hourly: service.hourly,
    priceFr: service.priceFr,
    priceEn: service.priceEn,
    isPublished: true,
    sortOrder: index,
  }));
}

export async function listServices(params?: ServiceListParams): Promise<PaginatedData<IServiceDto>> {
  return apiClient.get<PaginatedData<IServiceDto>>('/services', toQueryParams(params));
}

export async function getService(id: string): Promise<IServiceDto> {
  return apiClient.get<IServiceDto>(`/services/${id}`);
}

export async function createService(payload: Omit<IServiceDto, 'id'>): Promise<IServiceDto> {
  return apiClient.post<IServiceDto>('/services', payload);
}

export async function updateService(id: string, payload: Partial<IServiceDto>): Promise<IServiceDto> {
  return apiClient.put<IServiceDto>(`/services/${id}`, payload);
}

export async function deleteService(id: string): Promise<void> {
  await apiClient.delete(`/services/${id}`);
}

export const servicesApi = {
  list: listServices,
  getById: getService,
  create: createService,
  update: updateService,
  delete: deleteService,
  mockToDto: mapServicesMockToDto,
};
