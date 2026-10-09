import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, withPublicFallback, type PaginatedData, type ResourceResult } from '@/shared/api';
import { paginateMock } from '@/shared/api/http';
import { testimonials as testimonialsMock } from '../api/mocks/testimonials.mocks';
import { isPublicTestimonial } from '../lib/isPublicTestimonial';
import {
  approveTestimonial,
  createTestimonial,
  deleteTestimonial,
  listTestimonials,
  rejectTestimonial,
  submitPublicTestimonial,
  updateTestimonial,
  type TestimonialListParams,
} from '../api/testimonial.api';
import type { ITestimonial } from '../model/testimonial.types';

const PUBLIC_LIST: TestimonialListParams = { limit: 100, isPublished: true };

function filterPublicItems(items: ITestimonial[]): ITestimonial[] {
  return items.filter(isPublicTestimonial);
}

export function useAdminTestimonials(params?: TestimonialListParams) {
  return useQuery({
    queryKey: queryKeys.testimonials.list({ admin: true, ...params }),
    queryFn: () => listTestimonials({ limit: 100, includeUnpublished: true, ...params }),
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.public });
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ITestimonial> }) =>
      updateTestimonial(String(id), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.public });
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.public });
    },
  });
}

function invalidateTestimonials(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.all });
  void queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.public });
  void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
}

export function useApproveTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveTestimonial(id),
    onSuccess: () => invalidateTestimonials(queryClient),
  });
}

export function useRejectTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rejectTestimonial(id),
    onSuccess: () => invalidateTestimonials(queryClient),
  });
}

export function useSubmitPublicTestimonial() {
  return useMutation({
    mutationFn: submitPublicTestimonial,
  });
}

export function usePublicTestimonialsQuery() {
  return useQuery({
    queryKey: queryKeys.testimonials.public,
    queryFn: async (): Promise<ResourceResult<ITestimonial[]>> => {
      const result = await withPublicFallback(
        async () => {
          const page = await listTestimonials(PUBLIC_LIST);
          return filterPublicItems(page.items);
        },
        () => filterPublicItems(testimonialsMock as ITestimonial[]),
      );
      return result;
    },
  });
}

export function usePublicTestimonialsPaginated() {
  return useQuery({
    queryKey: queryKeys.testimonials.list({ public: true }),
    queryFn: async (): Promise<ResourceResult<PaginatedData<ITestimonial>>> => {
      const result = await withPublicFallback(
        () => listTestimonials(PUBLIC_LIST),
        () => paginateMock(testimonialsMock as ITestimonial[]),
      );
      return {
        ...result,
        data: {
          ...result.data,
          items: filterPublicItems(result.data.items),
          totalItems: filterPublicItems(result.data.items).length,
        },
      };
    },
  });
}
