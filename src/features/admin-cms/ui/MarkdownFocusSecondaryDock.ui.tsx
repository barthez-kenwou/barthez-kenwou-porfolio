import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CheckSquare,
  CircuitBoard,
  Code2,
  Columns2,
  CopyPlus,
  FileImage,
  GitFork,
  Images,
  Languages,
  LayoutList,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Rows2,
  Smile,
  Strikethrough,
  Table2,
  Youtube,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';
import type { FocusToolbarAction } from './MarkdownFocusBoard.ui';
import { FocusEmojiPicker } from './FocusEmojiPicker.ui';

const EASE = [0.22, 1, 0.36, 1] as const;

export type FocusHeading = { level: number; text: string; index: number };

export function extractFocusHeadings(markdown: string): FocusHeading[] {
  const out: FocusHeading[] = [];
  const re = /^(#{2,6})\s+(.+?)\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown))) {
    out.push({
      level: m[1].length,
      text: m[2].replace(/#+$/, '').trim(),
      index: m.index,
    });
  }
  return out;
}

export function focusWordStats(markdown: string): { words: number; minutes: number } {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/[#>*_\-|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = plain ? plain.split(' ').filter(Boolean).length : 0;
  const minutes = Math.max(words ? 1 : 0, Math.round(words / 220));
  return { words, minutes };
}

type Props = {
  isFr: boolean;
  value: string;
  /** When false (preview), insert gadgets are hidden — read-only rail. */
  writable: boolean;
  enableImages?: boolean;
  localePair?: { siblingLabel: string };
  mirrorMedia?: boolean;
  translating?: boolean;
  dockOrientation: 'horizontal' | 'vertical';
  onSnippet: (key: FocusToolbarAction) => void;
  onJumpToHeading: (index: number) => void;
  onInsertEmoji: (emoji: string) => void;
  onSyncImages?: () => void;
  onToggleMirror?: () => void;
  onTranslate?: () => void;
  onToggleDockOrientation: () => void;
};

const btn =
  'size-7 shrink-0 rounded-md border-0 bg-transparent text-foreground/70 shadow-none hover:bg-muted hover:text-foreground';

/**
 * Focus-only secondary rail: edge-to-edge bottom, shallow arch, theme tokens, compact height.
 */
export function MarkdownFocusSecondaryDock({
  isFr,
  value,
  writable,
  enableImages = true,
  localePair,
  mirrorMedia = false,
  translating = false,
  dockOrientation,
  onSnippet,
  onJumpToHeading,
  onInsertEmoji,
  onSyncImages,
  onToggleMirror,
  onTranslate,
  onToggleDockOrientation,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const stats = useMemo(() => focusWordStats(value), [value]);
  const headings = useMemo(() => extractFocusHeadings(value), [value]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-220"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
      transition={{ duration: reduceMotion ? 0.1 : 0.32, ease: EASE }}
    >
      <div className="pointer-events-auto relative w-full pb-[env(safe-area-inset-bottom)]">
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 w-full"
          viewBox="0 0 1200 48"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0 48 V14 Q600 1 1200 14 V48 Z" className="fill-card" />
          <path
            d="M0 14 Q600 1 1200 14"
            fill="none"
            className="stroke-border"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="relative flex h-12 w-full items-end bg-transparent">
          <div className="mx-auto flex h-9 w-full max-w-6xl items-center gap-2 px-3 sm:gap-3 sm:px-6">
            <FocusStats words={stats.words} minutes={stats.minutes} isFr={isFr} className="hidden sm:flex" />

            <div className="flex min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto sm:gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {writable ? (
                <>
                  <IconBtn tip={isFr ? 'Bloc de code' : 'Code block'} onClick={() => onSnippet('codeBlock')}>
                    <Code2 className="size-3.5" />
                  </IconBtn>
                  <IconBtn tip={isFr ? 'Citation' : 'Quote'} onClick={() => onSnippet('quote')}>
                    <Quote className="size-3.5" />
                  </IconBtn>
                  <IconBtn tip={isFr ? 'Séparateur' : 'Divider'} onClick={() => onSnippet('hr')}>
                    <Minus className="size-3.5" />
                  </IconBtn>
                  <IconBtn tip={isFr ? 'Liste numérotée' : 'Numbered list'} onClick={() => onSnippet('ol')}>
                    <ListOrdered className="size-3.5" />
                  </IconBtn>
                  <IconBtn tip="Checklist" onClick={() => onSnippet('checklist')}>
                    <CheckSquare className="size-3.5" />
                  </IconBtn>
                  <IconBtn tip="Strike" onClick={() => onSnippet('strike')}>
                    <Strikethrough className="size-3.5" />
                  </IconBtn>
                  <IconBtn tip={isFr ? 'Tableau' : 'Table'} onClick={() => onSnippet('table')}>
                    <Table2 className="size-3.5" />
                  </IconBtn>

                  <RailSep />

                  <IconBtn tip="YouTube" onClick={() => onSnippet('youtube')}>
                    <Youtube className="size-3.5" />
                  </IconBtn>
                  <IconBtn tip="Gist" onClick={() => onSnippet('gist')}>
                    <GitFork className="size-3.5" />
                  </IconBtn>
                  <IconBtn tip="Mermaid" onClick={() => onSnippet('mermaid')}>
                    <CircuitBoard className="size-3.5" />
                  </IconBtn>

                  {enableImages ? (
                    <IconBtn
                      tip={isFr ? 'Image par URL' : 'Image from URL'}
                      onClick={() => onSnippet('imageUrl')}
                    >
                      <FileImage className="size-3.5" />
                    </IconBtn>
                  ) : null}

                  <DropdownMenu
                    open={openMenu === 'grid'}
                    onOpenChange={(o) => setOpenMenu(o ? 'grid' : null)}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className={btn}
                        title={isFr ? 'Grille images' : 'Image grid'}
                      >
                        <Columns2 className="size-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="z-460 min-w-36">
                      <DropdownMenuLabel className="text-[10px] uppercase tracking-wide">
                        {isFr ? 'Grille' : 'Grid'}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-xs"
                        onSelect={() => onSnippet('imageGrid2')}
                      >
                        2 {isFr ? 'colonnes' : 'columns'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-xs"
                        onSelect={() => onSnippet('imageGrid3')}
                      >
                        3 {isFr ? 'colonnes' : 'columns'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <RailSep />
                </>
              ) : (
                <p className="px-2 text-[11px] tracking-wide text-muted-foreground">
                  {isFr
                    ? 'Aperçu — repasse en écriture pour les gadgets'
                    : 'Preview — switch back to writing for gadgets'}
                </p>
              )}

              {localePair ? (
                <>
                  {onSyncImages ? (
                    <IconBtn
                      tip={
                        isFr
                          ? `Aligner images → ${localePair.siblingLabel}`
                          : `Align images → ${localePair.siblingLabel}`
                      }
                      onClick={onSyncImages}
                    >
                      <Images className="size-3.5" />
                    </IconBtn>
                  ) : null}
                  {onToggleMirror ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className={cn(
                        btn,
                        mirrorMedia && 'bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary',
                      )}
                      aria-pressed={mirrorMedia}
                      title={
                        mirrorMedia
                          ? isFr
                            ? `Miroir ON → ${localePair.siblingLabel}`
                            : `Mirror ON → ${localePair.siblingLabel}`
                          : isFr
                            ? 'Miroir OFF'
                            : 'Mirror OFF'
                      }
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={onToggleMirror}
                    >
                      <CopyPlus className="size-3.5" />
                    </Button>
                  ) : null}
                  {onTranslate ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className={btn}
                      disabled={translating || !value.trim()}
                      title={
                        isFr
                          ? `Traduire → ${localePair.siblingLabel}`
                          : `Translate → ${localePair.siblingLabel}`
                      }
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={onTranslate}
                    >
                      {translating ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Languages className="size-3.5" />
                      )}
                    </Button>
                  ) : null}
                  <RailSep />
                </>
              ) : null}

              {writable ? (
                <>
                  <DropdownMenu
                    open={openMenu === 'outline'}
                    onOpenChange={(o) => setOpenMenu(o ? 'outline' : null)}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className={btn}
                        title="Outline"
                      >
                        <LayoutList className="size-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      className="z-460 max-h-64 min-w-56 overflow-y-auto"
                    >
                      <DropdownMenuLabel className="text-[10px] uppercase tracking-wide">
                        Outline
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {headings.length === 0 ? (
                        <p className="px-2 py-1.5 text-xs text-muted-foreground">
                          {isFr ? 'Aucun titre H2–H6' : 'No H2–H6 headings'}
                        </p>
                      ) : (
                        headings.map((h) => (
                          <DropdownMenuItem
                            key={`${h.index}-${h.text}`}
                            className="cursor-pointer text-xs"
                            style={{ paddingLeft: 8 + (h.level - 2) * 10 }}
                            onSelect={() => onJumpToHeading(h.index)}
                          >
                            {h.text}
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu
                    open={openMenu === 'emoji'}
                    onOpenChange={(o) => setOpenMenu(o ? 'emoji' : null)}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className={btn}
                        title={isFr ? 'Émojis' : 'Emojis'}
                      >
                        <Smile className="size-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      side="top"
                      sideOffset={10}
                      className="z-460 border-border/60 bg-popover p-0 shadow-lg"
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      <FocusEmojiPicker
                        isFr={isFr}
                        onPick={(emoji) => {
                          onInsertEmoji(emoji);
                          setOpenMenu(null);
                        }}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <RailSep />
                </>
              ) : null}

              <IconBtn
                tip={
                  dockOrientation === 'horizontal'
                    ? isFr
                      ? 'Barre verticale'
                      : 'Vertical toolbar'
                    : isFr
                      ? 'Barre horizontale'
                      : 'Horizontal toolbar'
                }
                onClick={onToggleDockOrientation}
              >
                {dockOrientation === 'horizontal' ? (
                  <Columns2 className="size-3.5" />
                ) : (
                  <Rows2 className="size-3.5" />
                )}
              </IconBtn>
            </div>

            <FocusStats
              words={stats.words}
              minutes={stats.minutes}
              isFr={isFr}
              compact
              className="sm:hidden"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FocusStats({
  words,
  minutes,
  isFr,
  compact = false,
  className,
}: {
  words: number;
  minutes: number;
  isFr: boolean;
  compact?: boolean;
  className?: string;
}) {
  const locale = isFr ? 'fr-FR' : 'en-US';
  const wordsLabel = isFr ? 'mots' : 'words';
  const formatted = words.toLocaleString(locale);

  if (compact) {
    return (
      <div
        className={cn('flex h-7 shrink-0 items-center gap-1.5', className)}
        title={`${formatted} ${wordsLabel} · ~${minutes} min`}
        aria-label={`${formatted} ${wordsLabel}, ${minutes} min`}
      >
        <span className="text-[11px] font-semibold tabular-nums tracking-tight text-foreground/85">
          {formatted}
        </span>
        <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
          {isFr ? 'm' : 'w'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn('flex h-7 shrink-0 items-center gap-2.5', className)}
      aria-label={`${formatted} ${wordsLabel}, ${minutes} min`}
    >
      <div className="flex items-baseline gap-1.5 leading-none">
        <span className="text-[12px] font-semibold tabular-nums tracking-tight text-foreground/90">
          {formatted}
        </span>
        <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {wordsLabel}
        </span>
      </div>
      <span className="h-3 w-px shrink-0 bg-border/80" aria-hidden />
      <div className="flex items-baseline gap-1 leading-none">
        <span className="text-[12px] font-medium tabular-nums tracking-tight text-foreground/75">
          ~{minutes}
        </span>
        <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          min
        </span>
      </div>
    </div>
  );
}

function IconBtn({
  tip,
  onClick,
  children,
}: {
  tip: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={btn}
      title={tip}
      aria-label={tip}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function RailSep() {
  return <span className="mx-0.5 hidden h-3.5 w-px shrink-0 bg-border sm:block" aria-hidden />;
}
