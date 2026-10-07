import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/Button/Button.ui';
import { SEO } from '@/shared/ui/SEO/SEO';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { AmbientFlareBackdrop } from '@/shared/ui/AmbientFlareBackdrop';

const ILLUSTRATION_404 = '/images/404-illustration.png';

export const NotFoundPage: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const [flareReady, setFlareReady] = useState(false);

  const title = isFr ? 'Page non trouvée' : 'Page not found';
  const lead = isFr
    ? 'Désolé, la page demandée n’existe pas ou a été déplacée.'
    : 'Sorry, the page you requested doesn’t exist or has been moved.';
  const homeLabel = isFr ? "Retour à l'accueil" : 'Back to home';
  const backLabel = isFr ? 'Retour' : 'Go back';

  return (
    <>
      <SEO noIndex title={title} description={lead} />

      <div className="relative flex w-full flex-1 items-center justify-center overflow-hidden min-h-[calc(100svh-4rem)] md:min-h-[calc(100svh-5rem)] px-4 pt-24">
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
              'px-3 py-6 sm:px-2 sm:py-6',
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-white/5 to-transparent"
            />

            <div className="relative flex flex-col items-center text-center">
              <img
                src={ILLUSTRATION_404}
                alt="404"
                width={266}
                height={189}
                decoding="async"
                className="mb-1 h-auto w-[min(100%,14rem)] select-none drop-shadow-[0_12px_28px_hsla(268,52%,40%,0.35)]"
              />

              <h1 className="mb-2 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {title}
              </h1>

              <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">{lead}</p>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <Button asChild className="gap-2">
                  <Link to="/">
                    <Home className="size-3.5" />
                    {homeLabel}
                  </Link>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 border-white/20 bg-background/30 backdrop-blur-sm"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="size-3.5" />
                  {backLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
