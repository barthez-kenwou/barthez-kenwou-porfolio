import React, { useEffect, useId, useRef, useState } from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';
import { cn } from '@/shared/lib/utils';
import { useThemeStore } from '@/shared/state/useThemeStore';

export const ProjectDiagramsSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const theme = useThemeStore((s) => s.theme);
  const isFr = language === 'fr';
  const diagrams = project.diagrams ?? [];
  const [active, setActive] = useState(0);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const renderId = useId().replace(/:/g, '');
  const abortRef = useRef(0);

  useEffect(() => {
    if (diagrams.length === 0) return;
    const current = diagrams[Math.min(active, diagrams.length - 1)];
    if (!current) return;

    const token = ++abortRef.current;
    setError(null);
    setSvg('');

    void (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: theme === 'dark' ? 'dark' : 'neutral',
          fontFamily: 'inherit',
        });
        const { svg: rendered } = await mermaid.render(
          `project-diagram-${renderId}-${current.id}`,
          current.mermaid,
        );
        if (token === abortRef.current) setSvg(rendered);
      } catch (err) {
        if (token === abortRef.current) {
          setError(isFr ? 'Impossible de rendre ce diagramme.' : 'Unable to render this diagram.');
          console.warn('[ProjectDiagrams]', err);
        }
      }
    })();
  }, [active, diagrams, theme, renderId, isFr]);

  if (diagrams.length === 0) return null;

  const current = diagrams[Math.min(active, diagrams.length - 1)]!;
  const title = isFr ? current.titleFr : current.titleEn;

  return (
    <ProjectSectionShell title={isFr ? 'Diagrammes' : 'Diagrams'}>
      {diagrams.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {diagrams.map((d, idx) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActive(idx)}
              className={cn(
                'px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer',
                idx === active
                  ? 'bg-primary/15 border-primary/40 text-foreground'
                  : 'bg-card/40 border-border/40 text-muted-foreground hover:border-primary/25',
              )}
            >
              {isFr ? d.titleFr : d.titleEn}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-md border border-border/40 bg-card/40 p-4 md:p-6 overflow-x-auto">
        <p className="text-sm font-medium text-foreground mb-4">{title}</p>
        {error && <p className="text-sm text-muted-foreground">{error}</p>}
        {!error && !svg && (
          <p className="text-sm text-muted-foreground">
            {isFr ? 'Rendu du diagramme…' : 'Rendering diagram…'}
          </p>
        )}
        {svg && (
          <div
            className="mermaid-diagram min-w-0 [&_svg]:max-w-full [&_svg]:h-auto mx-auto flex justify-center"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </div>
    </ProjectSectionShell>
  );
};
