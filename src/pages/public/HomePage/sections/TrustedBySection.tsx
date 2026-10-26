import React, { useMemo } from 'react';
import { resolvePartnerLogoUrl, usePublicPartners } from '@/entities/partners';
import type { IPartner } from '@/entities/partners';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { QueryState } from '@/shared/ui/QueryState';
import { Marquee } from '@/shared/ui/marquee';
import { cn } from '@/shared/lib/utils';

function sortPartners(items: IPartner[]) {
  return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function desktopGridClass(count: number) {
  if (count >= 5) return 'md:grid-cols-5';
  if (count >= 3) return 'md:grid-cols-3';
  if (count === 2) return 'md:grid-cols-2';
  return 'md:mx-auto md:max-w-[14rem] md:grid-cols-1';
}

const PartnerLogoCell: React.FC<{
  partner: IPartner;
  isFr: boolean;
  className?: string;
}> = ({ partner, isFr, className }) => {
  const relation = isFr ? partner.relationFr : partner.relationEn;
  const title = [partner.name, relation].filter(Boolean).join(' — ');
  const logoSrc = resolvePartnerLogoUrl(partner.id, partner.logoUrl);
  const inner = (
    <>
      <img
        src={logoSrc}
        alt={partner.name}
        width={120}
        height={40}
        loading="lazy"
        decoding="async"
        className={cn(
          'h-9 w-auto max-w-[7.5rem] object-contain object-center sm:h-10 sm:max-w-[8.5rem]',
          'opacity-70 grayscale transition-[opacity,filter,transform] duration-300',
          'group-hover/logo:scale-[1.02] group-hover/logo:opacity-100 group-hover/logo:grayscale-0',
          'dark:opacity-80 dark:brightness-110 dark:group-hover/logo:opacity-100',
        )}
      />
      <span className="sr-only">{title}</span>
    </>
  );

  const shellClass = cn(
    'group/logo flex h-[4.5rem] w-full items-center justify-center rounded-md border border-border/50',
    'bg-background/30 px-4 py-3 backdrop-blur-sm',
    'transition-[border-color,background-color,box-shadow] duration-300',
    'hover:border-border hover:bg-background/55',
    'dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20 dark:hover:bg-white/[0.06]',
    className,
  );

  if (partner.websiteUrl) {
    return (
      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        className={shellClass}
      >
        {inner}
      </a>
    );
  }

  return (
    <div title={title} className={shellClass}>
      {inner}
    </div>
  );
};

export const TrustedBySection: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const { data, isPending, isError, error } = usePublicPartners();

  const partners = useMemo(() => {
    const items = data?.data.items ?? [];
    return sortPartners(items.filter((p) => p.isPublished !== false && Boolean(p.logoUrl?.trim())));
  }, [data]);

  if (!isPending && !isError && partners.length === 0) return null;

  const mid = Math.ceil(partners.length / 2);
  const rowA = partners.slice(0, mid);
  const rowB = partners.slice(mid);
  const useDualMarquee = partners.length >= 2;

  return (
    <section className="relative z-10 overflow-hidden px-4 py-12 md:px-10 md:py-16 lg:px-14">
      {/* Quiet glass plane — brand without noise */}
      <div
        className="pointer-events-none absolute inset-0 bg-background/45 backdrop-blur-md dark:bg-background/35"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border/60 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border/60 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mb-8 text-center md:mb-10">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-primary/70" aria-hidden />
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground md:text-xl mb-0!">
              {isFr ? 'Ils m’ont fait confiance' : 'They trusted my expertise'}
            </h2>
            <span className="h-px w-8 bg-primary/70" aria-hidden />
          </div>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            {isFr
              ? 'Structures et équipes avec lesquelles j’ai livré.'
              : 'Organizations and teams I have shipped with.'}
          </p>
        </div>

        <QueryState
          isPending={isPending}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : undefined}
          source={data?.source}
        >
          {/* Desktop / tablet: responsive logo grid */}
          <div className={cn('hidden gap-3 md:grid md:gap-4', desktopGridClass(partners.length))}>
            {partners.map((partner) => (
              <PartnerLogoCell key={partner.id} partner={partner} isFr={isFr} />
            ))}
          </div>

          {/* Mobile: dual opposite marquees with soft edge fade */}
          <div className="relative md:hidden">
            {!useDualMarquee ? (
              <div className="mx-auto max-w-[14rem]">
                <PartnerLogoCell partner={partners[0]} isFr={isFr} />
              </div>
            ) : (
              <>
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-background via-background/80 to-transparent"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-background via-background/80 to-transparent"
                  aria-hidden
                />
                <div className="flex flex-col gap-2.5">
                  <Marquee
                    pauseOnHover
                    repeat={rowA.length <= 2 ? 5 : 3}
                    className="p-0 [--duration:42s] [--gap:0.65rem]"
                  >
                    {rowA.map((partner) => (
                      <PartnerLogoCell
                        key={partner.id}
                        partner={partner}
                        isFr={isFr}
                        className="w-[9.5rem] shrink-0"
                      />
                    ))}
                  </Marquee>
                  {rowB.length > 0 && (
                    <Marquee
                      reverse
                      pauseOnHover
                      repeat={rowB.length <= 2 ? 5 : 3}
                      className="p-0 [--duration:48s] [--gap:0.65rem]"
                    >
                      {rowB.map((partner) => (
                        <PartnerLogoCell
                          key={partner.id}
                          partner={partner}
                          isFr={isFr}
                          className="w-[9.5rem] shrink-0"
                        />
                      ))}
                    </Marquee>
                  )}
                </div>
              </>
            )}
          </div>
        </QueryState>
      </div>
    </section>
  );
};
