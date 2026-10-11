import type { ID } from '@/shared/types';

/**
 * Organization / structure that trusted a collaboration.
 * Shown as logo social proof on the homepage.
 */
export interface IPartner {
  id: ID;
  /** Organization display name */
  name: string;
  /** Logo image URL (uploaded or external) */
  logoUrl: string;
  /** Optional outbound link */
  websiteUrl?: string;
  /** Short context FR/EN (role of the collaboration) */
  descriptionFr?: string;
  descriptionEn?: string;
  /** Relation label FR/EN — e.g. Client, Employeur, Partenaire */
  relationFr?: string;
  relationEn?: string;
  /** When false, hidden from the public homepage strip */
  isPublished?: boolean;
  sortOrder?: number;
}

export type PartnerCreatePayload = Omit<IPartner, 'id'>;
export type PartnerUpdatePayload = Partial<PartnerCreatePayload>;
