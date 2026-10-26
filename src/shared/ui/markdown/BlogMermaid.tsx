import React, { useEffect, useId, useState } from 'react';
import { useThemeStore } from '@/shared/state/useThemeStore';
import { cleanupMermaidDomArtifacts, renderMermaidSvg } from '@/shared/lib/renderMermaid';
import { cn } from '@/shared/lib/utils';

/** Renders a ```mermaid fence inside blog markdown (article + CMS preview). */
export function BlogMermaid({ definition, className }: { definition: string; className?: string }) {
  const theme = useThemeStore((s) => s.theme);
  const renderId = useId().replace(/:/g, '');
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    const id = `blog-mermaid-${renderId}`;
    setError(false);
    setSvg('');

    if (!definition.trim()) return;

    void (async () => {
      try {
        const out = await renderMermaidSvg(id, definition, theme === 'dark' ? 'dark' : 'light');
        if (alive) setSvg(out);
      } catch {
        cleanupMermaidDomArtifacts(id);
        if (alive) setError(true);
      }
    })();

    return () => {
      alive = false;
      cleanupMermaidDomArtifacts(id);
    };
  }, [definition, renderId, theme]);

  if (error) {
    return (
      <pre className="my-6 overflow-x-auto rounded-md border border-destructive/30 bg-destructive/5 p-3 font-mono text-xs text-destructive">
        {definition}
      </pre>
    );
  }

  if (!svg) {
    return (
      <div
        className={cn(
          'my-6 flex min-h-24 items-center justify-center rounded-md border border-border/60 bg-muted/20 text-xs text-muted-foreground',
          className,
        )}
      >
        Mermaid…
      </div>
    );
  }

  return (
    <div
      className={cn(
        'my-6 overflow-x-auto rounded-md border border-border/50 bg-background/40 p-3 [&_svg]:mx-auto [&_svg]:max-w-full',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
