export type { ITestimonial } from './model/testimonial.types';
export {
  testimonialApi,
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type TestimonialListParams,
} from './api/testimonial.api';
export { usePublicTestimonials } from './hooks/usePublicTestimonials';
export {
  useAdminTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  usePublicTestimonialsQuery,
  usePublicTestimonialsPaginated,
} from './hooks/useTestimonials';
export { TestimonialSchema, type TestimonialInput } from './model/testimonial.schema';

export { StackedTestimonialsCarousel } from './ui/StackedTestimonialsCarousel';
