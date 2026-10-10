import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { List, X } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  /** desktop = fixed sidebar panel; mobile = FAB only */
  variant?: 'desktop' | 'mobile';
  /** Lift FAB above the mobile sticky CTA when that bar is visible */
  clearStickyCta?: boolean;
}

const TOC_TOP_PX = 95;

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  content,
  variant = 'desktop',
  clearStickyCta = false,
}) => {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [fixedBox, setFixedBox] = useState<{ left: number; width: number } | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
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

    const headers = document.querySelectorAll('h2, h3');
    headers.forEach((header) => observer.observe(header));

    return () => observer.disconnect();
  }, [toc]);

  useLayoutEffect(() => {
    if (variant !== 'desktop') return;

    const anchor = anchorRef.current;
    if (!anchor) return;

    const sync = () => {
      const rect = anchor.getBoundingClientRect();
      const next = {
        left: Math.round(rect.left),
        width: Math.round(rect.width),
      };
      setFixedBox((prev) =>
        prev && prev.left === next.left && prev.width === next.width ? prev : next,
      );
    };

    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(anchor);
    if (anchor.parentElement) ro.observe(anchor.parentElement);
    window.addEventListener('resize', sync);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [variant, toc.length]);

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

  const panel = (
    <>
      <div className="flex shrink-0 items-center gap-2 border-b border-border/50 px-3 py-2.5">
        <List className="size-3.5 text-foreground/55" aria-hidden />
        <span className="text-xs font-medium text-foreground/80">
          {language === 'fr' ? 'Sommaire' : 'Contents'}
        </span>
      </div>

      <div className="premium-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-1.5 py-2">
        <NavContent />
      </div>
    </>
  );

  if (variant === 'mobile') {
    return (
      <div
        className={cn(
          'pointer-events-none fixed right-3 z-[45] xl:hidden',
          'transition-[bottom] duration-200 ease-out',
          clearStickyCta ? 'bottom-[10.75rem]' : 'bottom-24',
        )}
      >
        {isOpen ? (
          <div className="pointer-events-auto absolute right-0 bottom-12 flex max-h-[45vh] w-[min(17rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-sm border border-border/50 bg-background/70 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-background/55">
            <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-border/40 bg-background/60 px-3 py-2 backdrop-blur-md">
              <span className="text-xs font-medium text-foreground/85">
                {language === 'fr' ? 'Sommaire' : 'Contents'}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-sm p-1 text-foreground/60 transition-colors hover:bg-muted/60 hover:text-foreground"
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
            'pointer-events-auto flex size-10 items-center justify-center rounded-sm border border-border/50 shadow-sm backdrop-blur-md transition-colors',
            isOpen
              ? 'bg-foreground/85 text-background'
              : 'bg-background/55 text-foreground supports-backdrop-filter:bg-background/40 hover:bg-background/70',
          )}
          aria-label={language === 'fr' ? 'Ouvrir le sommaire' : 'Open table of contents'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="size-4" /> : <List className="size-4" />}
        </button>
      </div>
    );
  }

  return (
    <>
      <div ref={anchorRef} className="h-0 w-full" aria-hidden />

      <div
        className={cn(
          'fixed z-20 hidden max-h-[calc(100vh-8.5rem)] flex-col border border-border/60 bg-background/95 backdrop-blur-md lg:flex',
          'rounded-sm',
          !fixedBox && 'invisible',
        )}
        style={
          fixedBox
            ? {
                top: TOC_TOP_PX,
                left: fixedBox.left,
                width: fixedBox.width,
              }
            : undefined
        }
      >
        {panel}
      </div>
    </>
  );
};
