import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';

const CONTACT_FROM_SKILLS = '/contact?from=skills';

/**
 * Skills-page CTA: editorial strip, one action.
 * Intentionally quieter than About / Projects / Home CTA cards.
 */
export const SkillsCTASection: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <section className="px-4 pb-4 pt-10 md:px-10 md:pb-6 md:pt-14 lg:px-14">
      <div
        className={cn(
          'flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6',
          'sm:flex-row sm:items-center sm:gap-8',
        )}
      >
        <div className="min-w-0 max-w-xl">
          <p className="text-sm font-semibold tracking-tight text-foreground sm:text-[15px]">
            {isFr
              ? 'Besoin de cette stack sur un produit réel ?'
              : 'Need this stack on a real product?'}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
            {isFr
              ? 'Si ces compétences correspondent à votre contexte technique, échangeons sur le besoin, sans pitch inutile.'
              : 'If these skills match your technical context, let us discuss the need, no unnecessary pitch.'}
          </p>
        </div>

        <Link
          to={CONTACT_FROM_SKILLS}
          onMouseEnter={() => {
            void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
          }}
          onTouchStart={() => {
            void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
          }}
          className={cn(
            'group inline-flex shrink-0 items-center gap-1.5',
            'rounded-md border border-border/70 bg-card/40 px-3.5 py-2',
            'text-xs font-semibold text-foreground backdrop-blur-sm',
            'transition-[border-color,background-color,color] duration-300',
            'hover:border-primary/35 hover:bg-primary/8 hover:text-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
          )}
        >
          {isFr ? 'Échanger sur un besoin' : 'Discuss a need'}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </section>
  );
};
