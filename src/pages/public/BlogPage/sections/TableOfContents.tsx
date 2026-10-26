import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { headingSlug } from '@/shared/lib/heading-slug';
import { ChevronRight, List, X } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TOCGroup {
  heading: TOCItem;
  children: TOCItem[];
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

function groupToc(items: TOCItem[]): TOCGroup[] {
  const groups: TOCGroup[] = [];

  for (const item of items) {
    if (item.level === 2) {
      groups.push({ heading: item, children: [] });
      continue;
    }
    if (groups.length === 0) {
      groups.push({ heading: item, children: [] });
      continue;
    }
    groups[groups.length - 1].children.push(item);
  }

  return groups;
}

function findGroupIdForHeading(groups: TOCGroup[], headingId: string): string | null {
  for (const group of groups) {
    if (group.heading.id === headingId) return group.heading.id;
    if (group.children.some((child) => child.id === headingId)) return group.heading.id;
  }
  return null;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  content,
  variant = 'desktop',
  clearStickyCta = false,
}) => {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  const groups = groupToc(toc);

  useEffect(() => {
    const lines = content.split('\n');
    const items: TOCItem[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.*)/);
      if (!match) return;
      const level = match[1].length as 2 | 3;
      items.push({
        id: headingSlug(match[2]),
        text: match[2].trim(),
        level,
      });
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

  // Keep the active section's parent open while scrolling (no forced collapse).
  useEffect(() => {
    if (!activeId || toc.length === 0) return;
    const currentGroups = groupToc(toc);
    const groupId = findGroupIdForHeading(currentGroups, activeId);
    if (!groupId) return;
    const group = currentGroups.find((g) => g.heading.id === groupId);
    if (!group || group.children.length === 0) return;

    setExpandedIds((prev) => {
      if (prev.has(groupId)) return prev;
      const next = new Set(prev);
      next.add(groupId);
      return next;
    });
  }, [activeId, toc]);

  // Deep-link: expand parent + scroll after markdown mounts (SPA / async content).
  useEffect(() => {
    if (toc.length === 0) return;
    const currentGroups = groupToc(toc);

    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, '');
      if (!id) return;

      const groupId = findGroupIdForHeading(currentGroups, id);
      if (groupId) {
        setExpandedIds((prev) => {
          const next = new Set(prev);
          next.add(groupId);
          return next;
        });
      }

      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveId(id);
      });
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, [toc]);

  const toggleGroup = (groupId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const goToSection = (id: string, mobile?: boolean) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const path = `${window.location.pathname}${window.location.search}#${id}`;
    window.history.pushState(null, '', path);
    setActiveId(id);

    const groupId = findGroupIdForHeading(groups, id);
    if (groupId) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.add(groupId);
        return next;
      });
    }

    if (mobile) setIsOpen(false);
  };

  if (toc.length === 0) return null;

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <nav
      className={cn('space-y-0.5', mobile && 'px-2 py-2.5')}
      aria-label={isFr ? 'Sommaire' : 'Contents'}
    >
      {groups.map((group) => {
        const hasChildren = group.children.length > 0;
        const isExpanded = !hasChildren || expandedIds.has(group.heading.id);
        const parentActive =
          activeId === group.heading.id || group.children.some((child) => child.id === activeId);

        return (
          <div key={group.heading.id} className="min-w-0">
            <div
              className={cn(
                'relative flex items-stretch rounded-sm',
                parentActive && hasChildren && !isExpanded && 'bg-muted/50',
              )}
            >
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.heading.id)}
                  className="flex shrink-0 cursor-pointer items-center px-1 text-foreground/45 transition-colors hover:text-foreground"
                  aria-expanded={isExpanded}
                  aria-label={
                    isExpanded
                      ? isFr
                        ? 'Réduire la section'
                        : 'Collapse section'
                      : isFr
                        ? 'Développer la section'
                        : 'Expand section'
                  }
                >
                  <ChevronRight
                    className={cn(
                      'size-3.5 transition-transform duration-200',
                      isExpanded && 'rotate-90',
                    )}
                  />
                </button>
              ) : (
                <span className="w-5 shrink-0" aria-hidden />
              )}

              <a
                href={`#${group.heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  goToSection(group.heading.id, mobile);
                }}
                className={cn(
                  'relative min-w-0 flex-1 rounded-sm py-1.5 pr-2.5 text-[13px] leading-snug transition-colors',
                  hasChildren ? 'pl-0.5' : 'pl-0',
                  activeId === group.heading.id
                    ? 'bg-muted/70 font-medium text-foreground'
                    : parentActive
                      ? 'font-medium text-foreground/85'
                      : 'text-foreground/70 hover:bg-muted/40 hover:text-foreground',
                )}
              >
                {activeId === group.heading.id ? (
                  <span
                    className="absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full bg-primary"
                    aria-hidden
                  />
                ) : null}
                <span className="line-clamp-2">{group.heading.text}</span>
              </a>
            </div>

            {hasChildren ? (
              <div
                className={cn(
                  'grid transition-[grid-template-rows] duration-200 ease-out',
                  isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="mt-0.5 ml-2.5 space-y-0.5 border-l border-border/50 pl-2">
                    {group.children.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          goToSection(item.id, mobile);
                        }}
                        className={cn(
                          'relative block rounded-sm px-2 py-1.5 text-[12.5px] leading-snug transition-colors',
                          activeId === item.id
                            ? 'bg-muted/70 font-medium text-foreground'
                            : 'text-foreground/65 hover:bg-muted/40 hover:text-foreground',
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
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
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
                {isFr ? 'Sommaire' : 'Contents'}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-sm p-1 text-foreground/60 transition-colors hover:bg-muted/60 hover:text-foreground"
                aria-label={isFr ? 'Fermer' : 'Close'}
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
          aria-label={isFr ? 'Ouvrir le sommaire' : 'Open table of contents'}
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
          {isFr ? 'Sommaire' : 'Contents'}
        </span>
      </div>

      <div className="premium-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-1.5 py-2">
        <NavContent />
      </div>
    </div>
  );
};
