import { useCallback, useRef, useState } from 'react';
import {
  Bold,
  Code2,
  FileImage,
  Heading2,
  ImagePlus,
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
import { Switch } from '@/shared/ui/switch';
import { Textarea } from '@/shared/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { INLINE_COMPRESS } from '@/shared/lib/compressImage';
import { isApiError } from '@/shared/api';
import { BlogMarkdown } from '@/shared/ui/markdown/BlogMarkdown';
import { uploadAdminImage } from '../api/files.api';
import {
  appendMissingImages,
  buildImageMarkdown,
  extractMarkdownImages,
  markdownContainsImageUrl,
} from '../lib/markdownImages';

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
};

type Snippet = {
  before: string;
  after?: string;
  placeholder?: string;
  block?: boolean;
};

const SNIPPETS: Record<string, Snippet> = {
  h2: { before: '## ', placeholder: 'Heading', block: true },
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
}: MarkdownEditorProps) {
  const language = useLanguageStore((s) => s.language);
  const isFr = language === 'fr';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState('write');
  const [uploading, setUploading] = useState(false);
  /** Mirror new uploads into the sibling locale (blog FR↔EN). */
  const [mirrorMedia, setMirrorMedia] = useState(true);

  const focusAt = useCallback((cursor: number) => {
    requestAnimationFrame(() => {
      const target = textareaRef.current;
      if (!target) return;
      target.focus();
      target.setSelectionRange(cursor, cursor);
    });
  }, []);

  const mirrorImageToSibling = useCallback(
    (url: string, caption: string) => {
      if (!localePair || !mirrorMedia) return false;
      if (markdownContainsImageUrl(localePair.siblingValue, url)) return false;
      const { next, added } = appendMissingImages(localePair.siblingValue, [
        { alt: caption, url },
      ]);
      if (added > 0) {
        localePair.onSiblingChange(next);
        return true;
      }
      return false;
    },
    [localePair, mirrorMedia],
  );

  const syncImagesToSibling = useCallback(() => {
    if (!localePair) return;
    const images = extractMarkdownImages(value);
    if (images.length === 0) {
      toast.message(
        isFr
          ? 'Aucune image dans ce contenu à synchroniser.'
          : 'No images in this content to sync.',
      );
      return;
    }
    const { next, added } = appendMissingImages(localePair.siblingValue, images);
    if (added === 0) {
      toast.success(
        isFr
          ? `Toutes les images sont déjà présentes en ${localePair.siblingLabel}.`
          : `All images are already present in ${localePair.siblingLabel}.`,
      );
      return;
    }
    localePair.onSiblingChange(next);
    toast.success(
      isFr
        ? `${added} image(s) ajoutée(s) en ${localePair.siblingLabel} (légendes à traduire si besoin).`
        : `${added} image(s) added to ${localePair.siblingLabel} (translate captions if needed).`,
    );
  }, [isFr, localePair, value]);

  const applySnippet = useCallback(
    (key: keyof typeof SNIPPETS) => {
      const snippet = SNIPPETS[key];
      if (!snippet) return;
      const el = textareaRef.current;
      const start = el?.selectionStart ?? value.length;
      const end = el?.selectionEnd ?? value.length;
      const { next, cursor } = insertSnippet(value, start, end, snippet);
      onChange(next);
      focusAt(cursor);
    },
    [focusAt, onChange, value],
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
      const start = el?.selectionStart ?? value.length;
      const end = el?.selectionEnd ?? value.length;
      const caption =
        file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() ||
        (isFr ? 'Image' : 'Image');
      const { next, cursor } = insertImageMarkdown(value, start, end, url, caption);
      onChange(next);
      focusAt(cursor);
      const mirrored = mirrorImageToSibling(url, caption);
      toast.success(
        mirrored
          ? isFr
            ? `Image compressée et insérée (${languageLabel || 'FR'} + ${localePair?.siblingLabel}).`
            : `Image compressed and inserted (${languageLabel || 'EN'} + ${localePair?.siblingLabel}).`
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
    { key: 'h2' as const, icon: Heading2, label: 'H2' },
    { key: 'bold' as const, icon: Bold, label: isFr ? 'Gras' : 'Bold' },
    { key: 'italic' as const, icon: Italic, label: isFr ? 'Italique' : 'Italic' },
    { key: 'code' as const, icon: Code2, label: isFr ? 'Code' : 'Code' },
    { key: 'link' as const, icon: Link2, label: isFr ? 'Lien' : 'Link' },
    { key: 'list' as const, icon: List, label: isFr ? 'Liste' : 'List' },
    { key: 'table' as const, icon: Table2, label: isFr ? 'Tableau' : 'Table' },
  ];

  return (
    <div className={cn('space-y-2.5', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Label className="text-foreground">{label}</Label>
        {languageLabel ? (
          <Badge variant="secondary" className="text-[10px] tracking-wide">
            {languageLabel}
          </Badge>
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
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    className="hidden"
                    onChange={(e) => void onImageFile(e.target.files?.[0] ?? null)}
                  />
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
                          ? `Copier les images manquantes vers ${localePair.siblingLabel}`
                          : `Copy missing images to ${localePair.siblingLabel}`
                      }
                      className="rounded-lg"
                    >
                      <Languages className="size-3.5" />
                    </Button>
                  ) : null}
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        {enableImages && localePair && mode === 'write' ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-medium text-foreground">
                {isFr
                  ? `Miroir médias → ${localePair.siblingLabel}`
                  : `Mirror media → ${localePair.siblingLabel}`}
              </p>
              <p className="text-[11px] leading-snug text-muted-foreground">
                {isFr
                  ? 'Les nouvelles images sont aussi ajoutées à l’autre langue (même URL). Traduisez seulement les légendes.'
                  : 'New images are also added to the other language (same URL). Only translate captions.'}
              </p>
            </div>
            <Switch
              checked={mirrorMedia}
              onCheckedChange={setMirrorMedia}
              aria-label={
                isFr
                  ? `Insérer aussi en ${localePair.siblingLabel}`
                  : `Also insert in ${localePair.siblingLabel}`
              }
            />
          </div>
        ) : null}

        <TabsContent value="write">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className="min-h-[220px] resize-y font-mono text-sm leading-relaxed"
            placeholder={isFr ? 'Rédigez en Markdown…' : 'Write Markdown…'}
            aria-label={label}
          />
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
    </div>
  );
}
