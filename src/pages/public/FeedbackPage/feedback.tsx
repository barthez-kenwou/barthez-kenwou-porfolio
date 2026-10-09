import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlinePaperAirplane } from 'react-icons/hi2';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/form';
import { FloatingFillField } from '@/entities/contact/ui/FloatingFillField.ui';
import { useSubmitPublicTestimonial } from '@/entities/testimonies/hooks/useTestimonials';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { SEO } from '@/shared/ui/SEO/SEO';
import { cn } from '@/shared/lib/utils';

const feedbackSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  role: z.string().min(2),
  rating: z.string().regex(/^[1-5]$/),
  message: z.string().min(20),
});

type FeedbackValues = z.infer<typeof feedbackSchema>;

export function FeedbackPage() {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const submitFeedback = useSubmitPublicTestimonial();
  const [done, setDone] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const form = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      role: '',
      rating: '5',
      message: '',
    },
  });

  const onSubmit = async (values: FeedbackValues) => {
    const rating = Math.min(5, Math.max(1, Number(values.rating) || 5));
    setSubmitError(null);
    try {
      await submitFeedback.mutateAsync({
        nameFr: values.name,
        nameEn: values.name,
        roleFr: values.role,
        roleEn: values.role,
        textFr: values.message,
        textEn: values.message,
        rating,
        company: values.company || '',
        email: values.email,
      });
      setDone(true);
      form.reset({
        name: '',
        email: '',
        company: '',
        role: '',
        rating: '5',
        message: '',
      });
    } catch {
      setSubmitError(
        fr
          ? "Impossible d'envoyer l'avis pour le moment. Réessaie plus tard."
          : 'Unable to submit feedback right now. Please try again later.',
      );
    }
  };

  return (
    <>
      <SEO
        path="/feedback"
        title={fr ? 'Laisser un avis' : 'Leave feedback'}
        description={
          fr
            ? 'Partage ton expérience de collaboration avec Barthez Kenwou.'
            : 'Share your collaboration experience with Barthez Kenwou.'
        }
        noIndex
      />

      <div className="relative min-h-[80vh] overflow-hidden px-4 py-16 md:px-10 md:py-24 lg:px-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_0%,hsl(var(--primary)/0.12),transparent_55%),radial-gradient(ellipse_at_90%_30%,hsl(var(--muted-foreground)/0.06),transparent_50%)]"
        />

        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
          <div className="space-y-5 pt-1 lg:sticky lg:top-28">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {fr ? 'Vitrine client' : 'Client showcase'}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {fr ? 'Ton retour compte.' : 'Your words matter.'}
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {fr
                ? 'Quelques lignes sur la collaboration. Après validation, ton témoignage pourra apparaître sur le portfolio.'
                : 'A few lines about the collaboration. After review, your testimonial may appear on the portfolio.'}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 md:p-8">
            {done ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[300px] flex-col items-center justify-center gap-3 px-2 text-center"
              >
                <HiOutlineCheckCircle className="size-11 text-primary" />
                <p className="text-lg font-medium tracking-tight">
                  {fr ? 'Merci, reçu.' : 'Thank you, received.'}
                </p>
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {fr
                    ? 'Ton avis est en revue. Il ne sera public qu’après validation.'
                    : 'Your feedback is under review. It goes public only after approval.'}
                </p>
                <Button variant="outline" className="mt-3" onClick={() => setDone(false)}>
                  {fr ? 'En envoyer un autre' : 'Send another'}
                </Button>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingFillField
                            label={fr ? 'Nom complet' : 'Full name'}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            invalid={!!form.formState.errors.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FloatingFillField
                              label="Email"
                              type="email"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              invalid={!!form.formState.errors.email}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FloatingFillField
                              label={fr ? 'Entreprise' : 'Company'}
                              value={field.value || ''}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingFillField
                            label={fr ? 'Titre / rôle' : 'Title / role'}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            invalid={!!form.formState.errors.role}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-2 pt-1">
                          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                            {fr ? 'Note' : 'Rating'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(['1', '2', '3', '4', '5'] as const).map((n) => {
                              const active = field.value === n;
                              return (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => field.onChange(n)}
                                  className={cn(
                                    'flex size-10 items-center justify-center rounded-lg border text-sm font-semibold tabular-nums transition-colors',
                                    active
                                      ? 'border-primary/50 bg-primary/15 text-primary'
                                      : 'border-border/70 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground',
                                  )}
                                  aria-pressed={active}
                                  aria-label={`${n}/5`}
                                >
                                  {n}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingFillField
                            label={fr ? 'Ton témoignage' : 'Your testimonial'}
                            multiline
                            rows={6}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            invalid={!!form.formState.errors.message}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {submitError ? (
                    <p className="text-sm text-destructive" role="alert">
                      {submitError}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    className="mt-2 w-full gap-2 sm:w-auto"
                    disabled={form.formState.isSubmitting || submitFeedback.isPending}
                  >
                    <HiOutlinePaperAirplane className="size-4" />
                    {fr ? 'Envoyer pour validation' : 'Submit for review'}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
