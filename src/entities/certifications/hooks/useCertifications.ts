import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, withPublicFallback, type PaginatedData, type ResourceResult } from '@/shared/api';
import { paginateMock } from '@/shared/api/http';
import { certifications } from '../api/mocks/certifications.mocks';
import {
  createCertification,
  deleteCertification,
  listCertifications,
  updateCertification,
  type CertificationListParams,
  type ICertificationDto,
} from '../api/certification.api';

const PUBLIC_LIST: CertificationListParams = { limit: 100, isPublished: true };

function mockCertificationsDto(): ICertificationDto[] {
  return certifications.map((item, index) => ({
    ...item,
    id: `mock-cert-${index}`,
    isPublished: true,
    sortOrder: index,
  }));
}

export function usePublicCertifications() {
  return useQuery({
    queryKey: queryKeys.certifications.list({ public: true }),
    queryFn: async (): Promise<ResourceResult<PaginatedData<ICertificationDto>>> =>
      withPublicFallback(
        () => listCertifications(PUBLIC_LIST),
        () => paginateMock(mockCertificationsDto()),
      ),
  });
}

export function useAdminCertifications(params?: CertificationListParams) {
  return useQuery({
    queryKey: queryKeys.certifications.list({ admin: true, ...params }),
    queryFn: () => listCertifications({ limit: 100, includeUnpublished: true, ...params }),
  });
}

export function useCreateCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certifications.all });
    },
  });
}

export function useUpdateCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ICertificationDto> }) =>
      updateCertification(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certifications.all });
    },
  });
}

export function useDeleteCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certifications.all });
    },
  });
}
