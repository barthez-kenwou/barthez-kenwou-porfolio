import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { List, X } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  /** desktop = in-flow sticky panel; mobile = FAB only */
  variant?: 'desktop' | 'mobile';
  /** Lift FAB above the mobile sticky CTA when that bar is visible */
  clearStickyCta?: boolean;
}

/** Clears fixed public header / navbar */
const TOC_TOP_CLASS = 'top-24';

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  content,
  variant = 'desktop',
  clearStickyCta = false,
}) => {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguageStore();

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  useEffect(() => {
    const lines = content.split('\n');
    const items: TOCItem[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.*)/);
      if (match) {
        items.push({
          id: slugify(match[2].trim()),
          text: match[2].trim(),
          level: match[1].length,
        });
      }
    });

    setToc(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' },
    );

    const headers = document.querySelectorAll('article h2, article h3, main h2, main h3');
    headers.forEach((header) => observer.observe(header));

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={cn('space-y-0.5', mobile && 'px-2 py-2.5')}>
      {toc.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
            if (mobile) setIsOpen(false);
          }}
          className={cn(
            'relative block rounded-sm px-2.5 py-1.5 text-[13px] leading-snug transition-colors',
            item.level === 3 ? 'ml-3' : 'ml-0',
            activeId === item.id
              ? 'bg-muted/70 font-medium text-foreground'
              : 'text-foreground/70 hover:bg-muted/40 hover:text-foreground',
          )}
        >
          {activeId === item.id ? (
            <span
              className="absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full bg-primary"
              aria-hidden
            />
          ) : null}
          <span className="line-clamp-2">{item.text}</span>
        </a>
      ))}
    </nav>
  );

  if (variant === 'mobile') {
    return (
      <div
        className={cn(
          'pointer-events-none fixed z-[99] lg:hidden',
          // Keep a clear inset so the control never looks clipped by the screen edge
          'right-1 bottom-24 sm:right-1',
          'transition-[bottom] duration-200 ease-out',
          clearStickyCta && 'bottom-[10.75rem]',
        )}
      >
        {isOpen ? (
          <div className="pointer-events-auto absolute right-0 bottom-12 flex max-h-[45vh] w-[min(17rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-md border border-border/60 bg-background/80 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-background/60">
            <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-border/40 bg-background/70 px-3 py-2 backdrop-blur-md">
              <span className="text-xs font-medium text-foreground/85">
                {language === 'fr' ? 'Sommaire' : 'Contents'}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-sm p-1 text-foreground/60 transition-colors hover:bg-muted/60 hover:text-foreground"
                aria-label={language === 'fr' ? 'Fermer' : 'Close'}
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="premium-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <NavContent mobile />
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'pointer-events-auto flex size-10 cursor-pointer items-center justify-center rounded-md border border-border/60 shadow-sm backdrop-blur-md transition-colors',
            isOpen
              ? 'bg-foreground/90 text-background'
              : 'bg-background/65 text-foreground supports-backdrop-filter:bg-background/50 hover:bg-background/80',
          )}
          aria-label={language === 'fr' ? 'Ouvrir le sommaire' : 'Open table of contents'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="size-4" /> : <List className="size-4" />}
        </button>
      </div>
    );
  }

  // Desktop: sticky inside the grid column — no fixed left/width sync.
  // Survives AppSidebar open/close and all intermediate breakpoints.
  return (
    <div
      className={cn(
        'sticky z-10 flex max-h-[calc(100vh-7.5rem)] flex-col overflow-hidden',
        'rounded-sm border border-border/60 bg-background/95 backdrop-blur-md',
        TOC_TOP_CLASS,
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-border/50 px-3 py-2.5">
        <List className="size-3.5 text-foreground/55" aria-hidden />
        <span className="text-xs font-medium text-foreground/80">
          {language === 'fr' ? 'Sommaire' : 'Contents'}
        </span>
      </div>

      <div className="premium-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-1.5 py-2">
        <NavContent />
      </div>
    </div>
  );
};
