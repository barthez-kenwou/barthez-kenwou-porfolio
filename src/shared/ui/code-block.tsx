import React, { useMemo, useState, useEffect } from 'react';
import { createHighlighter, Highlighter } from 'shiki';
import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  language: string;
  value: string;
  filename?: string;
  className?: string;
}

let highlighterCache: Highlighter | null = null;

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, value, filename, className }) => {
  const [html, setHtml] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function highlight() {
      if (!highlighterCache) {
        highlighterCache = await createHighlighter({
          themes: ['github-dark-dimmed', 'ayu-mirage'],
          langs: [
            'javascript',
            'typescript',
            'bash',
            'yaml',
            'json',
            'python',
            'markdown',
            'html',
            'css',
            'go',
            'rust',
            'dockerfile',
          ],
        });
      }

      const highlighted = highlighterCache.codeToHtml(value, {
        lang: language || 'text',
        theme: 'github-dark-dimmed',
        transformers: [transformerNotationDiff(), transformerNotationHighlight()],
      });

      setHtml(highlighted);
      setIsLoading(false);
    }

    highlight();
  }, [value, language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'group relative my-3 w-full overflow-hidden rounded-sm border border-border/50 bg-card font-mono text-sm shadow-sm transition-all hover:shadow-primary/5',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-secondary/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.3)]" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>
          {filename && (
            <span className="ml-3 text-[11px] font-medium text-muted-foreground/80 tracking-tight">
              {filename}
            </span>
          )}
          {!filename && language && (
            <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              {language}
            </span>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 rounded-md border border-border/50 bg-secondary/30 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-all hover:bg-secondary/50 hover:text-foreground active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-500" />
              <span>Copié !</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="relative overflow-x-auto p-4 md:p-6 custom-scrollbar">
        {isLoading ? (
          <div className="flex min-h-[100px] items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className="[&>pre]:!m-0 [&>pre]:!bg-transparent [&>pre]:!p-0"
          />
        )}
      </div>

      {/* Decorative Gradient Background */}
      <div className="absolute -right-20 -top-20 -z-10 h-40 w-40 rounded-full bg-primary/10 blur-[80px]" />
      <div className="absolute -bottom-20 -left-20 -z-10 h-40 w-40 rounded-full bg-primary/5 blur-[80px]" />
    </div>
  );
};
