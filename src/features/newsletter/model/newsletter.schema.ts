import { z } from 'zod';

export const newsletterSubscribeSchema = z.object({
  email: z.string().trim().email({ message: 'invalid_email' }).max(254),
  locale: z.enum(['fr', 'en']),
  /** Channel or `blog:{slug}` when signup is from an article page. */
  source: z.string().trim().min(1).max(96).optional(),
});

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
