import { useMemo } from 'react';
import { useAdminCmsStore } from '@/features/admin-cms';
import type { ITestimonial } from '../model/testimonial.types';
import { isPublicTestimonial } from '../lib/isPublicTestimonial';

/**
 * Published testimonials for public pages.
 * Select raw array from the store, then filter in useMemo; never `.filter()` inside
 * the zustand selector (new array ref → infinite re-render loop).
 */
export function usePublicTestimonials(): ITestimonial[] {
  const testimonials = useAdminCmsStore((s) => s.testimonials);
  return useMemo(() => testimonials.filter(isPublicTestimonial), [testimonials]);
}
