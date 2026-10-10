import type { ID } from '@/shared/types';

export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface ITestimonial {
  id: ID;
  rating: number;
  textFr: string;
  textEn: string;
  nameFr: string;
  nameEn: string;
  roleFr: string;
  roleEn: string;
  company?: string;
  email?: string;
  /** Public visibility on the site (after owner approval). */
  isPublished?: boolean;
  status?: TestimonialStatus;
  projectId?: string | null;
  createdAt?: string;
  source?: 'admin' | 'public-form';
}
