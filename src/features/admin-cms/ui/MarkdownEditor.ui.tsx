import { useCallback, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bold, Code2, Heading2, Italic, Link2, List, Table2 } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';

export type MarkdownEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  languageLabel?: string;
  className?: string;
  rows?: number;
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

export function MarkdownEditor({
  label,
  value,
  onChange,
  languageLabel,
  className,
  rows = 12,
}: MarkdownEditorProps) {
  const language = useLanguageStore((s) => s.language);
  const isFr = language === 'fr';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState('write');

  const applySnippet = useCallback(
    (key: keyof typeof SNIPPETS) => {
      const snippet = SNIPPETS[key];
      if (!snippet) return;
      const el = textareaRef.current;
      const start = el?.selectionStart ?? value.length;
      const end = el?.selectionEnd ?? value.length;
      const { next, cursor } = insertSnippet(value, start, end, snippet);
      onChange(next);
      requestAnimationFrame(() => {
        const target = textareaRef.current;
        if (!target) return;
        target.focus();
        target.setSelectionRange(cursor, cursor);
      });
    },
    [onChange, value],
  );

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
            </div>
          ) : null}
        </div>

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
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
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
