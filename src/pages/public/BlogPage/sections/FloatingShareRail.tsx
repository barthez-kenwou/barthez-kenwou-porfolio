import type { IBlog } from '@/entities/blogs';
import { trackShare } from '@/app/lib/analytics';
import { buildBlogSharePayload } from '@/shared/lib/blogShare';
import { getBlogPathSlug } from '@/shared/lib/entity-slug';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { Facebook, Instagram, Linkedin, Mail, Share2, X } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.829L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

type ShareChannel = 'facebook' | 'linkedin' | 'x' | 'instagram' | 'email';

type ShareItem = {
  id: ShareChannel;
  label: string;
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
};

const LG_QUERY = '(min-width: 1024px)';

const glassPanel =
  'border border-border/50 shadow-sm bg-background/55 backdrop-blur-md supports-backdrop-filter:bg-background/40 dark:bg-background/45 dark:supports-backdrop-filter:bg-background/35';

const iconBtn =
  'flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm text-foreground/75 transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 lg:size-8';

function defaultOpenForViewport() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(LG_QUERY).matches;
}

export const FloatingShareRail: React.FC<{ post: IBlog }> = ({ post }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const slug = getBlogPathSlug(post);
  const [open, setOpen] = useState(defaultOpenForViewport);
  const rootRef = useRef<HTMLElement>(null);

  const share = useMemo(
    () => buildBlogSharePayload(post, isFr ? 'fr' : 'en'),
    [post, isFr],
  );

  const items = useMemo<ShareItem[]>(
    () => [
      {
        id: 'facebook',
        label: 'Facebook',
        href: share.facebookHref,
        icon: <Facebook className="size-3.5" />,
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        href: share.linkedinHref,
        icon: <Linkedin className="size-3.5" />,
      },
      {
        id: 'x',
        label: 'X',
        href: share.xHref,
        icon: <XIcon className="size-3.5" />,
      },
      {
        id: 'instagram',
        label: 'Instagram',
        onClick: async () => {
          try {
            await navigator.clipboard.writeText(share.clipboard);
            toast.success(isFr ? 'Texte de partage copié' : 'Share text copied', {
              description: isFr
                ? 'Titre, extrait et lien prêts pour une story ou un message Instagram.'
                : 'Title, excerpt and link ready for an Instagram story or DM.',
            });
            trackShare('instagram', 'blog', slug);
          } catch {
            toast.error(isFr ? 'Impossible de copier' : 'Could not copy');
          }
        },
        icon: <Instagram className="size-3.5" />,
      },
      {
        id: 'email',
        label: 'Email',
        href: share.emailHref,
        icon: <Mail className="size-3.5" />,
      },
    ],
    [isFr, share, slug],
  );

  useEffect(() => {
    const mq = window.matchMedia(LG_QUERY);
    const onChange = () => setOpen(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: MouseEvent | TouchEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (event.target instanceof Node && !el.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const onChannel = (channel: ShareChannel) => {
    if (channel !== 'instagram') trackShare(channel, 'blog', slug);
  };

  const renderItem = (item: ShareItem) => {
    if (item.href) {
      return (
        <a
          key={item.id}
          href={item.href}
          target={item.id === 'email' ? undefined : '_blank'}
          rel={item.id === 'email' ? undefined : 'noopener noreferrer'}
          className={iconBtn}
          aria-label={isFr ? `Partager sur ${item.label}` : `Share on ${item.label}`}
          title={item.label}
          onClick={() => onChannel(item.id)}
        >
          {item.icon}
        </a>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        className={iconBtn}
        aria-label={isFr ? `Partager sur ${item.label}` : `Share on ${item.label}`}
        title={item.label}
        onClick={() => {
          void item.onClick?.();
        }}
      >
        {item.icon}
      </button>
    );
  };

  return (
    <aside
      ref={rootRef}
      className={cn(
        'pointer-events-none fixed z-40 print:hidden',
        // Mobile: small inset so the control doesn’t look cut by the viewport edge.
        // Desktop: still far right, but with a full border so it reads as a control.
        'right-1 top-28 sm:right-1 md:top-32 lg:right-2 xl:right-3 xl:top-[9.5rem]',
      )}
      aria-label={isFr ? "Partager l'article" : 'Share article'}
    >
      <div
        className={cn(
          'pointer-events-auto flex flex-col items-center overflow-hidden rounded-md border p-0.5 lg:p-1',
          glassPanel,
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'flex size-9 cursor-pointer items-center justify-center rounded-sm lg:size-8',
            'text-foreground/80 transition-colors hover:text-foreground',
          )}
          aria-expanded={open}
          aria-label={
            open
              ? isFr
                ? 'Réduire le partage'
                : 'Collapse share menu'
              : isFr
                ? "Partager l'article"
                : 'Share article'
          }
        >
          {open ? <X className="size-4" /> : <Share2 className="size-4" />}
        </button>

        <div
          className={cn(
            'flex flex-col items-center overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out',
            open ? 'mt-0.5 max-h-64 opacity-100' : 'mt-0 max-h-0 opacity-0',
          )}
          aria-hidden={!open}
        >
          <div className="mb-0.5 h-px w-4 bg-border" aria-hidden />
          <div
            className={cn(
              'flex flex-col items-center gap-0.5 transition-transform duration-300 ease-out',
              open ? 'translate-y-0' : '-translate-y-2',
            )}
          >
            {items.map(renderItem)}
          </div>
        </div>
      </div>
    </aside>
  );
};
