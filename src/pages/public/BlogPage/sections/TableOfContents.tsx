import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { List, X, ChevronRight } from 'lucide-react';

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

const TOC_TOP_PX = 95; // clears floating navbar (~top-28)

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

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    const lines = content.split('\n');
    const items: TOCItem[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.*)/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        items.push({
          id: slugify(text),
          text,
          level,
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

  // Pin desktop TOC to the aside column - sticky is broken by overflow-x: clip ancestors
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
    <nav className={cn('space-y-0.5', mobile && 'px-2 py-3')}>
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
            'flex items-center gap-2 py-1.5 text-[13px] leading-snug transition-all relative group rounded-md px-2',
            item.level === 3 ? 'ml-3' : 'ml-0',
            activeId === item.id
              ? 'bg-primary/10 font-semibold text-primary'
              : 'text-foreground/80 hover:bg-secondary hover:text-foreground',
          )}
        >
          {activeId === item.id && (
            <motion.div
              layoutId={mobile ? 'active-toc-mobile' : 'active-toc-desktop'}
              className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-primary rounded-full"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <ChevronRight
            className={cn(
              'h-3 w-3 shrink-0 transition-transform',
              activeId === item.id
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5',
            )}
          />
          <span className="truncate">{item.text}</span>
        </a>
      ))}
    </nav>
  );

  const panel = (
    <>
      <div className="shrink-0 flex items-center gap-2 text-primary border-b border-border/40 px-3 py-3">
        <span className="flex size-6 items-center justify-center rounded-md bg-primary/10">
          <List className="h-3.5 w-3.5" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.22em]">
          {language === 'fr' ? 'Sommaire' : 'Contents'}
        </span>
      </div>

      <div className="premium-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3">
        <NavContent />
      </div>

      <div className="shrink-0 border-t border-border/40 px-3 py-3">
        <p className="text-[11px] font-medium leading-relaxed text-foreground/75">
          {language === 'fr'
            ? "Le courage de chercher la connaissance… focus sur l'objectif."
            : 'The courage to seek knowledge… focus on the goal.'}
        </p>
      </div>
    </>
  );

  if (variant === 'mobile') {
    // Dock ≈ bottom-19 (4.75rem). Sticky CTA (~3.75rem) parks on top of it.
    // Raise the FAB so it never sits under "Let's talk".
    return (
      <div
        className={cn(
          'pointer-events-none fixed right-3 z-[45] xl:hidden',
          'transition-[bottom] duration-300 ease-out',
          clearStickyCta ? 'bottom-[10.75rem]' : 'bottom-24',
        )}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="pointer-events-auto absolute right-0 bottom-12 flex max-h-[45vh] w-[min(17rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-md border border-border bg-background/95 shadow-md backdrop-blur-2xl"
            >
              <div className="shrink-0 sticky top-0 z-10 bg-background/95 flex items-center justify-between py-2 px-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {language === 'fr' ? 'Sommaire' : 'Contents'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-secondary transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="premium-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <NavContent mobile />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'pointer-events-auto relative flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-md shadow-md transition-all active:scale-90 group',
            isOpen ? 'bg-foreground text-background' : 'bg-brand text-brand-foreground',
          )}
          aria-label={language === 'fr' ? 'Ouvrir le sommaire' : 'Open table of contents'}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          {isOpen ? (
            <X className="h-4 w-4 relative z-10" />
          ) : (
            <List className="h-4 w-4 relative z-10" />
          )}
        </button>
      </div>
    );
  }

  return (
    <>
      {/* In-flow anchor: keeps the grid column width and measures left/width */}
      <div ref={anchorRef} className="w-full h-0" aria-hidden />

      <div
        className={cn(
          'hidden lg:flex lg:flex-col fixed z-20',
          'max-h-[calc(100vh-8.5rem)]',
          'rounded-md border border-border/50 bg-background/90 backdrop-blur-md',
          'shadow-sm',
          'ring-1 ring-border/60',
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
