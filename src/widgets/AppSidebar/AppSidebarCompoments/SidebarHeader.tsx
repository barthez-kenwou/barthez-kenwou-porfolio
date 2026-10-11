import { profilePhotos } from '@/shared/assets/images/profilePhotos';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PhotoGallery } from './ui/PhotoGallery';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/shared/ui/Image';
import { cn } from '@/shared/lib/utils';
import { useSidebarReveal } from '../useSidebarReveal';

/**
 * SidebarHeaderSection Component
 *
 * Affiche la photo de profil et les informations utilisateur
 * - Mode expanded: Grande photo + nom + titre + sous-titre
 * - Mode collapsed: Petite photo centrée avec tooltip
 *
 * @component
 */
export const SidebarHeaderSection: React.FC = () => {
  const { contentReady } = useSidebarReveal();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className={cn('border-b transition-[padding] duration-500 ease-in-out', contentReady ? 'p-3' : 'p-2')}>
      <div className="flex cursor-default items-center gap-3">
        <div
          className={cn(
            'flex w-full flex-col items-center gap-3 transition-[padding] duration-500 ease-in-out',
            contentReady ? 'px-4' : 'px-0',
          )}
        >
          <button
            type="button"
            onClick={() => setIsGalleryOpen(true)}
            className={cn(
              'group/picture relative overflow-hidden rounded-md border-2 border-primary/50',
              'transition-[width,height,border-color] duration-500 ease-in-out',
              'hover:border-primary hover:glow-primary',
              contentReady ? 'size-28 lg:size-40' : 'size-10',
            )}
            aria-label="View profile photos"
            title={contentReady ? 'View profile photos' : 'Barthez Kenwou - View profile'}
          >
            <Image
              src={profilePhotos[0]}
              alt="Barthez Kenwou"
              lazy={false}
              showSkeleton
              showSpinner={false}
              className="absolute inset-0 size-full transition-transform duration-500 ease-in-out group-hover/picture:scale-105"
              style={{ objectFit: 'cover', objectPosition: 'top center' }}
            />
            {contentReady ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center gap-1 bg-primary/20 opacity-0 transition-opacity duration-300 group-hover/picture:opacity-100">
                <span className="text-xs font-medium text-primary-foreground">
                  {t('sidebar.see_more')}
                </span>
                <ArrowRight size={16} className="text-primary-foreground" strokeWidth={1.5} />
              </div>
            ) : null}
          </button>

          <div
            className={cn(
              'w-full overflow-hidden text-center transition-[opacity,max-height] duration-500 ease-in-out',
              contentReady
                ? 'max-h-24 opacity-100'
                : 'pointer-events-none max-h-0 opacity-0',
            )}
            aria-hidden={!contentReady}
          >
            <h2 className="text-lg font-bold text-foreground">Barthez Kenwou</h2>
            <p className="font-mono text-xs text-muted-foreground">{t('sidebar.title')}</p>
            <p className="mt-1 text-xs font-medium text-brand dark:text-primary">
              {t('sidebar.subtitle')}
            </p>
          </div>
        </div>

        {isGalleryOpen ? (
          <PhotoGallery
            photos={profilePhotos}
            isOpen={isGalleryOpen}
            onClose={() => setIsGalleryOpen(false)}
          />
        ) : null}
      </div>
    </div>
  );
};
