import { useCallback, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bold,
  Code2,
  FileImage,
  Heading2,
  ImagePlus,
  Italic,
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
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { isApiError } from '@/shared/api';
import { MarkdownFigure } from '@/shared/ui/markdown/MarkdownFigure';
import { uploadAdminImage } from '../api/files.api';

export type MarkdownEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  languageLabel?: string;
  className?: string;
  rows?: number;
  /** Upload + insert `![caption](url)` into the markdown body */
  enableImages?: boolean;
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
    selectionStart > 0 && value[selectionStart - 1] !== '\n' ? '\n\n' : selectionStart > 0 ? '\n' : '';
  const suffix = '\n\n';
  const insertion = `${prefix}![${alt}](${url})${suffix}`;
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
}: MarkdownEditorProps) {
  const language = useLanguageStore((s) => s.language);
  const isFr = language === 'fr';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState('write');
  const [uploading, setUploading] = useState(false);

  const focusAt = useCallback((cursor: number) => {
    requestAnimationFrame(() => {
      const target = textareaRef.current;
      if (!target) return;
      target.focus();
      target.setSelectionRange(cursor, cursor);
    });
  }, []);

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
      const url = await uploadAdminImage(file);
      const el = textareaRef.current;
      const start = el?.selectionStart ?? value.length;
      const end = el?.selectionEnd ?? value.length;
      const caption =
        file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() ||
        (isFr ? 'Image' : 'Image');
      const { next, cursor } = insertImageMarkdown(value, start, end, url, caption);
      onChange(next);
      focusAt(cursor);
      toast.success(isFr ? 'Image insérée' : 'Image inserted');
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
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        {enableImages && mode === 'write' ? (
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {isFr
              ? 'Images : icône + pour téléverser, icône fichier pour un snippet URL. L’alt Markdown devient la légende.'
              : 'Images: + icon uploads, file icon inserts a URL snippet. Markdown alt text becomes the caption.'}
          </p>
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
          <div className="prose prose-sm dark:prose-invert max-w-none min-h-[220px] rounded-xl border border-border/60 bg-card/40 px-4 py-3 shadow-xs">
            {value.trim() ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ src, alt, title }) => (
                    <MarkdownFigure src={src} alt={alt} title={title} />
                  ),
                  p: ({ children }) => {
                    const kids = Array.isArray(children) ? children : [children];
                    const onlyFigure =
                      kids.length === 1 &&
                      typeof kids[0] === 'object' &&
                      kids[0] !== null &&
                      'props' in (kids[0] as object) &&
                      Boolean(
                        (kids[0] as { props?: { 'data-md-figure'?: string } }).props?.[
                          'data-md-figure'
                        ],
                      );
                    if (onlyFigure) return <>{kids[0]}</>;
                    return <p>{children}</p>;
                  },
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-sm text-muted-foreground">
                {isFr ? 'Rien à prévisualiser.' : 'Nothing to preview.'}
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
