import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlinePaperAirplane } from 'react-icons/hi2';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/form';
import { FloatingFillField } from '@/entities/contact/ui/FloatingFillField.ui';
import {
  usePublicTestimonialsQuery,
  useSubmitPublicTestimonial,
} from '@/entities/testimonies/hooks/useTestimonials';
import { StackedTestimonialsCarousel } from '@/entities/testimonies/ui/StackedTestimonialsCarousel';
import { usePublicProjects } from '@/entities/projets/hooks/useProjects';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { SEO } from '@/shared/ui/SEO/SEO';
import { QueryState } from '@/shared/ui/QueryState';
import { Ripple } from '@/shared/ui/ripple';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { cn } from '@/shared/lib/utils';

const NO_PROJECT = '__none__';

const feedbackSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  role: z.string().min(2),
  projectId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  message: z.string().min(20),
});

type FeedbackValues = z.infer<typeof feedbackSchema>;

function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn('size-6 sm:size-7 transition-colors duration-150', className)}
    >
      <path
        d="M12 2.75l2.72 5.51 6.08.88-4.4 4.29 1.04 6.06L12 16.72l-5.44 2.86 1.04-6.06-4.4-4.29 6.08-.88L12 2.75z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarRating({
  value,
  onChange,
  label,
  fr,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  fr: boolean;
}) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div
      className="space-y-1"
      onMouseLeave={() => setHovered(null)}
      role="group"
      aria-label={label}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <p className="text-xs tabular-nums text-muted-foreground">{display}/5</p>
      </div>
      <div className="flex items-center gap-0.5 sm:gap-1">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= display;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              onMouseEnter={() => setHovered(n)}
              onFocus={() => setHovered(n)}
              onBlur={() => setHovered(null)}
              className={cn(
                'flex size-10 cursor-pointer items-center justify-center rounded-sm transition-transform duration-150 sm:size-11',
                'hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                active ? 'text-primary' : 'text-muted-foreground/45 hover:text-muted-foreground/70',
              )}
              aria-label={fr ? `${n} étoile${n > 1 ? 's' : ''}` : `${n} star${n > 1 ? 's' : ''}`}
              aria-pressed={value === n}
            >
              <StarIcon filled={active} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FeedbackPage() {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const submitFeedback = useSubmitPublicTestimonial();
  const projectsQuery = usePublicProjects();
  const testimonialsQuery = usePublicTestimonialsQuery();
  const testimonials = testimonialsQuery.data?.data ?? [];
  const [done, setDone] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const projectItems = projectsQuery.data?.data.items ?? [];
  const projects = projectItems
    .filter((p) => p.isPublished !== false)
    .slice()
    .sort((a, b) => {
      const ta = fr ? a.titleFr : a.titleEn;
      const tb = fr ? b.titleFr : b.titleEn;
      return ta.localeCompare(tb, fr ? 'fr' : 'en');
    });

  const form = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      role: '',
      projectId: '',
      rating: 5,
      message: '',
    },
  });

  const onSubmit = async (values: FeedbackValues) => {
    const rating = Math.min(5, Math.max(1, values.rating || 5));
    const projectId = values.projectId?.trim() ? values.projectId.trim() : null;
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
        projectId,
      });
      setDone(true);
      form.reset({
        name: '',
        email: '',
        company: '',
        role: '',
        projectId: '',
        rating: 5,
        message: '',
      });
    } catch {
      setSubmitError(
        fr
          ? "Impossible d'envoyer l'avis pour le moment. Réessayez plus tard."
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
            ? 'Partagez votre expérience de collaboration avec Barthez Kenwou.'
            : 'Share your collaboration experience with Barthez Kenwou.'
        }
        noIndex
      />

      <div className="relative min-h-[80vh] pb-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_0%,hsl(var(--primary)/0.08),transparent_55%),radial-gradient(ellipse_at_90%_30%,hsl(var(--muted-foreground)/0.04),transparent_50%)]"
        />

        {/* Same top inset as other public pages — clears fixed MobileNavbar / Navbar. */}
        <section className="relative overflow-hidden px-4 pt-50 md:px-10 lg:px-14">
          {/* Mobile hero ripple — staged in the upper band (behind title), not mid-form */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[min(420px,52svh)] overflow-hidden lg:hidden"
            aria-hidden
          >
            <Ripple
              mainCircleSize={190}
              mainCircleOpacity={0.34}
              numCircles={7}
              className="inset-x-0 top-0 bottom-auto h-[78%]"
            />
          </div>

          <div className="relative z-10 mx-auto grid max-w-5xl gap-5 sm:gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-10">
            <header className="space-y-2 text-center lg:sticky lg:top-28 lg:text-left">
              <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {fr ? 'Votre retour compte.' : 'Your words matter.'}
              </h1>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground lg:mx-0">
                {fr
                  ? 'Quelques lignes sur la collaboration. Après validation, votre témoignage pourra apparaître sur le portfolio.'
                  : 'A few lines about the collaboration. After review, your testimonial may appear on the portfolio.'}
              </p>
            </header>

            <div className="rounded-md border border-border/60 bg-card p-4 sm:p-5 md:p-6">
            {done ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-56 flex-col items-center justify-center gap-2.5 px-2 text-center"
              >
                <HiOutlineCheckCircle className="size-10 text-primary" />
                <p className="text-lg font-medium tracking-tight">
                  {fr ? 'Merci, reçu.' : 'Thank you, received.'}
                </p>
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {fr
                    ? 'Votre avis est en revue. Il ne sera public qu’après validation.'
                    : 'Your feedback is under review. It goes public only after approval.'}
                </p>
                <Button variant="outline" className="mt-2" onClick={() => setDone(false)}>
                  {fr ? 'En envoyer un autre' : 'Send another'}
                </Button>
              </motion.div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3 sm:space-y-3.5"
                  noValidate
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="gap-1">
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

                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="gap-1">
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
                        <FormItem className="gap-1">
                          <FormControl>
                            <FloatingFillField
                              label={fr ? 'Entreprise (optionnel)' : 'Company (optional)'}
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
                      <FormItem className="gap-1">
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
                    name="projectId"
                    render={({ field }) => (
                      <FormItem className="gap-1.5">
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          {fr ? 'Projet concerné' : 'Related project'}
                          <span className="ml-1.5 normal-case tracking-normal text-muted-foreground/70">
                            ({fr ? 'optionnel' : 'optional'})
                          </span>
                        </p>
                        <Select
                          value={field.value?.trim() ? field.value : NO_PROJECT}
                          onValueChange={(v) => field.onChange(v === NO_PROJECT ? '' : v)}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 w-full cursor-pointer rounded-sm border-border/55 bg-transparent px-3 text-left text-sm">
                              <SelectValue
                                placeholder={
                                  fr ? 'Aucun projet spécifique' : 'No specific project'
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-w-[min(100vw-2rem,28rem)]">
                            <SelectItem value={NO_PROJECT}>
                              {fr ? 'Aucun projet spécifique' : 'No specific project'}
                            </SelectItem>
                            {projects.map((p) => (
                              <SelectItem
                                key={String(p.id)}
                                value={String(p.id)}
                                className="whitespace-normal"
                              >
                                {fr ? p.titleFr : p.titleEn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem className="gap-1 border-t border-border/40 pt-3">
                        <StarRating
                          value={field.value}
                          onChange={field.onChange}
                          label={fr ? 'Note' : 'Rating'}
                          fr={fr}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="gap-1">
                        <FormControl>
                          <FloatingFillField
                            label={fr ? 'Votre témoignage' : 'Your testimonial'}
                            multiline
                            rows={5}
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

                  <div className="flex justify-end pt-1">
                    <Button
                      type="submit"
                      className="h-11 w-full cursor-pointer gap-2 sm:w-auto sm:min-w-44"
                      disabled={form.formState.isSubmitting || submitFeedback.isPending}
                    >
                      <HiOutlinePaperAirplane className="size-4" />
                      {fr ? 'Envoyer pour validation' : 'Submit for review'}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
          </div>
        </section>

        {!testimonialsQuery.isPending &&
        !testimonialsQuery.isError &&
        testimonials.length === 0 ? null : (
          <section className="relative z-10 mx-auto mt-10 max-w-7xl overflow-hidden px-4 pb-10 md:mt-14 md:px-10 md:pb-14 lg:px-14">
            <div className="mb-6 text-center md:mb-8">
              <h2 className="section-title">
                <span className="font-heading text-foreground">
                  {fr ? 'Autres témoignages' : 'Other testimonials'}
                </span>
              </h2>
            </div>
            <div className="mx-auto flex w-full justify-center">
              <QueryState
                isPending={testimonialsQuery.isPending}
                isError={testimonialsQuery.isError}
                errorMessage={
                  testimonialsQuery.error instanceof Error
                    ? testimonialsQuery.error.message
                    : undefined
                }
                source={testimonialsQuery.data?.source}
                empty={!testimonialsQuery.isPending && testimonials.length === 0}
              >
                <StackedTestimonialsCarousel testimonials={testimonials} />
              </QueryState>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
