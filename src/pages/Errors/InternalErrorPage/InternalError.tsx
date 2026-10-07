import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, MessageCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button/Button.ui';
import { SEO } from '@/shared/ui/SEO/SEO';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { contactsInfo } from '@/shared/mocks/constContactInfo.mocks';
import { cn } from '@/shared/lib/utils';
import { AmbientFlareBackdrop } from '@/shared/ui/AmbientFlareBackdrop';

export interface InternalErrorPageProps {
  error?: Error;
  errorId?: string;
  /**
   * `content` - sits inside the public shell (navbar / aside / footer stay).
   * `fullscreen` - last-resort when the shell itself crashed.
   */
  variant?: 'content' | 'fullscreen';
}

export const InternalErrorPage: React.FC<InternalErrorPageProps> = ({
  error,
  errorId,
  variant = 'content',
}) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const [flareReady, setFlareReady] = useState(false);

  const title = isFr ? 'Une erreur est survenue' : 'Something went wrong';
  const lead = isFr
    ? 'Impossible d’afficher cette page. Tu peux rafraîchir ou naviguer ailleurs.'
    : 'This page couldn’t load. Refresh, or navigate elsewhere.';
  const refreshLabel = isFr ? 'Rafraîchir' : 'Refresh';
  const contactLabel = isFr ? 'Me contacter' : 'Contact me';

  const errorLabel =
    error?.name && error.name !== 'Error' ? `${error.name}: ${error.message}` : error?.message;

  return (
    <>
      <SEO noIndex path="/server-error" title={isFr ? 'Erreur' : 'Error'} description={lead} />

      <div
        className={cn(
          'relative flex w-full flex-1 items-center justify-center overflow-hidden',
          variant === 'fullscreen'
            ? 'min-h-screen bg-background px-4'
            : 'min-h-[calc(100svh-4rem)] md:min-h-[calc(100svh-5rem)] px-4 py-12',
        )}
      >
        <AmbientFlareBackdrop intensity="strong" onReady={() => setFlareReady(true)} />

        <div
          className={cn(
            'relative z-10 w-full max-w-md transition-all duration-500',
            flareReady
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none',
          )}
        >
          <div
            className={cn(
              'relative overflow-hidden rounded-md',
              'border border-white/15 dark:border-white/10',
              'bg-background/45 dark:bg-background/35',
              'backdrop-blur-xl backdrop-saturate-150',
              'shadow-[0_8px_40px_-12px_rgba(0,0,0,0.45),0_0_0_1px_hsla(268,52%,50%,0.12)]',
              'px-5 py-8 sm:px-7 sm:py-9',
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-white/5 to-transparent"
            />

            <div className="relative flex flex-col items-center text-center">
              <div className="mb-4 flex size-11 items-center justify-center rounded-md border border-primary/30 bg-primary/15 text-primary backdrop-blur-sm">
                <AlertTriangle className="size-5" aria-hidden />
              </div>

              <h1 className="mb-2 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {title}
              </h1>

              <p className="mb-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{lead}</p>

              {errorLabel && (
                <div className="mb-5 w-full rounded-md border border-border/40 bg-background/40 px-3 py-2.5 text-left backdrop-blur-sm">
                  <p className="break-words font-mono text-[11px] leading-relaxed text-foreground/85 whitespace-pre-wrap">
                    {errorLabel}
                  </p>
                  {errorId && (
                    <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">{errorId}</p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <Button type="button" className="gap-2" onClick={() => window.location.reload()}>
                  <RefreshCw className="size-3.5" />
                  {refreshLabel}
                </Button>

                {contactsInfo.whatsappLink && (
                  <Button
                    asChild
                    variant="outline"
                    className="gap-2 border-white/20 bg-background/30 backdrop-blur-sm"
                  >
                    <a href={contactsInfo.whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="size-3.5" />
                      {contactLabel}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
