import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/Button';
import { BrandAmbientField } from '@/shared/ui/BrandAmbientField';
import { cn } from '@/shared/lib/utils';
import {
  newsletterSubscribeSchema,
  subscribeNewsletter,
  type NewsletterSubscribeErrorCode,
} from '@/features/newsletter';
import { trackCtaClick, trackNewsletterSubscribe } from '@/app/lib/analytics';

type NewsletterCTAProps = {
  /** Channel (`blog`, `services`…) or omit when `blogSlug` is set. */
  source?: string;
  /** When set, signup source becomes `blog:{slug}` for contextual welcome. */
  blogSlug?: string;
  contactTo?: string;
  className?: string;
  sectionRef?: React.Ref<HTMLElement>;
};

function resolveSubscribeSource(source: string, blogSlug?: string): string {
  const slug = blogSlug?.trim();
  if (!slug) return source.slice(0, 96);
  return `blog:${slug}`.slice(0, 96);
}

type FormStatus = 'idle' | 'loading' | 'error';

function errorCopy(code: NewsletterSubscribeErrorCode, isFr: boolean) {
  switch (code) {
    case 'invalid_email':
      return isFr ? 'Adresse email invalide.' : 'Invalid email address.';
    case 'already_subscribed':
      return isFr ? 'Cette adresse est déjà inscrite.' : 'This address is already subscribed.';
    case 'rate_limited':
      return isFr
        ? 'Trop de tentatives. Réessayez dans un instant.'
        : 'Too many attempts. Please try again shortly.';
    case 'unavailable':
      return isFr
        ? 'Inscription temporairement indisponible. Réessayez bientôt.'
        : 'Signup temporarily unavailable. Please try again soon.';
    default:
      return isFr
        ? "Impossible de finaliser l'inscription. Réessayez."
        : 'Could not complete signup. Please try again.';
  }
}

export const NewsletterCTA: React.FC<NewsletterCTAProps> = ({
  source = 'blog',
  blogSlug,
  contactTo,
  className,
  sectionRef,
}) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const subscribeSource = resolveSubscribeSource(source, blogSlug);

  const [email, setEmail] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [status, setStatus] = React.useState<FormStatus>('idle');
  const [errorCode, setErrorCode] = React.useState<NewsletterSubscribeErrorCode | null>(null);

  const isLoading = status === 'loading';

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorCode(null);

    if (honeypot.trim()) {
      toast.success(isFr ? 'Inscription enregistrée' : 'Subscription recorded', {
        description: isFr
          ? 'Merci. Un email de bienvenue arrive sous peu.'
          : 'Thank you. A welcome email is on its way.',
      });
      setEmail('');
      setStatus('idle');
      return;
    }

    const parsed = newsletterSubscribeSchema.safeParse({
      email,
      locale: isFr ? 'fr' : 'en',
      source: subscribeSource,
    });

    if (!parsed.success) {
      setStatus('error');
      setErrorCode('invalid_email');
      return;
    }

    setStatus('loading');
    const result = await subscribeNewsletter(parsed.data);

    if (result.ok) {
      trackNewsletterSubscribe(subscribeSource, isFr ? 'fr' : 'en');
      toast.success(isFr ? 'Inscription enregistrée' : 'Subscription recorded', {
        description: isFr
          ? 'Merci. Un email de bienvenue arrive sous peu, puis une note par mois.'
          : 'Thank you. A welcome email is on its way, then one note per month.',
      });
      setEmail('');
      setStatus('idle');
      return;
    }

    setStatus('error');
    setErrorCode(result.code);
  };

  return (
    <section
      ref={sectionRef}
      className={cn('mb-0 px-4 md:px-10 lg:px-14', className)}
      aria-labelledby="newsletter-cta-title"
    >
      <div className="relative z-10 overflow-hidden rounded-sm border border-border">
        <BrandAmbientField intensity="soft" />
        <div className="relative z-10 mx-auto w-full p-3 text-center sm:p-3 md:p-4">
          <div className="mx-auto max-w-xl rounded-sm border border-border/50 bg-background/70 px-4 py-6 shadow-sm backdrop-blur-md dark:bg-background/55 sm:px-5 sm:py-6 md:px-6 md:py-7">
            <h3
              id="newsletter-cta-title"
              className="mb-2 font-heading text-base font-bold text-foreground sm:text-lg md:text-xl"
            >
              {isFr ? 'Notes techniques pour la prod' : 'Technical notes for production'}
            </h3>
            <form onSubmit={onSubmit} noValidate className="mx-auto max-w-md space-y-3">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="sr-only"
                aria-hidden
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
                <label className="sr-only" htmlFor={`newsletter-email-${subscribeSource}`}>
                  Email
                </label>
                <input
                  id={`newsletter-email-${subscribeSource}`}
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') {
                      setStatus('idle');
                      setErrorCode(null);
                    }
                  }}
                  placeholder={isFr ? 'Votre email professionnel' : 'Your work email'}
                  className={cn(
                    'min-w-0 flex-1 rounded-md border bg-background/90 px-3 py-2.5 text-sm text-foreground',
                    'border-border transition-colors placeholder:text-muted-foreground/70',
                    'focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                    status === 'error' && 'border-destructive/50',
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading || email.trim().length === 0}
                  className="h-auto shrink-0 px-4 py-2.5 text-sm font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isFr ? 'Envoi…' : 'Sending…'}
                    </>
                  ) : isFr ? (
                    "S'inscrire"
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </div>

              {status === 'error' && errorCode && (
                <p role="alert" className="text-[11px] font-medium text-destructive sm:text-xs">
                  {errorCopy(errorCode, isFr)}
                </p>
              )}
            </form>

            {contactTo && (
              <p className="mt-2 text-[12px] leading-relaxed text-foreground/85 sm:mt-2 sm:text-xs">
                {isFr ? 'Un besoin concret ? ' : 'A concrete need? '}
                <Link
                  to={contactTo}
                  onClick={() =>
                    trackCtaClick('contact', `newsletter_${subscribeSource}`, contactTo)
                  }
                  onMouseEnter={() => {
                    void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                  }}
                  onTouchStart={() => {
                    void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                  }}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {isFr ? 'Parlons-en' : "Let's talk"}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
