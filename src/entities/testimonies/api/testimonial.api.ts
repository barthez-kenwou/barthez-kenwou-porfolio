import { apiClient, type PaginatedData, type PaginationParams, toQueryParams } from '@/shared/api';
import type { ITestimonial, TestimonialStatus } from '../model/testimonial.types';

export interface TestimonialListParams extends PaginationParams {
  isPublished?: boolean;
  status?: TestimonialStatus;
  includeUnpublished?: boolean;
}

export async function listTestimonials(
  params?: TestimonialListParams,
): Promise<PaginatedData<ITestimonial>> {
  return apiClient.get<PaginatedData<ITestimonial>>('/testimonials', toQueryParams(params));
}

export async function getTestimonial(id: string): Promise<ITestimonial> {
  return apiClient.get<ITestimonial>(`/testimonials/${id}`);
}

export async function createTestimonial(payload: Omit<ITestimonial, 'id'>): Promise<ITestimonial> {
  return apiClient.post<ITestimonial>('/testimonials', payload);
}

export async function updateTestimonial(
  id: string,
  payload: Partial<ITestimonial>,
): Promise<ITestimonial> {
  return apiClient.put<ITestimonial>(`/testimonials/${id}`, payload);
}

export async function deleteTestimonial(id: string): Promise<void> {
  await apiClient.delete(`/testimonials/${id}`);
}

export async function submitPublicTestimonial(
  payload: Omit<ITestimonial, 'id' | 'status' | 'isPublished' | 'source'>,
): Promise<ITestimonial> {
  return apiClient.post<ITestimonial>('/testimonials/feedback', payload);
}

export async function approveTestimonial(id: string): Promise<ITestimonial> {
  return apiClient.patch<ITestimonial>(`/testimonials/${id}/approve`);
}

export async function rejectTestimonial(id: string): Promise<ITestimonial> {
  return apiClient.patch<ITestimonial>(`/testimonials/${id}/reject`);
}

export const testimonialApi = {
  list: listTestimonials,
  getById: getTestimonial,
  create: createTestimonial,
  update: updateTestimonial,
  delete: deleteTestimonial,
  submitPublic: submitPublicTestimonial,
  approve: approveTestimonial,
  reject: rejectTestimonial,
};
