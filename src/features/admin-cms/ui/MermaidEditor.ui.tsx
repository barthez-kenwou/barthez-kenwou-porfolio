import { useEffect, useId, useRef, useState } from 'react';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { useThemeStore } from '@/shared/state/useThemeStore';
import { cn } from '@/shared/lib/utils';
import { cleanupMermaidDomArtifacts, renderMermaidSvg } from '@/shared/lib/renderMermaid';

export type MermaidEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  title?: string;
  className?: string;
  rows?: number;
};

export function MermaidEditor({
  label,
  value,
  onChange,
  title,
  className,
  rows = 12,
}: MermaidEditorProps) {
  const language = useLanguageStore((s) => s.language);
  const isFr = language === 'fr';
  const theme = useThemeStore((s) => s.theme);
  const [mode, setMode] = useState('write');
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const renderId = useId().replace(/:/g, '');
  const abortRef = useRef(0);

  useEffect(() => {
    if (mode !== 'preview') return;

    const token = ++abortRef.current;
    setError(null);
    setSvg('');

    if (!value.trim()) {
      setRendering(false);
      return;
    }

    setRendering(true);

    const diagramRenderId = `mermaid-editor-${renderId}-${token}`;

    void (async () => {
      try {
        const rendered = await renderMermaidSvg(
          diagramRenderId,
          value,
          theme === 'dark' ? 'dark' : 'light',
        );
        if (token === abortRef.current) {
          setSvg(rendered);
          setRendering(false);
        }
      } catch (err) {
        cleanupMermaidDomArtifacts(diagramRenderId);
        if (token === abortRef.current) {
          setError(
            isFr
              ? 'Impossible de rendre ce diagramme Mermaid.'
              : 'Unable to render this Mermaid diagram.',
          );
          setRendering(false);
          console.warn('[MermaidEditor]', err);
        }
      }
    })();

    return () => {
      cleanupMermaidDomArtifacts(diagramRenderId);
    };
  }, [mode, value, theme, renderId, isFr]);

  return (
    <div className={cn('space-y-2.5', className)}>
      <div className="space-y-1">
        <Label className="text-foreground">{label}</Label>
        {title ? <p className="text-xs text-muted-foreground">{title}</p> : null}
      </div>

      <Tabs value={mode} onValueChange={setMode} className="gap-2.5">
        <TabsList className="h-9">
          <TabsTrigger value="write">{isFr ? 'Écrire' : 'Write'}</TabsTrigger>
          <TabsTrigger value="preview">{isFr ? 'Aperçu' : 'Preview'}</TabsTrigger>
        </TabsList>

        <TabsContent value="write">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className="min-h-[220px] resize-y font-mono text-sm leading-relaxed"
            placeholder={'flowchart TD\n  A --> B'}
            aria-label={label}
            spellCheck={false}
          />
        </TabsContent>

        <TabsContent value="preview">
          <div className="min-h-[220px] overflow-x-auto rounded-xl border border-border/60 bg-card/40 p-4 shadow-xs">
            {!value.trim() && (
              <p className="text-sm text-muted-foreground">
                {isFr ? 'Rien à prévisualiser.' : 'Nothing to preview.'}
              </p>
            )}
            {value.trim() && rendering && !error && !svg && (
              <p className="text-sm text-muted-foreground">
                {isFr ? 'Rendu du diagramme…' : 'Rendering diagram…'}
              </p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {svg && !error && (
              <div
                className="mermaid-diagram mx-auto flex min-w-0 justify-center [&_svg]:h-auto [&_svg]:max-w-full"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
