import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import { CvPDFDocument } from '../PDF/PDFDocument';
import { cvData } from '@/entities/cv/api/mock/cv-data';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { X, Download, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/utils';

interface CVPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function useIsCoarseOrNarrow() {
  const [mobileLike, setMobileLike] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const sync = () => setMobileLike(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return mobileLike;
}

export const CVPreviewModal: React.FC<CVPreviewModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const mobileLike = useIsCoarseOrNarrow();
  const [renderState, setRenderState] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const requestClose = useCallback(() => {
    setRenderState(false);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      onClose();
    }, 280);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      setRenderState(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Next frame — avoids scale/opacity race on mobile WebKit
    const openTimer = window.requestAnimationFrame(() => {
      setRenderState(true);
    });

    return () => {
      window.cancelAnimationFrame(openTimer);
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      document.body.style.overflow = previousOverflow || '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, requestClose]);

  if (!isOpen && !renderState) return null;

  const fileName = `CV_Barthez_Kenwou_${language}.pdf`;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-preview-title"
      className={cn(
        'fixed inset-0 z-[200] flex items-end justify-center sm:items-center',
        'p-0 sm:p-6',
        'overflow-hidden overscroll-none',
      )}
    >
      <button
        type="button"
        aria-label={isFr ? 'Fermer' : 'Close'}
        className={cn(
          'absolute inset-0 bg-black/65 backdrop-blur-md transition-opacity duration-300',
          renderState ? 'opacity-100' : 'opacity-0',
        )}
        onClick={requestClose}
      />

      <div
        className={cn(
          'relative z-10 flex w-full max-w-5xl flex-col',
          'h-[min(92dvh,920px)] sm:h-[90vh]',
          'rounded-t-2xl sm:rounded-xl',
          'border border-border/60 bg-background shadow-2xl',
          'transition-[opacity,transform] duration-300 ease-out',
          // Mobile: sheet from bottom (reliable). Desktop: light fade — no scale-0.2 (clips on iOS)
          renderState
            ? 'translate-y-0 opacity-100'
            : 'translate-y-6 opacity-0 sm:translate-y-3',
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/50 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="rounded-md bg-brand/15 p-2 text-brand dark:bg-primary/20 dark:text-primary">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h3
                id="cv-preview-title"
                className="truncate font-heading text-base font-bold text-foreground sm:text-lg"
              >
                {isFr ? 'Aperçu du CV' : 'CV preview'}
              </h3>
              <p className="truncate text-[11px] text-foreground/60 sm:text-xs">
                {isFr ? 'Vérifiez, puis récupérez le fichier PDF.' : 'Review, then get the PDF file.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={requestClose}
            className="shrink-0 rounded-full bg-secondary/60 p-2 text-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col bg-background/40">
          <BlobProvider document={<CvPDFDocument data={cvData} language={language === 'fr' ? 'fr' : 'en'} />}>
            {({ url, loading, error }) => {
              if (error) {
                return (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                    <p className="text-sm font-medium text-destructive">
                      {isFr ? 'Impossible de générer le PDF.' : 'Could not generate the PDF.'}
                    </p>
                    <p className="max-w-sm text-xs text-foreground/65">{error.message}</p>
                  </div>
                );
              }

              if (loading || !url) {
                return (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-primary">
                    <Loader2 className="h-9 w-9 animate-spin" />
                    <p className="text-sm font-semibold text-foreground/80">
                      {isFr ? 'Préparation du PDF…' : 'Preparing PDF…'}
                    </p>
                  </div>
                );
              }

              return (
                <>
                  <div className="relative min-h-0 flex-1 px-3 pt-3 sm:px-5 sm:pt-4">
                    {mobileLike ? (
                      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-lg border border-border/50 bg-card/60 px-5 py-8 text-center">
                        <CheckCircle2 className="h-10 w-10 text-brand dark:text-primary" />
                        <div className="space-y-1.5">
                          <p className="font-heading text-sm font-semibold text-foreground">
                            {isFr ? 'PDF prêt' : 'PDF ready'}
                          </p>
                          <p className="mx-auto max-w-xs text-xs leading-relaxed text-foreground/70">
                            {isFr
                              ? "L'aperçu intégré est limité sur mobile. Récupérez le fichier pour l'ouvrir dans votre lecteur PDF."
                              : 'In-app preview is limited on mobile. Get the file to open it in your PDF reader.'}
                          </p>
                        </div>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
                        >
                          {isFr ? 'Ouvrir dans un nouvel onglet' : 'Open in a new tab'}
                        </a>
                      </div>
                    ) : (
                      <iframe
                        src={`${url}#view=FitH`}
                        className="h-full w-full rounded-lg border border-border/40 bg-background"
                        title={isFr ? 'Aperçu du CV' : 'CV preview'}
                      />
                    )}
                  </div>

                  <div className="shrink-0 border-t border-border/50 bg-background/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-5 sm:py-4">
                    <a
                      href={url}
                      download={fileName}
                      className={cn(
                        'inline-flex w-full items-center justify-center gap-2 rounded-md',
                        'bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground',
                        'transition-colors hover:bg-brand-hover',
                        'sm:mx-auto sm:w-auto sm:min-w-[14rem] sm:px-6',
                      )}
                    >
                      <Download className="h-4 w-4" />
                      {isFr ? 'Récupérer le PDF' : 'Get the PDF'}
                    </a>
                  </div>
                </>
              );
            }}
          </BlobProvider>
        </div>
      </div>
    </div>,
    document.body,
  );
};
