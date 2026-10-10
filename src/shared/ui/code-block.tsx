import React, { useState, useEffect } from 'react';
import { createHighlighter, Highlighter } from 'shiki';
import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/shared/state/useThemeStore';

interface CodeBlockProps {
  language: string;
  value: string;
  filename?: string;
  className?: string;
}

const LIGHT_THEME = 'github-light-high-contrast';
const DARK_THEME = 'github-dark-dimmed';

let highlighterCache: Highlighter | null = null;
let highlighterReady: Promise<Highlighter> | null = null;

async function getHighlighter() {
  if (highlighterCache) return highlighterCache;
  if (!highlighterReady) {
    highlighterReady = createHighlighter({
      themes: [LIGHT_THEME, DARK_THEME],
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
    }).then((h) => {
      highlighterCache = h;
      return h;
    });
  }
  return highlighterReady;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, value, filename, className }) => {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const shikiTheme = isDark ? DARK_THEME : LIGHT_THEME;

  const [html, setHtml] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function highlight() {
      setIsLoading(true);
      try {
        const highlighter = await getHighlighter();
        const highlighted = highlighter.codeToHtml(value, {
          lang: language || 'text',
          theme: shikiTheme,
          transformers: [transformerNotationDiff(), transformerNotationHighlight()],
        });
        if (!cancelled) {
          setHtml(highlighted);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setHtml(
            `<pre><code>${value
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')}</code></pre>`,
          );
          setIsLoading(false);
        }
      }
    }

    void highlight();
    return () => {
      cancelled = true;
    };
  }, [value, language, shikiTheme]);

  const copyToClipboard = () => {
    void navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'group relative my-3 w-full overflow-hidden rounded-sm border border-border bg-card font-mono text-sm shadow-sm',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border bg-secondary/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5" aria-hidden>
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/90" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/90" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/90" />
          </div>
          {filename ? (
            <span className="ml-3 text-[11px] font-semibold tracking-tight text-foreground/80">
              {filename}
            </span>
          ) : null}
          {!filename && language ? (
            <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-foreground/70">
              {language}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-[11px] font-semibold text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-600 dark:text-green-500" />
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

      <div
        className={cn(
          'relative overflow-x-auto p-4 md:p-5 custom-scrollbar',
          isDark ? 'bg-[#22272e]' : 'bg-[#f6f8fa]',
        )}
      >
        {isLoading ? (
          <div className="flex min-h-[100px] items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className={cn(
              'text-[13px] leading-relaxed md:text-sm',
              '[&>pre]:!m-0 [&>pre]:!bg-transparent [&>pre]:!p-0',
              '[&_code]:!bg-transparent [&_code]:!text-[inherit]',
              // Light mode: keep token contrast; never wash colors with low opacity
              !isDark && '[&_.line]:text-[#24292f]',
            )}
          />
        )}
      </div>
    </div>
  );
};
