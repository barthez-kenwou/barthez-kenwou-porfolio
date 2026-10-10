import type { IBlog } from '@/entities/blogs';
import { trackShare } from '@/app/lib/analytics';
import { getBlogPathSlug } from '@/shared/lib/entity-slug';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { Facebook, Instagram, Linkedin, Mail, Share2 } from 'lucide-react';
import React, { useMemo } from 'react';
import { toast } from 'sonner';

/** X / Twitter mark (lucide Twitter is deprecated/legacy bird in some versions). */
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

export const FloatingShareRail: React.FC<{ post: IBlog }> = ({ post }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const slug = getBlogPathSlug(post);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = isFr ? post.titleFr : post.titleEn || post.titleFr;

  const items = useMemo<ShareItem[]>(() => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    return [
      {
        id: 'facebook',
        label: 'Facebook',
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        icon: <Facebook className="size-3.5" />,
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        icon: <Linkedin className="size-3.5" />,
      },
      {
        id: 'x',
        label: 'X',
        href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
        icon: <XIcon className="size-3.5" />,
      },
      {
        id: 'instagram',
        label: 'Instagram',
        onClick: async () => {
          try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success(
              isFr ? 'Lien copié' : 'Link copied',
              {
                description: isFr
                  ? 'Collez-le dans une story ou un message Instagram.'
                  : 'Paste it into an Instagram story or DM.',
              },
            );
            trackShare('instagram', 'blog', slug);
          } catch {
            toast.error(isFr ? 'Impossible de copier le lien' : 'Could not copy link');
          }
        },
        icon: <Instagram className="size-3.5" />,
      },
      {
        id: 'email',
        label: isFr ? 'Email' : 'Email',
        href: `mailto:?subject=${encodedText}&body=${encodedText}%0A%0A${encodedUrl}`,
        icon: <Mail className="size-3.5" />,
      },
    ];
  }, [isFr, shareText, shareUrl, slug]);

  const onChannel = (channel: ShareChannel) => {
    if (channel !== 'instagram') trackShare(channel, 'blog', slug);
  };

  return (
    <aside
      className={cn(
        'pointer-events-none fixed z-40 print:hidden',
        'right-2 top-28 sm:right-3 md:top-32 md:right-4',
        'xl:right-5 xl:top-[9.5rem]',
      )}
      aria-label={isFr ? "Partager l'article" : 'Share article'}
    >
      <div
        className={cn(
          'pointer-events-auto flex flex-col items-center gap-0.5 rounded-sm border border-border/50 p-1 shadow-sm',
          'bg-background/55 backdrop-blur-md supports-backdrop-filter:bg-background/40',
          'dark:bg-background/45 dark:supports-backdrop-filter:bg-background/35',
        )}
      >
        <span
          className="flex size-8 items-center justify-center text-foreground/55"
          title={isFr ? 'Partager' : 'Share'}
        >
          <Share2 className="size-3.5" aria-hidden />
          <span className="sr-only">{isFr ? 'Partager' : 'Share'}</span>
        </span>

        <div className="h-px w-4 bg-border" aria-hidden />

        {items.map((item) => {
          const className = cn(
            'flex size-8 items-center justify-center rounded-sm text-foreground/75',
            'transition-colors hover:bg-muted hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35',
          );

          if (item.href) {
            return (
              <a
                key={item.id}
                href={item.href}
                target={item.id === 'email' ? undefined : '_blank'}
                rel={item.id === 'email' ? undefined : 'noopener noreferrer'}
                className={className}
                aria-label={
                  isFr ? `Partager sur ${item.label}` : `Share on ${item.label}`
                }
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
              className={className}
              aria-label={
                isFr ? `Partager sur ${item.label}` : `Share on ${item.label}`
              }
              title={item.label}
              onClick={() => item.onClick?.()}
            >
              {item.icon}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
