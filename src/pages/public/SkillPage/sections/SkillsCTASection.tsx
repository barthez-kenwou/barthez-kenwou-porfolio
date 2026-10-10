import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { trackContactClick, trackCtaClick } from '@/app/lib/analytics';

const CONTACT_FROM_SKILLS = '/contact?from=skills';

export const SkillsCTASection: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <section className="px-4 pb-0 pt-12 md:px-10 md:pt-16 lg:px-14">
      <div className="border-t border-border/60 pt-6 pb-0 sm:pt-8">
        <div className="flex items-start justify-between gap-3 sm:items-baseline sm:gap-6">
          <p className="min-w-0 text-[13px] font-semibold tracking-tight text-foreground sm:text-sm">
            {isFr
              ? 'Besoin de cette stack sur un produit réel ?'
              : 'Need this stack on a real product?'}
          </p>
          <Link
            to={CONTACT_FROM_SKILLS}
            onClick={() => {
              trackContactClick('skills_cta');
              trackCtaClick('contact', 'skills_cta', CONTACT_FROM_SKILLS);
            }}
            onMouseEnter={() => {
              void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
            }}
            onTouchStart={() => {
              void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
            }}
            className={cn(
              'group inline-flex shrink-0 items-center gap-0.5 pt-0.5',
              'text-[12px] font-medium text-primary sm:text-[13px]',
              'transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35',
            )}
          >
            {isFr ? 'En discuter' : 'Discuss it'}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <p className="mt-1.5 max-w-xl text-[11px] leading-relaxed text-foreground/70 sm:text-xs">
          {isFr
            ? 'Si ces compétences correspondent à votre contexte technique, échangeons sur le besoin.'
            : 'If these skills match your technical context, let us discuss the need.'}
        </p>
      </div>
    </section>
  );
};
