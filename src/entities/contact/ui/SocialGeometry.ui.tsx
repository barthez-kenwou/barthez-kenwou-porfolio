import React from 'react';
import { FaGithub, FaLinkedin, FaFacebookF } from 'react-icons/fa6';
import { cn } from '@/shared/lib/utils';
import { contactsInfo } from '@/shared/mocks/constContactInfo.mocks';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

const networks = [
  {
    id: 'github',
    label: 'GitHub',
    href: () => contactsInfo.github,
    Icon: FaGithub,
    shape: 'square' as const,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: () => contactsInfo.linkedin,
    Icon: FaLinkedin,
    shape: 'diamond' as const,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: () => contactsInfo.facebook,
    Icon: FaFacebookF,
    shape: 'circle' as const,
  },
];

/**
 * Geometric social cluster - one shared handle, three shaped icons.
 */
export function SocialGeometry() {
  const { language } = useLanguageStore();

  return (
    <div className="rounded-sm border border-border/50 bg-card/40 p-3 backdrop-blur-sm">
      <h3 className="mb-4 text-[10px] font-semibold tracking-wide text-muted-foreground capitalize">
        {language === 'fr' ? 'Réseaux sociaux' : 'Social Networks'}
      </h3>

      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full items-end justify-center gap-3 sm:gap-4">
          {networks.map(({ id, label, href, Icon, shape }) => (
            <a
              key={id}
              href={href()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="group relative flex flex-col items-center gap-2"
            >
              <span
                className={cn(
                  'relative flex h-11 w-11 items-center justify-center',
                  'border border-border/60 bg-background/70 text-foreground',
                  'transition-[transform,border-color,background-color,box-shadow,color] duration-500 ease-out',
                  'group-hover:border-primary/35 group-hover:bg-primary/10 group-hover:text-primary',
                  'group-hover:shadow-[0_10px_28px_-16px_hsla(268,55%,40%,0.45)]',
                  'group-hover:-translate-y-0.5',
                  shape === 'square' && 'rounded-sm',
                  shape === 'circle' && 'rounded-full',
                  shape === 'diamond' && 'rotate-45 rounded-[4px]',
                )}
              >
                <Icon className={cn('h-4 w-4', shape === 'diamond' && '-rotate-45')} />
              </span>
              <span className="text-[8px] font-bold tracking-[0.18em] text-muted-foreground uppercase transition-colors duration-500 group-hover:text-primary/80">
                {label}
              </span>
            </a>
          ))}
        </div>

        {/* Shared handle - geometric capsule under the triad */}
        <div className="relative w-full max-w-[220px]">
          <div
            aria-hidden
            className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-border to-transparent"
          />
          <div className="relative mx-auto flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 shadow-sm backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-primary/70" />
            <span className="font-mono text-[11px] font-semibold tracking-tight text-foreground">
              {contactsInfo.handle}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
