import { z } from 'zod';

export const newsletterSubscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'invalid_email' })
    .max(254),
  locale: z.enum(['fr', 'en']),
  source: z.string().trim().min(1).max(64).optional(),
});

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
