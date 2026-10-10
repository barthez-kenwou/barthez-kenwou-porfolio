export interface IBlog {
  id: string;
  slug?: string;
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  contentFr: string;
  contentEn: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
  /** When false, hidden from the public blog listing. */
  isPublished?: boolean;
  /** Cumulative public reads — drives the “most read” hero slot. */
  viewCount?: number;
  /**
   * Optional admin pin for the listing hero.
   * When unset, the hero falls back to the highest `viewCount`.
   */
  isFeatured?: boolean;
}
