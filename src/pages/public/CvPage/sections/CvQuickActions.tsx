import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/Button';
import { SpectrumButton } from '@/shared/ui/SpectrumButton';
import { cn } from '@/shared/lib/utils';

const CONTACT_FROM_CV = '/contact?from=cv';

type CvQuickActionsProps = {
  onDownload: () => void;
  /** hero: above-fold · sticky: mobile bar · footer: end of page */
  variant?: 'hero' | 'sticky' | 'footer';
  className?: string;
};

export const CvQuickActions: React.FC<CvQuickActionsProps> = ({
  onDownload,
  variant = 'hero',
  className,
}) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  const downloadLabel =
    variant === 'sticky'
      ? isFr
        ? 'Télécharger'
        : 'Download'
      : isFr
        ? 'Télécharger maintenant'
        : 'Download now';

  const contactLabel =
    variant === 'sticky'
      ? isFr
        ? 'Discuter'
        : "Let's talk"
      : isFr
        ? "Discuter d'un besoin"
        : 'Discuss a need';

  const isSticky = variant === 'sticky';

  return (
    <div
      className={cn(
        'flex w-full items-stretch gap-2 sm:items-center',
        isSticky ? 'flex-row' : 'flex-col sm:w-auto sm:flex-row sm:justify-center',
        className,
      )}
    >
      <SpectrumButton
        type="button"
        variant="solid"
        size={isSticky ? 'sm' : 'default'}
        onClick={onDownload}
        className={cn('flex-1 sm:flex-none', isSticky && 'h-9 px-3 text-xs')}
      >
        <Download className="h-3.5 w-3.5" />
        {downloadLabel}
      </SpectrumButton>

      <Button
        asChild
        variant="outline"
        size={isSticky ? 'sm' : 'lg'}
        className={cn(
          'flex-1 sm:flex-none',
          isSticky ? 'h-9 min-h-9 px-3 text-xs' : 'min-h-10 px-6',
        )}
      >
        <Link
          to={CONTACT_FROM_CV}
          onMouseEnter={() => {
            void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
          }}
          onTouchStart={() => {
            void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
          }}
        >
          {contactLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
};
