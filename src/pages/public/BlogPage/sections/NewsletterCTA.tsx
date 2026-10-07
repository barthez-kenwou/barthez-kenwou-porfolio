import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/Button';
import { GradientDots } from '@/shared/ui/gradient-dots';
import { cn } from '@/shared/lib/utils';
import {
  newsletterSubscribeSchema,
  subscribeNewsletter,
  type NewsletterSubscribeErrorCode,
} from '@/features/newsletter';

type NewsletterCTAProps = {
  source?: string;
  contactTo?: string;
  className?: string;
};

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

function errorCopy(code: NewsletterSubscribeErrorCode, isFr: boolean) {
  switch (code) {
    case 'invalid_email':
      return isFr ? 'Adresse email invalide.' : 'Invalid email address.';
    case 'already_subscribed':
      return isFr
        ? 'Cette adresse est déjà inscrite.'
        : 'This address is already subscribed.';
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
  contactTo,
  className,
}) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  const [email, setEmail] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [status, setStatus] = React.useState<FormStatus>('idle');
  const [errorCode, setErrorCode] = React.useState<NewsletterSubscribeErrorCode | null>(
    null,
  );

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorCode(null);

    if (honeypot.trim()) {
      setStatus('success');
      setEmail('');
      return;
    }

    const parsed = newsletterSubscribeSchema.safeParse({
      email,
      locale: isFr ? 'fr' : 'en',
      source,
    });

    if (!parsed.success) {
      setStatus('error');
      setErrorCode('invalid_email');
      return;
    }

    setStatus('loading');
    const result = await subscribeNewsletter(parsed.data);

    if (result.ok) {
      setStatus('success');
      setEmail('');
      return;
    }

    setStatus('error');
    setErrorCode(result.code);
  };

  return (
    <section
      className={cn('mb-4 px-4 md:mb-2 md:px-10 lg:px-14', className)}
      aria-labelledby="newsletter-cta-title"
    >
      <div className="relative z-10 overflow-hidden rounded-sm border border-primary/25 shadow-[0_0_40px_-16px_hsla(268,52%,38%,0.35)]">
        <div className="absolute inset-0 z-0">
          <GradientDots duration={20} colorCycleDuration={4} />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/20 via-transparent to-background/35" />

        <div className="relative z-10 mx-auto w-full p-2 text-center sm:p-3 md:p-4">
          <div className="mx-auto max-w-xl rounded-sm border border-border/40 bg-background/55 px-4 py-2 shadow-sm backdrop-blur-md dark:bg-background/50 sm:px-4 sm:py-3">
            <h3
              id="newsletter-cta-title"
              className="mb-2 text-base font-bold text-foreground sm:text-lg md:text-xl"
            >
              {isFr ? 'Restez informé' : 'Stay informed'}
            </h3>
            <p className="mb-4 text-xs leading-relaxed text-muted-foreground sm:mb-5 sm:text-sm">
              {isFr
                ? 'Recevez les derniers articles et actualités directement dans votre boîte mail.'
                : 'Receive the latest articles and news directly in your inbox.'}
            </p>

            {isSuccess ? (
              <div
                role="status"
                className="mx-auto flex max-w-md items-start gap-2 rounded-md border border-primary/25 bg-primary/8 px-3 py-2.5 text-left"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-foreground sm:text-sm">
                    {isFr ? 'Inscription confirmée' : 'Subscription confirmed'}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                    {isFr
                      ? 'Merci, vous recevrez les prochaines notes techniques.'
                      : 'Thanks, you will receive the next technical notes.'}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mx-auto max-w-md space-y-2">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  aria-hidden
                />

                <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                  <label className="sr-only" htmlFor={`newsletter-email-${source}`}>
                    Email
                  </label>
                  <input
                    id={`newsletter-email-${source}`}
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
                    placeholder="Email"
                    className={cn(
                      'min-w-0 flex-1 rounded-md border bg-background/90 px-3 py-2 text-sm text-foreground',
                      'border-border transition-colors placeholder:text-muted-foreground/70',
                      'focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                      'disabled:cursor-not-allowed disabled:opacity-60',
                      status === 'error' && 'border-destructive/50',
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || email.trim().length === 0}
                    className="h-auto shrink-0 px-4 py-2 text-sm font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isFr ? 'Envoi…' : 'Sending…'}
                      </>
                    ) : isFr ? (
                      "S'abonner"
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
            )}

            {contactTo && (
              <p className="mt-4 text-[11px] text-muted-foreground sm:text-xs">
                {isFr ? 'Un besoin concret ? ' : 'A concrete need? '}
                <Link
                  to={contactTo}
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
