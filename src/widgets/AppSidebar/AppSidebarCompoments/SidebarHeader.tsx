import { profilePhotos } from '@/shared/assets/images/profilePhotos';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PhotoGallery } from './ui/PhotoGallery';
import { ArrowRight } from 'lucide-react';
import { useSidebar } from '@/shared/ui/sidebar';
import { Image } from '@/shared/ui/Image';
import { cn } from '@/shared/lib/utils';

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
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className={`border-b transition-all duration-300 ${isExpanded ? 'p-3' : 'p-2'}`}>
      <div className="flex cursor-default items-center gap-3">
        {/* Profile Section */}
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-300 ${
            isExpanded ? 'px-4' : 'w-full px-0'
          }`}
        >
          <button
            type="button"
            onClick={() => setIsGalleryOpen(true)}
            className={cn(
              'group/picture relative overflow-hidden rounded-md border-2 border-primary/50',
              'transition-all duration-300 hover:border-primary hover:glow-primary',
              isExpanded ? 'size-28 lg:size-40' : 'size-10',
            )}
            aria-label="View profile photos"
            title={isExpanded ? 'View profile photos' : 'Barthez Kenwou - View profile'}
          >
            <Image
              src={profilePhotos[0]}
              alt="Barthez Kenwou"
              lazy={false}
              showSkeleton
              showSpinner={false}
              className="absolute inset-0 size-full transition-transform duration-300 group-hover/picture:scale-105"
              style={{ objectFit: 'cover', objectPosition: 'top center' }}
            />
            {isExpanded && (
              <div className="absolute inset-0 z-10 flex items-center justify-center gap-1 bg-primary/20 opacity-0 transition-opacity group-hover/picture:opacity-100">
                <span className="text-xs font-medium text-primary-foreground">
                  {t('sidebar.see_more')}
                </span>
                <ArrowRight size={16} className="text-primary-foreground" strokeWidth={1.5} />
              </div>
            )}
          </button>

          {isExpanded && (
            <div className="text-center animate-fade-in">
              <h2 className="text-lg font-bold text-foreground">Barthez Kenwou</h2>
              <p className="text-xs text-muted-foreground font-mono">{t('sidebar.title')}</p>
              <p className="text-xs font-medium mt-1 text-brand dark:text-primary">
                {t('sidebar.subtitle')}
              </p>
            </div>
          )}
        </div>

        {/* Gallery Modal */}
        {isGalleryOpen && (
          <PhotoGallery
            photos={profilePhotos}
            isOpen={isGalleryOpen}
            onClose={() => setIsGalleryOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
