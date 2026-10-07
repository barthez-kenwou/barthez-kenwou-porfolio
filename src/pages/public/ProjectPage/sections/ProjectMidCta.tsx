import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import type { IProject } from '@/entities/projets/model/project.types';

type ProjectMidCtaProps = {
  project: IProject;
};

function contactHref(title: string) {
  return `/contact?from=projects&article=${encodeURIComponent(title)}`;
}

function MidCtaShell({
  title,
  body,
  linkLabel,
  contactTo,
}: {
  title: string;
  body: string;
  linkLabel: string;
  contactTo: string;
}) {
  return (
    <section className="px-4 md:px-10 lg:px-14">
      <div className="border-y border-border/40 py-4 sm:py-5">
        <div className="flex items-start justify-between gap-3 sm:items-baseline sm:gap-6">
          <p className="min-w-0 text-[13px] font-semibold tracking-tight text-foreground sm:text-sm">
            {title}
          </p>
          <Link
            to={contactTo}
            onMouseEnter={() => {
              void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
            }}
            onTouchStart={() => {
              void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
            }}
            className={cn(
              'group inline-flex shrink-0 items-center gap-0.5 pt-0.5',
              'text-[12px] font-medium text-primary sm:text-[13px]',
              'underline-offset-4 transition-colors hover:underline',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35',
            )}
          >
            {linkLabel}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <p className="mt-1.5 max-w-xl text-[11px] leading-relaxed text-muted-foreground sm:mt-1 sm:text-xs">
          {body}
        </p>
      </div>
    </section>
  );
}

/** Mid CTA #1: after tech stack */
export const ProjectMidCta: React.FC<ProjectMidCtaProps> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const projectTitle = isFr ? project.titleFr : project.titleEn;

  return (
    <MidCtaShell
      title={isFr ? 'Cette approche technique vous parle ?' : 'Does this technical approach speak to you?'}
      body={
        isFr
          ? 'Si cette stack ou cette façon de livrer correspond à votre contexte, on peut en parler tout de suite.'
          : 'If this stack or delivery style matches your context, we can talk right away.'
      }
      linkLabel={isFr ? 'En discuter' : 'Discuss it'}
      contactTo={contactHref(projectTitle)}
    />
  );
};

/** Mid CTA #2: after before/after, before testimonial */
export const ProjectMidCta2: React.FC<ProjectMidCtaProps> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const projectTitle = isFr ? project.titleFr : project.titleEn;

  return (
    <MidCtaShell
      title={isFr ? 'Un résultat proche pour votre produit ?' : 'A similar outcome for your product?'}
      body={
        isFr
          ? 'Si ce niveau de transformation vous intéresse, démarrons un échange concret.'
          : 'If this level of transformation interests you, let us start a focused conversation.'
      }
      linkLabel={isFr ? 'Parlons-en' : "Let's talk"}
      contactTo={contactHref(projectTitle)}
    />
  );
};
