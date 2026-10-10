import React from 'react';
import { FaGithub, FaLinkedin, FaFacebookF, FaYoutube } from 'react-icons/fa6';
import { trackSocialClick } from '@/app/lib/analytics';
import { cn } from '@/shared/lib/utils';
import { usePublicContactInfo } from '../hooks/useContact';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

type SocialShape = 'square' | 'diamond' | 'circle' | 'hexagon';

type SocialNetwork = {
  id: string;
  label: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  shape: SocialShape;
};

function isActiveHref(href: string | undefined | null): href is string {
  const value = href?.trim() ?? '';
  return value.length > 0 && value !== '#';
}

/**
 * Geometric social cluster — shaped icons + shared handle.
 * YouTube uses a hexagon and only renders when a URL is set in CMS.
 */
export function SocialGeometry() {
  const { language } = useLanguageStore();
  const { data } = usePublicContactInfo();
  const contactsInfo = data?.data;

  const allNetworks: SocialNetwork[] = [
    {
      id: 'github',
      label: 'GitHub',
      href: contactsInfo?.github ?? '',
      Icon: FaGithub,
      shape: 'square',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: contactsInfo?.linkedin ?? '',
      Icon: FaLinkedin,
      shape: 'diamond',
    },
    {
      id: 'facebook',
      label: 'Facebook',
      href: contactsInfo?.facebook ?? '',
      Icon: FaFacebookF,
      shape: 'circle',
    },
    {
      id: 'youtube',
      label: 'YouTube',
      href: contactsInfo?.youtube ?? '',
      Icon: FaYoutube,
      shape: 'hexagon',
    },
  ];
  const networks = allNetworks.filter((network) => isActiveHref(network.href));

  return (
    <div className="rounded-sm border border-border/50 bg-card/40 p-4 backdrop-blur-sm md:p-5">
      <h3 className="mb-5 text-center text-[10px] font-semibold tracking-wide text-muted-foreground capitalize">
        {language === 'fr' ? 'Réseaux sociaux' : 'Social Networks'}
      </h3>

      <div className="flex flex-col items-center gap-5">
        <div className="flex w-full flex-wrap items-end justify-center gap-4 sm:gap-5">
          {networks.map(({ id, label, href, Icon, shape }) => (
            <a
              key={id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="group relative flex flex-col items-center gap-2"
              onClick={() => trackSocialClick(id, 'contact_social')}
            >
              <span
                className={cn(
                  'relative flex h-11 w-11 items-center justify-center',
                  'border border-border/60 bg-background/70 text-foreground',
                  'transition-[border-color,background-color,color] duration-300 ease-out',
                  'group-hover:border-primary/35 group-hover:bg-primary/10 group-hover:text-primary',
                  shape === 'square' && 'rounded-sm',
                  shape === 'circle' && 'rounded-full',
                  shape === 'diamond' && 'rotate-45 rounded-[4px]',
                  shape === 'hexagon' &&
                    'rounded-none [clip-path:polygon(50%_0%,93%_25%,93%_75%,50%_100%,7%_75%,7%_25%)]',
                )}
              >
                <Icon className={cn('h-4 w-4', shape === 'diamond' && '-rotate-45')} />
              </span>
              <span className="text-[8px] font-bold tracking-[0.18em] text-muted-foreground uppercase transition-colors duration-300 group-hover:text-primary/80">
                {label}
              </span>
            </a>
          ))}
        </div>

        <div className="relative w-full max-w-[220px]">
          <div
            aria-hidden
            className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-border to-transparent"
          />
          <div className="relative mx-auto flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5">
            <span className="size-1.5 rounded-full bg-primary/70" />
            <span className="font-mono text-[11px] font-semibold tracking-tight text-foreground">
              {contactsInfo?.handle ?? 'barthez-kenwou'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
