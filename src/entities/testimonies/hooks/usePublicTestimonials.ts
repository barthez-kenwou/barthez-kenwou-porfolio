import { usePublicTestimonialsQuery } from './useTestimonials';

/** Published testimonials for public pages (API with mock fallback). */
export function usePublicTestimonials() {
  const { data } = usePublicTestimonialsQuery();
  return data?.data ?? [];
}
