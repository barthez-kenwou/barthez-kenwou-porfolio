import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bold,
  ChevronDown,
  Code2,
  CopyPlus,
  FileImage,
  Heading2,
  ImagePlus,
  Images,
  Italic,
  Languages,
  Link2,
  List,
  Loader2,
  Table2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { INLINE_COMPRESS } from '@/shared/lib/compressImage';
import { isApiError } from '@/shared/api';
import { BlogMarkdown } from '@/shared/ui/markdown/BlogMarkdown';
import { uploadAdminImage } from '../api/files.api';
import { translateAdminMarkdown, type TranslateLang } from '../api/translate.api';
import {
  buildImageMarkdown,
  extractMarkdownImages,
  markdownContainsImageUrl,
  mirrorImageIntoSibling,
  syncMissingImagesFromSource,
} from '../lib/markdownImages';
import {
  MarkdownFocusBoard,
  MarkdownFocusTrigger,
  type FocusToolbarAction,
} from './MarkdownFocusBoard.ui';

export type MarkdownLocalePair = {
  /** Sibling language body (e.g. EN while editing FR) */
  siblingValue: string;
  onSiblingChange: (value: string) => void;
  /** Short label shown in UI, e.g. "EN" */
  siblingLabel: string;
};

export type MarkdownEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  languageLabel?: string;
  className?: string;
  rows?: number;
  /** Upload + insert `![caption](url)` into the markdown body */
  enableImages?: boolean;
  /**
   * When set (blog FR/EN pair), new images can be mirrored to the sibling locale
   * and missing media can be synced in one click.
   */
  localePair?: MarkdownLocalePair;
  /** Focus board: save parent entity without exiting fullscreen. */
  onSave?: () => void | Promise<void>;
  saving?: boolean;
  saveDisabled?: boolean;
  isDirty?: boolean;
};

type Snippet = {
  before: string;
  after?: string;
  placeholder?: string;
  block?: boolean;
};

const SNIPPETS: Record<string, Snippet> = {
  h2: { before: '## ', placeholder: 'Heading', block: true },
  h3: { before: '### ', placeholder: 'Heading', block: true },
  h4: { before: '#### ', placeholder: 'Heading', block: true },
  h5: { before: '##### ', placeholder: 'Heading', block: true },
  h6: { before: '###### ', placeholder: 'Heading', block: true },
  bold: { before: '**', after: '**', placeholder: 'bold' },
  italic: { before: '_', after: '_', placeholder: 'italic' },
  code: { before: '`', after: '`', placeholder: 'code' },
  link: { before: '[', after: '](https://)', placeholder: 'label' },
  list: { before: '- ', placeholder: 'item', block: true },
  table: {
    before: '| Column | Column |\n| --- | --- |\n| Cell | Cell |\n',
    block: true,
  },
  imageUrl: {
    before: '![',
    after: '](https://)',
    placeholder: 'caption',
    block: true,
  },
};

const EXTRA_HEADINGS = [
  { key: 'h3' as const, label: 'H3' },
  { key: 'h4' as const, label: 'H4' },
  { key: 'h5' as const, label: 'H5' },
  { key: 'h6' as const, label: 'H6' },
];

function insertSnippet(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  snippet: Snippet,
): { next: string; cursor: number } {
  const selected = value.slice(selectionStart, selectionEnd);
  const content = selected || snippet.placeholder || '';
  const prefix =
    snippet.block && selectionStart > 0 && value[selectionStart - 1] !== '\n' ? '\n' : '';
  const insertion = `${prefix}${snippet.before}${content}${snippet.after ?? ''}`;
  const next = value.slice(0, selectionStart) + insertion + value.slice(selectionEnd);
  const cursor =
    selectionStart +
    prefix.length +
    snippet.before.length +
    (selected ? selected.length : (snippet.placeholder?.length ?? 0));
  return { next, cursor };
}

function insertImageMarkdown(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  url: string,
  caption: string,
): { next: string; cursor: number } {
  const selected = value.slice(selectionStart, selectionEnd).trim();
  const alt = selected || caption;
  const prefix =
    selectionStart > 0 && value[selectionStart - 1] !== '\n'
      ? '\n\n'
      : selectionStart > 0
        ? '\n'
        : '';
  const suffix = '\n\n';
  const insertion = `${prefix}${buildImageMarkdown(alt, url)}${suffix}`;
  const next = value.slice(0, selectionStart) + insertion + value.slice(selectionEnd);
  const cursor = selectionStart + insertion.length;
  return { next, cursor };
}

export function MarkdownEditor({
  label,
  value,
  onChange,
  languageLabel,
  className,
  rows = 12,
  enableImages = true,
  localePair,
  onSave,
  saving = false,
  saveDisabled = false,
  isDirty = false,
}: MarkdownEditorProps) {
  const language = useLanguageStore((s) => s.language);
  const isFr = language === 'fr';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState('write');
  const [uploading, setUploading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  /** In focus board: edit primary tab content or the sibling locale without leaving. */
  const [focusEditTarget, setFocusEditTarget] = useState<'self' | 'sibling'>('self');
  /** Mirror new uploads into the sibling locale (blog FR↔EN). */
  const [mirrorMedia, setMirrorMedia] = useState(true);

  useEffect(() => {
    if (!focusMode) setFocusEditTarget('self');
  }, [focusMode]);

  const editingSibling = Boolean(
    focusMode && focusEditTarget === 'sibling' && localePair,
  );
  const activeValue = editingSibling && localePair ? localePair.siblingValue : value;
  const activeOnChange =
    editingSibling && localePair ? localePair.onSiblingChange : onChange;
  const activeLanguageLabel =
    editingSibling && localePair ? localePair.siblingLabel : languageLabel;
  const otherLanguageLabel =
    editingSibling && localePair
      ? languageLabel || (localePair.siblingLabel === 'EN' ? 'FR' : 'EN')
      : localePair?.siblingLabel;

  const sourceLang: TranslateLang =
    activeLanguageLabel?.toUpperCase() === 'EN' ? 'en' : 'fr';
  const targetLang: TranslateLang = sourceLang === 'fr' ? 'en' : 'fr';

  const focusAt = useCallback((cursor: number) => {
    requestAnimationFrame(() => {
      const target = textareaRef.current;
      if (!target) return;
      target.focus();
      target.setSelectionRange(cursor, cursor);
    });
  }, []);

  const mirrorImageToSibling = useCallback(
    (url: string, caption: string, sourceCursor: number) => {
      if (!localePair || !mirrorMedia) return false;
      const from = editingSibling ? localePair.siblingValue : value;
      const into = editingSibling ? value : localePair.siblingValue;
      const writeInto = editingSibling ? onChange : localePair.onSiblingChange;
      if (markdownContainsImageUrl(into, url)) return false;
      const { next, added } = mirrorImageIntoSibling(from, sourceCursor, into, {
        alt: caption,
        url,
      });
      if (added > 0) {
        writeInto(next);
        return true;
      }
      return false;
    },
    [editingSibling, localePair, mirrorMedia, onChange, value],
  );

  const syncImagesToSibling = useCallback(() => {
    if (!localePair) return;
    const from = editingSibling ? localePair.siblingValue : value;
    const into = editingSibling ? value : localePair.siblingValue;
    const writeInto = editingSibling ? onChange : localePair.onSiblingChange;
    const towardLabel = otherLanguageLabel || localePair.siblingLabel;
    const images = extractMarkdownImages(from);
    if (images.length === 0) {
      toast.message(
        isFr
          ? 'Aucune image dans ce contenu à synchroniser.'
          : 'No images in this content to sync.',
      );
      return;
    }
    const { next, added, moved } = syncMissingImagesFromSource(from, into);
    if (added === 0 && moved === 0) {
      toast.success(
        isFr
          ? `Aucune image à synchroniser vers ${towardLabel}.`
          : `No images to sync to ${towardLabel}.`,
      );
      return;
    }
    if (next === into) {
      toast.success(
        isFr
          ? `Images déjà bien placées en ${towardLabel}.`
          : `Images already well placed in ${towardLabel}.`,
      );
      return;
    }
    writeInto(next);
    toast.success(
      isFr
        ? `Images alignées sur les sections en ${towardLabel}` +
            (added ? ` · ${added} ajoutée(s)` : '') +
            (moved ? ` · ${moved} repositionnée(s)` : '') +
            '.'
        : `Images aligned to sections in ${towardLabel}` +
            (added ? ` · ${added} added` : '') +
            (moved ? ` · ${moved} repositioned` : '') +
            '.',
    );
  }, [editingSibling, isFr, localePair, onChange, otherLanguageLabel, value]);

  const onTranslateToSibling = useCallback(async () => {
    if (!localePair) return;
    const from = editingSibling ? localePair.siblingValue : value;
    const writeInto = editingSibling ? onChange : localePair.onSiblingChange;
    if (!from.trim()) {
      toast.error(
        isFr ? 'Écris d’abord le contenu source' : 'Write the source content first',
      );
      return;
    }
    setTranslating(true);
    try {
      const out = await translateAdminMarkdown(from, sourceLang, targetLang);
      writeInto(out);
      toast.success(
        isFr
          ? `Traduit ${sourceLang.toUpperCase()} → ${targetLang.toUpperCase()} — images replacées aux bonnes sections`
          : `Translated ${sourceLang.toUpperCase()} → ${targetLang.toUpperCase()} — images placed back into sections`,
      );
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : isFr
            ? 'Traduction impossible'
            : 'Translation failed',
      );
    } finally {
      setTranslating(false);
    }
  }, [editingSibling, isFr, localePair, onChange, sourceLang, targetLang, value]);

  const applySnippet = useCallback(
    (key: FocusToolbarAction | keyof typeof SNIPPETS) => {
      const snippet = SNIPPETS[key];
      if (!snippet) return;
      const el = textareaRef.current;
      const start = el?.selectionStart ?? activeValue.length;
      const end = el?.selectionEnd ?? activeValue.length;
      const { next, cursor } = insertSnippet(activeValue, start, end, snippet);
      activeOnChange(next);
      focusAt(cursor);
    },
    [activeOnChange, activeValue, focusAt],
  );

  const onImageFile = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(isFr ? 'Fichier image requis' : 'Image file required');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadAdminImage(file, INLINE_COMPRESS);
      const el = textareaRef.current;
      const start = el?.selectionStart ?? activeValue.length;
      const end = el?.selectionEnd ?? activeValue.length;
      const caption =
        file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() ||
        (isFr ? 'Image' : 'Image');
      const { next, cursor } = insertImageMarkdown(
        activeValue,
        start,
        end,
        url,
        caption,
      );
      activeOnChange(next);
      focusAt(cursor);
      const mirrored = mirrorImageToSibling(url, caption, start);
      const here = activeLanguageLabel || languageLabel || 'FR';
      const there = otherLanguageLabel || localePair?.siblingLabel;
      toast.success(
        mirrored && there
          ? isFr
            ? `Image compressée et insérée (${here} + ${there}).`
            : `Image compressed and inserted (${here} + ${there}).`
          : isFr
            ? 'Image compressée et insérée'
            : 'Image compressed and inserted',
      );
    } catch (e) {
      toast.error(
        isApiError(e)
          ? e.message
          : e instanceof Error
            ? e.message
            : isFr
              ? 'Échec du téléversement'
              : 'Upload failed',
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toolbar = [
    { key: 'bold' as const, icon: Bold, label: isFr ? 'Gras' : 'Bold' },
    { key: 'italic' as const, icon: Italic, label: isFr ? 'Italique' : 'Italic' },
    { key: 'code' as const, icon: Code2, label: isFr ? 'Code' : 'Code' },
    { key: 'link' as const, icon: Link2, label: isFr ? 'Lien' : 'Link' },
    { key: 'list' as const, icon: List, label: isFr ? 'Liste' : 'List' },
    { key: 'table' as const, icon: Table2, label: isFr ? 'Tableau' : 'Table' },
  ];

  return (
    <div className={cn('space-y-2.5', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-foreground">{label}</Label>
          {languageLabel ? (
            <Badge variant="secondary" className="text-[10px] tracking-wide">
              {languageLabel}
            </Badge>
          ) : null}
        </div>
        {localePair ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={cn(
              'h-8 gap-1 px-2.5 shadow-none',
              translating
                ? 'cursor-wait disabled:cursor-wait disabled:opacity-80'
                : 'cursor-pointer',
            )}
            disabled={translating || uploading || !value.trim()}
            onClick={() => void onTranslateToSibling()}
            aria-busy={translating}
            aria-label={
              translating
                ? isFr
                  ? 'Traduction en cours…'
                  : 'Translating…'
                : isFr
                  ? `Traduire vers ${targetLang.toUpperCase()}`
                  : `Translate to ${targetLang.toUpperCase()}`
            }
            title={
              translating
                ? isFr
                  ? 'Traduction en cours…'
                  : 'Translating…'
                : isFr
                  ? `Traduire le markdown vers ${targetLang.toUpperCase()} (images / code conservés)`
                  : `Translate markdown to ${targetLang.toUpperCase()} (images / code kept)`
            }
          >
            {translating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Languages className="size-3.5" />
            )}
            <span className="text-xs font-medium tracking-wide">
              → {targetLang.toUpperCase()}
            </span>
          </Button>
        ) : null}
      </div>

      <Tabs value={mode} onValueChange={setMode} className="gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList className="h-9">
            <TabsTrigger value="write">{isFr ? 'Écrire' : 'Write'}</TabsTrigger>
            <TabsTrigger value="preview">{isFr ? 'Aperçu' : 'Preview'}</TabsTrigger>
          </TabsList>
          {mode === 'write' ? (
            <div className="flex flex-wrap items-center gap-1">
              <MarkdownFocusTrigger isFr={isFr} onClick={() => setFocusMode(true)} />
              {/* H2 primary + discreet menu for H3–H6 */}
              <div className="inline-flex items-stretch">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => applySnippet('h2')}
                  aria-label="H2"
                  title="H2"
                  className="rounded-lg rounded-r-none border-r-0"
                >
                  <Heading2 className="size-3.5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="w-6 rounded-lg rounded-l-none px-0"
                      aria-label={
                        isFr ? 'Autres niveaux de titre' : 'Other heading levels'
                      }
                      title={
                        isFr ? 'Titres H3–H6' : 'Headings H3–H6'
                      }
                    >
                      <ChevronDown className="size-3 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[7.5rem]">
                    <DropdownMenuLabel className="text-[10px] uppercase tracking-wide">
                      {isFr ? 'Titre' : 'Heading'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {EXTRA_HEADINGS.map(({ key, label: headingLabel }) => (
                      <DropdownMenuItem
                        key={key}
                        className="cursor-pointer text-xs font-medium"
                        onSelect={() => applySnippet(key)}
                      >
                        {headingLabel}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {toolbar.map(({ key, icon: Icon, label: tip }) => (
                <Button
                  key={key}
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => applySnippet(key)}
                  aria-label={tip}
                  title={tip}
                  className="rounded-lg"
                >
                  <Icon className="size-3.5" />
                </Button>
              ))}
              {enableImages ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    aria-label={isFr ? 'Insérer une image' : 'Insert image'}
                    title={
                      isFr
                        ? 'Téléverser et insérer une image'
                        : 'Upload and insert an image'
                    }
                    className="rounded-lg"
                  >
                    {uploading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <ImagePlus className="size-3.5" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => applySnippet('imageUrl')}
                    aria-label={isFr ? 'Image par URL' : 'Image from URL'}
                    title={
                      isFr
                        ? 'Insérer une image via URL (![caption](url))'
                        : 'Insert image via URL (![caption](url))'
                    }
                    className="rounded-lg"
                  >
                    <FileImage className="size-3.5" />
                  </Button>
                  {localePair ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={syncImagesToSibling}
                        aria-label={
                          isFr
                            ? `Synchroniser les images vers ${localePair.siblingLabel}`
                            : `Sync images to ${localePair.siblingLabel}`
                        }
                        title={
                          isFr
                            ? `Aligner les images sur les sections ${localePair.siblingLabel}`
                            : `Align images to ${localePair.siblingLabel} sections`
                        }
                        className="rounded-lg"
                      >
                        <Images className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-pressed={mirrorMedia}
                        onClick={() => setMirrorMedia((v) => !v)}
                        aria-label={
                          isFr
                            ? `Miroir médias vers ${localePair.siblingLabel}`
                            : `Mirror media to ${localePair.siblingLabel}`
                        }
                        title={
                          mirrorMedia
                            ? isFr
                              ? `Miroir ON — nouvelles images aussi en ${localePair.siblingLabel}`
                              : `Mirror ON — new images also in ${localePair.siblingLabel}`
                            : isFr
                              ? `Miroir OFF — images seulement ici`
                              : `Mirror OFF — images only here`
                        }
                        className={cn(
                          'rounded-lg',
                          mirrorMedia &&
                            'border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary',
                        )}
                      >
                        <CopyPlus className="size-3.5" />
                      </Button>
                    </>
                  ) : null}
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        <TabsContent value="write">
          {!focusMode ? (
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={rows}
              className="min-h-[220px] resize-y font-mono text-sm leading-relaxed"
              placeholder={isFr ? 'Rédigez en Markdown…' : 'Write Markdown…'}
              aria-label={label}
            />
          ) : (
            <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/15 px-4 text-center text-sm text-muted-foreground">
              {isFr
                ? 'Mode focus actif — l’édition se fait sur le grand board.'
                : 'Focus mode active — editing happens on the large board.'}
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview">
          <div className="min-h-[280px] overflow-hidden rounded-xl border border-border/60 bg-background shadow-xs">
            <div className="border-b border-border/50 bg-muted/25 px-3 py-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {isFr ? 'Aperçu public (article)' : 'Public article preview'}
              </p>
            </div>
            <div className="px-4 py-6 sm:px-6 md:px-8 md:py-8">
              <div className="mx-auto w-full max-w-[42rem]">
                <BlogMarkdown
                  content={value}
                  isFr={languageLabel ? languageLabel.toUpperCase() === 'FR' : isFr}
                  variant="preview"
                  emptyLabel={isFr ? 'Rien à prévisualiser.' : 'Nothing to preview.'}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {enableImages ? (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => void onImageFile(e.target.files?.[0] ?? null)}
        />
      ) : null}

      <MarkdownFocusBoard
        open={focusMode}
        onClose={() => setFocusMode(false)}
        value={activeValue}
        onChange={activeOnChange}
        languageLabel={activeLanguageLabel}
        isFr={isFr}
        contentIsFr={
          activeLanguageLabel
            ? activeLanguageLabel.toUpperCase() === 'FR'
            : isFr
        }
        enableImages={enableImages}
        localePair={
          localePair && otherLanguageLabel
            ? { siblingLabel: otherLanguageLabel }
            : undefined
        }
        mirrorMedia={mirrorMedia}
        onToggleMirror={() => setMirrorMedia((v) => !v)}
        uploading={uploading}
        translating={translating}
        onSnippet={applySnippet}
        onPickImage={() => fileInputRef.current?.click()}
        onSyncImages={syncImagesToSibling}
        onTranslate={() => void onTranslateToSibling()}
        onSwitchLocale={
          localePair
            ? () => {
                setFocusEditTarget((t) => (t === 'self' ? 'sibling' : 'self'));
                requestAnimationFrame(() => textareaRef.current?.focus());
              }
            : undefined
        }
        onSave={onSave}
        saving={saving}
        saveDisabled={saveDisabled}
        isDirty={isDirty}
        textareaRef={textareaRef}
        fileInput={null}
      />
    </div>
  );
}
