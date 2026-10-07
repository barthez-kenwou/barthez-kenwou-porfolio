import { profilePhotos } from '@/shared/assets/images/profilePhotos';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PhotoGallery } from './ui/PhotoGallery';
import { ArrowRight } from 'lucide-react';
import { useSidebar } from '@/shared/ui/sidebar';
import { PixelImage } from '@/shared/ui/pixel-image';

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
      <div className="flex items-center gap-3 cursor-default">
        {/* Profile Section */}
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-300 ${
            isExpanded ? 'px-4' : 'px-0 w-full'
          }`}
        >
          <button
            onClick={() => setIsGalleryOpen(true)}
            className={`group/picture cursor-pointer relative overflow-hidden flex items-center justify-center rounded-md border-2 border-primary/50 hover:border-primary transition-all duration-300 hover:glow-primary ${
              isExpanded ? 'min-w-28 min-h-28 lg:min-w-40 lg:min-h-40' : 'w-10 h-10'
            }`}
            aria-label="View profile photos"
            title={isExpanded ? 'View profile photos' : 'Barthez Kenwou - View profile'}
          >
            <PixelImage
              src={profilePhotos[0]}
              customGrid={{ rows: 8, cols: 8 }}
              grayscaleAnimation
              pixelFadeInDuration={800}
              className="object-cover object-[center_60%] transition-all duration-300 scale-100 group-hover/picture:scale-110 h-full w-full"
            />
            {isExpanded && (
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/picture:opacity-100 transition-opacity flex items-center justify-center gap-1">
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
              <p className="text-xs font-medium mt-1 text-violet-700 dark:text-violet-300">
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
