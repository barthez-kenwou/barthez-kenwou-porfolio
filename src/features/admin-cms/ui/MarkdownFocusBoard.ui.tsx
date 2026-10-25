import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeftRight,
  Bold,
  ChevronDown,
  Code2,
  Eye,
  GripVertical,
  Heading2,
  ImagePlus,
  Italic,
  Link2,
  List,
  Loader2,
  Maximize2,
  Minimize2,
  PenLine,
  Save,
  X,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';
import { BlogMarkdown } from '@/shared/ui/markdown/BlogMarkdown';
import {
  restoreTextareaCaret,
  type TextareaCaret,
} from '../lib/textareaCaret';
import { MarkdownFocusSecondaryDock } from './MarkdownFocusSecondaryDock.ui';

/** Sidebar-like cadence: soft ease, ~500ms open / slightly snappier close */
const EASE_FOCUS = [0.22, 1, 0.36, 1] as const;

export type FocusToolbarAction =
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'bold'
  | 'italic'
  | 'code'
  | 'codeBlock'
  | 'link'
  | 'list'
  | 'ol'
  | 'checklist'
  | 'quote'
  | 'hr'
  | 'strike'
  | 'table'
  | 'imageUrl'
  | 'youtube'
  | 'gist'
  | 'mermaid'
  | 'imageGrid2'
  | 'imageGrid3';

type DockOrientation = 'horizontal' | 'vertical';

type DockPos = { x: number; y: number };

const STORAGE_KEY = 'bk-md-focus-dock';

function readDockPrefs(): { pos: DockPos; orientation: DockOrientation } {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { pos: { x: 24, y: 64 }, orientation: 'horizontal' };
    const parsed = JSON.parse(raw) as { pos?: DockPos; orientation?: DockOrientation };
    return {
      pos: parsed.pos ?? { x: 24, y: 24 },
      orientation: parsed.orientation === 'vertical' ? 'vertical' : 'horizontal',
    };
  } catch {
    return { pos: { x: 24, y: 64 }, orientation: 'horizontal' };
  }
}

function writeDockPrefs(pos: DockPos, orientation: DockOrientation) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ pos, orientation }));
  } catch {
    /* ignore */
  }
}

const EXTRA_HEADINGS: Array<{ key: FocusToolbarAction; label: string }> = [
  { key: 'h3', label: 'H3' },
  { key: 'h4', label: 'H4' },
  { key: 'h5', label: 'H5' },
  { key: 'h6', label: 'H6' },
];

export type MarkdownFocusBoardProps = {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  languageLabel?: string;
  isFr: boolean;
  contentIsFr: boolean;
  enableImages?: boolean;
  localePair?: {
    siblingLabel: string;
  };
  mirrorMedia: boolean;
  onToggleMirror: () => void;
  uploading: boolean;
  translating: boolean;
  onSnippet: (key: FocusToolbarAction) => void;
  onPickImage: () => void;
  onSyncImages: () => void;
  onTranslate: () => void;
  /** Jump to sibling locale editing without leaving focus (FR ↔ EN). */
  onSwitchLocale?: () => void;
  /** Persist the parent entity without leaving focus (Ctrl/Cmd+S). */
  onSave?: () => void | Promise<void>;
  saving?: boolean;
  saveDisabled?: boolean;
  /** When true, Save is visually emphasized (unsaved edits). */
  isDirty?: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  /** Persist selection/scroll before toolbar steals focus. */
  onRememberCaret?: () => void;
  /** Live caret when focused, else last remembered position. */
  readCaret?: () => TextareaCaret;
  fileInput: React.ReactNode;
};

/**
 * Distraction-free writing board: fullscreen editor + floating draggable gadget dock.
 */
export function MarkdownFocusBoard({
  open,
  onClose,
  value,
  onChange,
  isFr,
  contentIsFr,
  enableImages = true,
  localePair,
  mirrorMedia,
  onToggleMirror,
  uploading,
  translating,
  onSnippet,
  onPickImage,
  onSyncImages,
  onTranslate,
  onSwitchLocale,
  onSave,
  saving = false,
  saveDisabled = false,
  isDirty = false,
  textareaRef,
  onRememberCaret,
  readCaret,
  fileInput,
}: MarkdownFocusBoardProps) {
  const reduceMotion = useReducedMotion();
  const prefs = useRef(readDockPrefs());
  const [view, setView] = useState<'write' | 'preview'>('write');
  const [orientation, setOrientation] = useState<DockOrientation>(prefs.current.orientation);
  const [pos, setPos] = useState<DockPos>(prefs.current.pos);
  const [mounted, setMounted] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const saveBusy = saving || saveDisabled;

  const runSave = useCallback(() => {
    if (!onSave || saveBusy) return;
    void onSave();
  }, [onSave, saveBusy]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      const mod = e.metaKey || e.ctrlKey;
      if (onSave && mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (!saveBusy) void onSave();
        return;
      }
      if (view !== 'write') return;
      if (mod && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        onSnippet('bold');
        return;
      }
      if (mod && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        onSnippet('italic');
        return;
      }
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onSnippet('link');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, onSave, saveBusy, onSnippet, view]);

  const resolveCaret = useCallback((): TextareaCaret => {
    if (readCaret) return readCaret();
    const el = textareaRef.current;
    if (!el) return { start: value.length, end: value.length, scrollTop: 0 };
    return {
      start: el.selectionStart,
      end: el.selectionEnd,
      scrollTop: el.scrollTop,
    };
  }, [readCaret, textareaRef, value.length]);

  const insertAtCursor = useCallback(
    (text: string) => {
      const caret = resolveCaret();
      const next = value.slice(0, caret.start) + text + value.slice(caret.end);
      onChange(next);
      const el = textareaRef.current;
      const cursor = caret.start + text.length;
      if (el) restoreTextareaCaret(el, cursor, cursor, caret.scrollTop);
    },
    [onChange, resolveCaret, textareaRef, value],
  );

  const jumpToHeading = useCallback(
    (index: number) => {
      const el = textareaRef.current;
      if (!el) return;
      const style = window.getComputedStyle(el);
      const lineHeight = parseFloat(style.lineHeight) || 24;
      const line = value.slice(0, index).split('\n').length;
      const scrollTop = Math.max(0, (line - 3) * lineHeight);
      restoreTextareaCaret(el, index, index, scrollTop);
    },
    [textareaRef, value],
  );

  useEffect(() => {
    if (!open) return;
    writeDockPrefs(pos, orientation);
  }, [open, pos, orientation]);

  useEffect(() => {
    if (!open || view !== 'write') return;
    const t = window.setTimeout(
      () => textareaRef.current?.focus({ preventScroll: true }),
      reduceMotion ? 0 : 420,
    );
    return () => window.clearTimeout(t);
  }, [open, view, textareaRef, reduceMotion]);

  const clampPos = useCallback((next: DockPos): DockPos => {
    const el = dockRef.current;
    const w = el?.offsetWidth ?? 280;
    const h = el?.offsetHeight ?? 48;
    const maxX = Math.max(8, window.innerWidth - w - 8);
    const maxY = Math.max(8, window.innerHeight - h - 8);
    return {
      x: Math.min(Math.max(8, next.x), maxX),
      y: Math.min(Math.max(8, next.y), maxY),
    };
  }, []);

  const onGripPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };
  };

  const onGripPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    setPos(
      clampPos({
        x: drag.origX + (e.clientX - drag.startX),
        y: drag.origY + (e.clientY - drag.startY),
      }),
    );
  };

  const onGripPointerUp = (e: React.PointerEvent) => {
    if (dragRef.current?.pointerId === e.pointerId) dragRef.current = null;
  };

  const toggleOrientation = () => {
    setOrientation((o) => {
      const next = o === 'horizontal' ? 'vertical' : 'horizontal';
      requestAnimationFrame(() => setPos((p) => clampPos(p)));
      return next;
    });
  };

  if (!mounted || typeof document === 'undefined') return null;

  const gadgetBtn =
    'size-8 shrink-0 rounded-md border border-white/10 bg-background/40 text-foreground/90 shadow-none backdrop-blur-sm hover:bg-background/70 hover:text-foreground';

  const formatItems = [
    { key: 'bold' as const, icon: Bold, tip: isFr ? 'Gras' : 'Bold' },
    { key: 'italic' as const, icon: Italic, tip: isFr ? 'Italique' : 'Italic' },
    { key: 'code' as const, icon: Code2, tip: isFr ? 'Code' : 'Code' },
    { key: 'link' as const, icon: Link2, tip: isFr ? 'Lien' : 'Link' },
    { key: 'list' as const, icon: List, tip: isFr ? 'Liste' : 'List' },
  ];

  const board = (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="md-focus-board"
            className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-background"
            role="dialog"
            aria-modal="true"
            aria-label={isFr ? 'Mode focus rédaction' : 'Focus writing mode'}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, clipPath: 'inset(9% 7% 11% 7% round 20px)' }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)' }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    clipPath: 'inset(11% 9% 13% 9% round 18px)',
                    transition: { duration: 0.36, ease: EASE_FOCUS },
                  }
            }
            transition={
              reduceMotion
                ? { duration: 0.12 }
                : { duration: 0.5, ease: EASE_FOCUS }
            }
          >
          {/* Soft atmosphere */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0, transition: { duration: reduceMotion ? 0.1 : 0.28 } }}
            transition={{ duration: reduceMotion ? 0.12 : 0.45, ease: EASE_FOCUS }}
            style={{
              backgroundImage:
                'radial-gradient(ellipse 80% 50% at 50% -10%, hsla(268,52%,45%,0.18), transparent 55%), radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--foreground) 7%, transparent) 1px, transparent 0)',
              backgroundSize: 'auto, 28px 28px',
            }}
          />

          {/* Top bar — slides in like chrome revealing */}
          <motion.div
            className="relative z-10 flex shrink-0 items-center justify-end gap-1.5 px-4 py-2 sm:px-6"
            initial={reduceMotion ? false : { opacity: 0, y: -16 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: reduceMotion ? 0.12 : 0.48,
                ease: EASE_FOCUS,
                delay: reduceMotion ? 0 : 0.08,
              },
            }}
            exit={
              reduceMotion
                ? undefined
                : {
                    opacity: 0,
                    y: -10,
                    transition: { duration: 0.28, ease: EASE_FOCUS },
                  }
            }
          >
            {onSave ? (
              <Button
                type="button"
                size="sm"
                className="h-8 gap-1.5"
                disabled={saveBusy}
                onClick={runSave}
                title={isFr ? 'Enregistrer (⌘/Ctrl+S)' : 'Save (⌘/Ctrl+S)'}
              >
                {saving ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Save className="size-3.5" />
                )}
                {saving
                  ? isFr
                    ? 'Enregistrement…'
                    : 'Saving…'
                  : isFr
                    ? 'Enregistrer'
                    : 'Save'}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                'h-8 gap-1.5 border-white/15 bg-background/35 backdrop-blur-sm',
                view === 'write' && 'border-primary/35 bg-primary/10 text-primary',
              )}
              onClick={() => setView('write')}
            >
              <PenLine className="size-3.5" />
              {isFr ? 'Écrire' : 'Write'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                'h-8 gap-1.5 border-white/15 bg-background/35 backdrop-blur-sm',
                view === 'preview' && 'border-primary/35 bg-primary/10 text-primary',
              )}
              onClick={() => setView('preview')}
            >
              <Eye className="size-3.5" />
              {isFr ? 'Aperçu' : 'Preview'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-8 border-white/15 bg-background/35 backdrop-blur-sm"
              onClick={onClose}
              aria-label={isFr ? 'Quitter le focus' : 'Exit focus'}
              title={isFr ? 'Quitter (Esc)' : 'Exit (Esc)'}
            >
              <X className="size-3.5" />
            </Button>
          </motion.div>

          {/* Writing surface — gentle rise, sidebar cadence */}
          <motion.div
            className="relative z-10 min-h-0 flex-1 px-3 pb-12 sm:px-8 sm:pb-12 md:px-12"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: reduceMotion ? 0.12 : 0.52,
                ease: EASE_FOCUS,
                delay: reduceMotion ? 0 : 0.1,
              },
            }}
            exit={
              reduceMotion
                ? undefined
                : {
                    opacity: 0,
                    y: 14,
                    transition: { duration: 0.3, ease: EASE_FOCUS },
                  }
            }
          >
            <AnimatePresence mode="wait" initial={false}>
              {view === 'write' ? (
                <motion.div
                  key="focus-write"
                  className="h-full"
                  initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: 8 }}
                  transition={{ duration: reduceMotion ? 0.1 : 0.28, ease: EASE_FOCUS }}
                >
                  <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onSelect={onRememberCaret}
                    onKeyUp={onRememberCaret}
                    onMouseUp={onRememberCaret}
                    onBlur={onRememberCaret}
                    className={cn(
                      'h-full min-h-0 w-full resize-none rounded-md border border-white/10',
                      'bg-background/50 font-mono text-[15px] leading-relaxed shadow-none',
                      'backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-primary/30',
                      'px-4 py-5 sm:px-6 sm:py-6 md:px-8',
                    )}
                    placeholder={isFr ? 'Écris librement…' : 'Write freely…'}
                    aria-label={isFr ? 'Éditeur focus' : 'Focus editor'}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="focus-preview"
                  className={cn(
                    'mx-auto h-full max-w-[42rem] overflow-y-auto rounded-md border border-white/10',
                    'bg-background/50 px-5 py-8 backdrop-blur-sm sm:px-8 sm:py-10',
                  )}
                  initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: reduceMotion ? 0.1 : 0.28, ease: EASE_FOCUS }}
                >
                  <p className="mb-6 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {isFr ? 'Aperçu public' : 'Public preview'}
                  </p>
                  <BlogMarkdown
                    content={value}
                    isFr={contentIsFr}
                    variant="preview"
                    emptyLabel={isFr ? 'Rien à prévisualiser.' : 'Nothing to preview.'}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <MarkdownFocusSecondaryDock
            isFr={isFr}
            value={value}
            writable={view === 'write'}
            enableImages={enableImages}
            localePair={localePair}
            mirrorMedia={mirrorMedia}
            translating={translating}
            dockOrientation={orientation}
            onSnippet={onSnippet}
            onJumpToHeading={jumpToHeading}
            onInsertEmoji={insertAtCursor}
            onSyncImages={onSyncImages}
            onToggleMirror={onToggleMirror}
            onTranslate={onTranslate}
            onToggleDockOrientation={toggleOrientation}
          />

          {fileInput}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Dock: separate stacking root so transforms/clip on the board never bury it */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="md-focus-dock"
            ref={dockRef}
            className={cn(
              'pointer-events-auto fixed z-[400] touch-none select-none',
              'rounded-lg border border-white/15 bg-background/80 p-1.5 shadow-none',
              'backdrop-blur-xl backdrop-saturate-150',
            )}
            style={{ left: pos.x, top: pos.y }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.86, y: 14 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: reduceMotion
                ? { duration: 0.1 }
                : { type: 'spring', stiffness: 400, damping: 30, mass: 0.8, delay: 0.22 },
            }}
            exit={
              reduceMotion
                ? undefined
                : {
                    opacity: 0,
                    scale: 0.9,
                    y: 10,
                    transition: { duration: 0.22, ease: EASE_FOCUS },
                  }
            }
          >
        <div
          className={cn(
            'flex gap-1',
            orientation === 'vertical' ? 'flex-col items-center' : 'flex-row items-center',
          )}
        >
          <button
            type="button"
            className={cn(
              'flex shrink-0 items-center justify-center rounded-md text-muted-foreground',
              'cursor-move hover:bg-background/60 hover:text-foreground active:cursor-move',
              orientation === 'vertical' ? 'h-7 w-8' : 'h-8 w-7',
            )}
            aria-label={isFr ? 'Déplacer la barre' : 'Move toolbar'}
            title={isFr ? 'Glisser pour déplacer' : 'Drag to move'}
            onPointerDown={onGripPointerDown}
            onPointerMove={onGripPointerMove}
            onPointerUp={onGripPointerUp}
            onPointerCancel={onGripPointerUp}
          >
            <GripVertical className="size-3.5 opacity-80" />
          </button>

          {view === 'write' ? (
            <>
              <div className="inline-flex items-stretch">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className={cn(gadgetBtn, 'rounded-r-none border-r-0')}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSnippet('h2')}
                  title="H2"
                >
                  <Heading2 className="size-3.5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className={cn(gadgetBtn, 'w-6 rounded-l-none px-0')}
                      title={isFr ? 'Titres H3–H6' : 'Headings H3–H6'}
                      onMouseDown={() => onRememberCaret?.()}
                    >
                      <ChevronDown className="size-3 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="z-[450] min-w-[7.5rem]">
                    <DropdownMenuLabel className="text-[10px] uppercase tracking-wide">
                      {isFr ? 'Titre' : 'Heading'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {EXTRA_HEADINGS.map(({ key, label }) => (
                      <DropdownMenuItem
                        key={key}
                        className="cursor-pointer text-xs font-medium"
                        onSelect={() => onSnippet(key)}
                      >
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {formatItems.map(({ key, icon: Icon, tip }) => (
                <Button
                  key={key}
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className={gadgetBtn}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSnippet(key)}
                  title={tip}
                  aria-label={tip}
                >
                  <Icon className="size-3.5" />
                </Button>
              ))}

              {enableImages ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className={gadgetBtn}
                  disabled={uploading}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={onPickImage}
                  title={isFr ? 'Insérer une image' : 'Insert image'}
                >
                  {uploading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <ImagePlus className="size-3.5" />
                  )}
                </Button>
              ) : null}
            </>
          ) : null}

          {localePair && onSwitchLocale ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className={cn(
                gadgetBtn,
                'min-w-8 gap-0.5 px-1.5 text-[10px] font-semibold tracking-wide',
              )}
              onMouseDown={(e) => e.preventDefault()}
              onClick={onSwitchLocale}
              title={
                isFr
                  ? `Éditer la version ${localePair.siblingLabel}`
                  : `Edit ${localePair.siblingLabel} version`
              }
              aria-label={
                isFr
                  ? `Passer à l’édition ${localePair.siblingLabel}`
                  : `Switch to ${localePair.siblingLabel} editing`
              }
            >
              <ArrowLeftRight className="size-3 opacity-80" />
              <span>{localePair.siblingLabel}</span>
            </Button>
          ) : null}

          <div
            className={cn(
              'bg-border/60',
              orientation === 'vertical' ? 'my-0.5 h-px w-6' : 'mx-0.5 h-6 w-px',
            )}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(gadgetBtn, view === 'preview' && 'border-primary/40 bg-primary/15 text-primary')}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setView((v) => (v === 'write' ? 'preview' : 'write'))}
            title={
              view === 'write'
                ? isFr
                  ? 'Aperçu publié'
                  : 'Published preview'
                : isFr
                  ? 'Retour à l’écriture'
                  : 'Back to writing'
            }
          >
            {view === 'write' ? <Eye className="size-3.5" /> : <PenLine className="size-3.5" />}
          </Button>

          {onSave ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className={cn(
                gadgetBtn,
                isDirty && 'border-primary/40 bg-primary/15 text-primary',
              )}
              disabled={saveBusy}
              onMouseDown={(e) => e.preventDefault()}
              onClick={runSave}
              title={isFr ? 'Enregistrer (⌘/Ctrl+S)' : 'Save (⌘/Ctrl+S)'}
              aria-label={isFr ? 'Enregistrer' : 'Save'}
            >
              {saving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
            </Button>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={gadgetBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClose}
            title={isFr ? 'Quitter le focus' : 'Exit focus'}
          >
            <Minimize2 className="size-3.5" />
          </Button>
        </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );

  return createPortal(board, document.body);
}

export function MarkdownFocusTrigger({
  isFr,
  onClick,
  className,
}: {
  isFr: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      onClick={onClick}
      className={cn('rounded-lg', className)}
      aria-label={isFr ? 'Mode focus plein écran' : 'Fullscreen focus mode'}
      title={isFr ? 'Focus — grand board d’édition' : 'Focus — large writing board'}
    >
      <Maximize2 className="size-3.5" />
    </Button>
  );
}
