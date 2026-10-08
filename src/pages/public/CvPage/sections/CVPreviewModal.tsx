import React, { useEffect, useState } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import { CvPDFDocument } from '../PDF/PDFDocument';
import { cvData } from '@/entities/cv/api/mock/cv-data';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { X, Download, Loader2, FileText } from 'lucide-react';
import { createPortal } from 'react-dom';

interface CVPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CVPreviewModal: React.FC<CVPreviewModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguageStore();
  const [renderState, setRenderState] = useState(false);

  // Scale animation trick
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // tiny delay allows CSS transition from 0.2 to 1
      setTimeout(() => setRenderState(true), 10);
    } else {
      document.body.style.overflow = 'auto';
      setRenderState(false);
    }
  }, [isOpen]);

  if (!isOpen && !renderState) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ease-out ${renderState ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => {
          setRenderState(false);
          setTimeout(onClose, 500); // Wait for scale down
        }}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-5xl h-[85vh] md:h-[90vh] flex flex-col transition-all duration-500 ease-out origin-center
          ${renderState ? 'scale-100 opacity-100' : 'scale-[0.2] opacity-0'}
        `}
      >
        {/* Animated Double Border & Glassmorphism Wrapper */}
        <div className="absolute inset-0 rounded-md overflow-hidden shadow-lg border border-white/10">
          <div className="absolute -inset-[100%] animate-[spin_6s_linear_infinite] opacity-50">
            <div className="w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_120deg,hsl(var(--primary))_240deg,transparent_360deg)]" />
          </div>
          <div className="absolute inset-[2px] rounded-[calc(1.5rem-2px)] bg-background/90 backdrop-blur-2xl" />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full h-full flex flex-col p-4 md:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 shrink-0 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-md text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {language === 'fr' ? 'Aperçu du CV' : 'CV Preview'}
              </h3>
            </div>
            <button
              onClick={() => {
                setRenderState(false);
                setTimeout(onClose, 500);
              }}
              className="p-2 rounded-full bg-secondary/50 text-foreground hover:bg-destructive/20 hover:text-destructive hover:rotate-90 transition-all duration-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* PDF Viewer Container */}
          <div className="flex-1 w-full bg-background/50 rounded-md overflow-hidden border border-border/50 shadow-inner relative flex items-center justify-center">
            <BlobProvider document={<CvPDFDocument data={cvData} language={language as 'fr'} />}>
              {({ url, loading, error }) => {
                if (error) {
                  console.error('PDF Generator Error:', error);
                  return (
                    <div className="text-destructive font-medium p-6">
                      Error loading PDF: {error.message}
                    </div>
                  );
                }

                if (loading || !url) {
                  return (
                    <div className="flex flex-col items-center justify-center gap-4 text-primary animate-pulse">
                      <Loader2 className="h-10 w-10 animate-spin" />
                      <p className="font-semibold text-foreground/80">
                        {language === 'fr' ? "Génération de l'aperçu..." : 'Generating preview...'}
                      </p>
                    </div>
                  );
                }

                return (
                  <>
                    <iframe
                      src={`${url}#view=FitH`}
                      className="w-full h-full border-none rounded-md"
                      title="CV Preview"
                    />

                    {/* Floating CTA inside the modal */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                      <a
                        href={url}
                        download={`CV_Barthez_Kenwou_${language}.pdf`}
                        className="group flex items-center gap-3 px-4 py-2 bg-brand text-brand-foreground hover:bg-brand-hover rounded-full shadow-sm hover:-translate-y-1 transition-all duration-300 font-bold text-sm"
                      >
                        <Download className="h-4 w-4 group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-300" />
                        {language === 'fr' ? 'Télécharger avec style !' : 'Download with style!'}
                      </a>
                    </div>
                  </>
                );
              }}
            </BlobProvider>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
