import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { trackContactClick, trackCtaClick } from '@/app/lib/analytics';
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
  location,
}: {
  title: string;
  body: string;
  linkLabel: string;
  contactTo: string;
  location: string;
}) {
  return (
    <section className="px-4 md:px-10 lg:px-14">
      <div className="border-y border-border/40 py-5 sm:py-6">
        <div className="flex items-start justify-between gap-4 sm:items-baseline sm:gap-8">
          <p className="min-w-0 font-heading text-sm font-semibold tracking-tight text-foreground sm:text-[15px]">
            {title}
          </p>
          <Link
            to={contactTo}
            onClick={() => {
              trackContactClick(location);
              trackCtaClick('contact', location, contactTo);
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
              'underline-offset-4 hover:underline',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35',
            )}
          >
            {linkLabel}
            <ArrowUpRight className="h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <p className="mt-2 max-w-xl text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]">
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
      title={
        isFr
          ? 'Une livraison dans cette veine vous serait utile ?'
          : 'Could a delivery like this help you?'
      }
      body={
        isFr
          ? 'Si votre produit demande le même niveau d’exécution, écrivez-moi — on regarde ensemble ce qui est réaliste.'
          : 'If your product needs the same level of execution, write me — we’ll look at what’s realistic.'
      }
      linkLabel={isFr ? 'Écrire' : 'Write me'}
      contactTo={contactHref(projectTitle)}
      location="project_mid_cta_1"
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
      title={
        isFr
          ? 'Un résultat comparable pour votre produit ?'
          : 'A comparable outcome for your product?'
      }
      body={
        isFr
          ? 'On peut en parler sans pitch : contexte, contraintes, et ce qui vaut vraiment le coup de construire.'
          : 'We can talk without the pitch: context, constraints, and what’s actually worth building.'
      }
      linkLabel={isFr ? 'Parler du besoin' : 'Talk it through'}
      contactTo={contactHref(projectTitle)}
      location="project_mid_cta_2"
    />
  );
};
