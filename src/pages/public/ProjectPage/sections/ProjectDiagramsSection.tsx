import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';
import { cn } from '@/shared/lib/utils';
import { useThemeStore } from '@/shared/state/useThemeStore';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Maximize2,
  Minimize2,
  RefreshCw,
  UnfoldHorizontal,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { cleanupMermaidDomArtifacts, renderMermaidSvg } from '@/shared/lib/renderMermaid';
import { projectDetailTabClass } from './projectDetailTabClass';

const MIN_SCALE = 0.35;
const MAX_SCALE = 3.5;
const ZOOM_STEP = 0.18;
const PAN_STEP = 72;

type ViewState = { scale: number; x: number; y: number };

const INITIAL_VIEW: ViewState = { scale: 1, x: 0, y: 0 };

type ControlBtnProps = {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

const ControlBtn: React.FC<ControlBtnProps> = ({ label, onClick, children, className }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className={cn(
      'inline-flex h-8 w-8 items-center justify-center rounded-md',
      'border border-border/50 bg-background/90 text-foreground/80',
      'shadow-sm backdrop-blur-sm',
      'hover:bg-background hover:text-foreground transition-colors cursor-pointer',
      'dark:bg-black/55 dark:border-white/15 dark:text-white/80 dark:hover:bg-black/75 dark:hover:text-white',
      className,
    )}
  >
    {children}
  </button>
);

type DiagramViewportProps = {
  svg: string;
  title: string;
  isFr: boolean;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onCloseFullscreen?: () => void;
};

const DiagramViewport: React.FC<DiagramViewportProps> = ({
  svg,
  title,
  isFr,
  fullscreen = false,
  onToggleFullscreen,
  onCloseFullscreen,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ViewState>(INITIAL_VIEW);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  const zoomBy = useCallback((delta: number, anchor?: { x: number; y: number }) => {
    setView((prev) => {
      const nextScale = clampScale(prev.scale + delta);
      if (nextScale === prev.scale) return prev;
      if (!anchor || !stageRef.current) {
        return { ...prev, scale: nextScale };
      }
      const rect = stageRef.current.getBoundingClientRect();
      const cx = anchor.x - rect.left;
      const cy = anchor.y - rect.top;
      const ratio = nextScale / prev.scale;
      return {
        scale: nextScale,
        x: cx - (cx - prev.x) * ratio,
        y: cy - (cy - prev.y) * ratio,
      };
    });
  }, []);

  const panBy = useCallback((dx: number, dy: number) => {
    setView((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const resetView = useCallback(() => setView(INITIAL_VIEW), []);

  const fitWidth = useCallback(() => {
    const stage = stageRef.current;
    const content = contentRef.current;
    if (!stage || !content) return;
    const svgEl = content.querySelector('svg');
    if (!svgEl) return;

    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;

    let naturalW = svgEl.viewBox?.baseVal?.width || 0;
    let naturalH = svgEl.viewBox?.baseVal?.height || 0;
    if (!naturalW || !naturalH) {
      try {
        const box = svgEl.getBBox();
        naturalW = box.width;
        naturalH = box.height;
      } catch {
        naturalW = Number(svgEl.getAttribute('width')) || 0;
        naturalH = Number(svgEl.getAttribute('height')) || 0;
      }
    }
    if (!naturalW || !naturalH) return;

    const pad = 36;
    const scale = clampScale(
      Math.min((stageW - pad) / naturalW, (stageH - pad) / naturalH, 1.2),
    );
    setView({
      scale,
      x: (stageW - naturalW * scale) / 2,
      y: (stageH - naturalH * scale) / 2,
    });
  }, []);

  // Fit when a new diagram SVG is injected
  useEffect(() => {
    setView(INITIAL_VIEW);
    const t = window.setTimeout(() => fitWidth(), 50);
    return () => window.clearTimeout(t);
  }, [svg, fitWidth]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('[data-diagram-controls]')) return;
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: view.x,
      originY: view.y,
    };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    setView((prev) => ({
      ...prev,
      x: drag.originX + (e.clientX - drag.startX),
      y: drag.originY + (e.clientY - drag.startY),
    }));
  };

  const endDrag = (e: React.PointerEvent) => {
    if (dragRef.current?.pointerId === e.pointerId) {
      dragRef.current = null;
      setDragging(false);
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    // Trackpad pinch often sends ctrlKey; also allow plain wheel zoom over the stage
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    zoomBy(delta, { x: e.clientX, y: e.clientY });
  };

  const controls = (
    <div
      data-diagram-controls
      className="absolute bottom-3 left-3 z-20 flex flex-col gap-1.5"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="flex gap-1">
        <ControlBtn label={isFr ? 'Ajuster' : 'Fit'} onClick={fitWidth}>
          <UnfoldHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
        </ControlBtn>
        {onToggleFullscreen && (
          <ControlBtn
            label={fullscreen ? (isFr ? 'Réduire' : 'Exit') : isFr ? 'Plein écran' : 'Fullscreen'}
            onClick={onToggleFullscreen}
          >
            {fullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            )}
          </ControlBtn>
        )}
      </div>

      <div className="flex items-end gap-1">
        <div className="grid grid-cols-3 gap-1">
          <span />
          <ControlBtn label={isFr ? 'Haut' : 'Up'} onClick={() => panBy(0, PAN_STEP)}>
            <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.75} />
          </ControlBtn>
          <span />
          <ControlBtn label={isFr ? 'Gauche' : 'Left'} onClick={() => panBy(PAN_STEP, 0)}>
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          </ControlBtn>
          <ControlBtn label={isFr ? 'Réinitialiser' : 'Reset'} onClick={resetView}>
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />
          </ControlBtn>
          <ControlBtn label={isFr ? 'Droite' : 'Right'} onClick={() => panBy(-PAN_STEP, 0)}>
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </ControlBtn>
          <span />
          <ControlBtn label={isFr ? 'Bas' : 'Down'} onClick={() => panBy(0, -PAN_STEP)}>
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.75} />
          </ControlBtn>
          <span />
        </div>
        <div className="flex flex-col gap-1">
          <ControlBtn label={isFr ? 'Zoom +' : 'Zoom in'} onClick={() => zoomBy(ZOOM_STEP)}>
            <ZoomIn className="h-3.5 w-3.5" strokeWidth={1.75} />
          </ControlBtn>
          <ControlBtn label={isFr ? 'Zoom −' : 'Zoom out'} onClick={() => zoomBy(-ZOOM_STEP)}>
            <ZoomOut className="h-3.5 w-3.5" strokeWidth={1.75} />
          </ControlBtn>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        'relative overflow-hidden border border-border/40 bg-muted/10',
        fullscreen ? 'h-full w-full border-0 bg-background' : 'h-[22rem] md:h-[28rem] lg:h-[32rem]',
      )}
    >
      {!fullscreen && (
        <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between gap-3 px-3 py-2.5 md:px-4 pointer-events-none">
          <p className="text-sm font-medium text-foreground truncate">{title}</p>
          <span className="text-[11px] tabular-nums text-muted-foreground shrink-0">
            {Math.round(view.scale * 100)}%
          </span>
        </div>
      )}

      {fullscreen && (
        <div
          className="absolute top-0 inset-x-0 z-20 flex items-center justify-between gap-3 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 sm:px-5"
          data-diagram-controls
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{title}</p>
            <p className="text-[11px] tabular-nums text-muted-foreground">
              {Math.round(view.scale * 100)}%
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {onToggleFullscreen && (
              <ControlBtn
                label={isFr ? 'Quitter le plein écran' : 'Exit fullscreen'}
                onClick={onToggleFullscreen}
              >
                <Minimize2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              </ControlBtn>
            )}
            {onCloseFullscreen && (
              <ControlBtn label={isFr ? 'Fermer' : 'Close'} onClick={onCloseFullscreen}>
                <X className="h-3.5 w-3.5" strokeWidth={1.75} />
              </ControlBtn>
            )}
          </div>
        </div>
      )}

      <div
        ref={stageRef}
        className={cn(
          'absolute inset-0 touch-none',
          fullscreen ? 'top-14' : 'top-10',
          dragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
      >
        <div
          ref={contentRef}
          className="mermaid-diagram origin-top-left will-change-transform [&_svg]:max-w-none [&_svg]:h-auto select-none"
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {controls}

      {!fullscreen && (
        <p className="absolute bottom-3 right-3 z-10 hidden sm:block text-[10px] text-muted-foreground/70 pointer-events-none">
          {isFr ? 'Molette : zoom · Glisser : déplacer' : 'Scroll: zoom · Drag: pan'}
        </p>
      )}
    </div>
  );
};

export const ProjectDiagramsSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const theme = useThemeStore((s) => s.theme);
  const isFr = language === 'fr';
  const diagrams = project.diagrams ?? [];
  const [active, setActive] = useState(0);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const renderId = useId().replace(/:/g, '');
  const abortRef = useRef(0);

  useEffect(() => {
    cleanupMermaidDomArtifacts();
  }, []);

  useEffect(() => {
    if (diagrams.length === 0) return;
    const current = diagrams[Math.min(active, diagrams.length - 1)];
    if (!current) return;

    const token = ++abortRef.current;
    const diagramRenderId = `project-diagram-${renderId}-${current.id}`;
    setError(null);
    setSvg('');

    void (async () => {
      try {
        const rendered = await renderMermaidSvg(
          diagramRenderId,
          current.mermaid,
          theme === 'dark' ? 'dark' : 'light',
        );
        if (token === abortRef.current) setSvg(rendered);
      } catch (err) {
        cleanupMermaidDomArtifacts(diagramRenderId);
        if (token === abortRef.current) {
          setError(isFr ? 'Impossible de rendre ce diagramme.' : 'Unable to render this diagram.');
          console.warn('[ProjectDiagrams]', err);
        }
      }
    })();

    return () => {
      cleanupMermaidDomArtifacts(diagramRenderId);
    };
  }, [active, diagrams, theme, renderId, isFr]);

  useEffect(() => {
    if (!fullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [fullscreen]);

  if (diagrams.length === 0) return null;

  const current = diagrams[Math.min(active, diagrams.length - 1)]!;
  const title = isFr ? current.titleFr : current.titleEn;

  const viewport = svg ? (
    <DiagramViewport
      svg={svg}
      title={title}
      isFr={isFr}
      fullscreen={fullscreen}
      onToggleFullscreen={() => setFullscreen((v) => !v)}
      onCloseFullscreen={() => setFullscreen(false)}
    />
  ) : null;

  return (
    <ProjectSectionShell title={isFr ? 'Schémas' : 'Diagrams'} tone="plain">
      {diagrams.length > 1 && (
        <div className="mb-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActive((i) => (i <= 0 ? diagrams.length - 1 : i - 1))}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
            aria-label={isFr ? 'Schéma précédent' : 'Previous diagram'}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <div className="flex min-w-0 flex-1 gap-x-4 gap-y-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {diagrams.map((d, idx) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActive(idx)}
                className={cn(projectDetailTabClass(idx === active), 'shrink-0 whitespace-nowrap')}
              >
                {isFr ? d.titleFr : d.titleEn}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setActive((i) => (i >= diagrams.length - 1 ? 0 : i + 1))}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
            aria-label={isFr ? 'Schéma suivant' : 'Next diagram'}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      )}

      {error && (
        <div className="border border-border/40 bg-muted/10 p-4 md:p-6">
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )}
      {!error && !svg && (
        <div className="border border-border/40 bg-muted/10 p-4 md:p-6 h-[22rem] md:h-[28rem] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            {isFr ? 'Rendu du diagramme…' : 'Rendering diagram…'}
          </p>
        </div>
      )}
      {!error && svg && !fullscreen && viewport}

      {fullscreen &&
        svg &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-background">
            <DiagramViewport
              svg={svg}
              title={title}
              isFr={isFr}
              fullscreen
              onToggleFullscreen={() => setFullscreen(false)}
              onCloseFullscreen={() => setFullscreen(false)}
            />
          </div>,
          document.body,
        )}
    </ProjectSectionShell>
  );
};
