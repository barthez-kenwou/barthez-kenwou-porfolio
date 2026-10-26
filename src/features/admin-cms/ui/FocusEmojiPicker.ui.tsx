import React, { Suspense, lazy, useMemo } from 'react';
import {
  Categories,
  EmojiStyle,
  SkinTonePickerLocation,
  SuggestionMode,
  Theme as EmojiTheme,
} from 'emoji-picker-react';
import { useThemeStore } from '@/shared/state/useThemeStore';
import { cn } from '@/shared/lib/utils';

const EmojiPicker = lazy(() => import('emoji-picker-react'));

const loadEmojiDataFr = () => import('emoji-picker-react/data/emojis-fr');
const loadEmojiDataEn = () => import('emoji-picker-react/data/emojis-en');

type Props = {
  isFr: boolean;
  onPick: (emoji: string) => void;
  className?: string;
};

const CATEGORIES_FR = [
  { category: Categories.SUGGESTED, name: 'Récents' },
  { category: Categories.SMILEYS_PEOPLE, name: 'Smileys & Personnes' },
  { category: Categories.ANIMALS_NATURE, name: 'Animaux & Nature' },
  { category: Categories.FOOD_DRINK, name: 'Nourriture & Boissons' },
  { category: Categories.ACTIVITIES, name: 'Activités' },
  { category: Categories.TRAVEL_PLACES, name: 'Voyages & Lieux' },
  { category: Categories.OBJECTS, name: 'Objets' },
  { category: Categories.SYMBOLS, name: 'Symboles' },
  { category: Categories.FLAGS, name: 'Drapeaux' },
] as const;

const CATEGORIES_EN = [
  { category: Categories.SUGGESTED, name: 'Recent' },
  { category: Categories.SMILEYS_PEOPLE, name: 'Smileys & People' },
  { category: Categories.ANIMALS_NATURE, name: 'Animals & Nature' },
  { category: Categories.FOOD_DRINK, name: 'Food & Drink' },
  { category: Categories.ACTIVITIES, name: 'Activities' },
  { category: Categories.TRAVEL_PLACES, name: 'Travel & Places' },
  { category: Categories.OBJECTS, name: 'Objects' },
  { category: Categories.SYMBOLS, name: 'Symbols' },
  { category: Categories.FLAGS, name: 'Flags' },
] as const;

/**
 * Full emoji manager — searchable, categorized, skin tones (WhatsApp-class UX).
 */
export function FocusEmojiPicker({ isFr, onPick, className }: Props) {
  const theme = useThemeStore((s) => s.theme);
  const pickerTheme = theme === 'dark' ? EmojiTheme.DARK : EmojiTheme.LIGHT;

  const categories = useMemo(() => [...(isFr ? CATEGORIES_FR : CATEGORIES_EN)], [isFr]);

  const labels = useMemo(
    () =>
      isFr
        ? {
            searchPlaceholder: 'Rechercher un émoji',
            searchLabel: 'Recherche d’émojis',
            searchClear: 'Effacer',
            searchResultsNone: 'Aucun émoji trouvé',
            searchResultsOne: '1 émoji',
            searchResultsMany: '%n émojis',
            categoryNavigation: 'Catégories',
            loading: 'Chargement des émojis…',
            loadingError: 'Impossible de charger les émojis',
            retryLoading: 'Réessayer',
            skinToneNeutral: 'Ton neutre',
            skinToneLight: 'Clair',
            skinToneMediumLight: 'Clair moyen',
            skinToneMedium: 'Moyen',
            skinToneMediumDark: 'Foncé moyen',
            skinToneDark: 'Foncé',
          }
        : {
            searchPlaceholder: 'Search emoji',
            searchLabel: 'Emoji search',
            searchClear: 'Clear',
            searchResultsNone: 'No emoji found',
            searchResultsOne: '1 emoji',
            searchResultsMany: '%n emojis',
            categoryNavigation: 'Categories',
            loading: 'Loading emojis…',
            loadingError: 'Could not load emojis',
            retryLoading: 'Retry',
            skinToneNeutral: 'Neutral',
            skinToneLight: 'Light',
            skinToneMediumLight: 'Medium-light',
            skinToneMedium: 'Medium',
            skinToneMediumDark: 'Medium-dark',
            skinToneDark: 'Dark',
          },
    [isFr],
  );

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border/50 bg-popover shadow-md',
        className,
      )}
    >
      <Suspense
        fallback={
          <div className="flex h-90 w-80 items-center justify-center text-xs text-muted-foreground">
            {labels.loading}
          </div>
        }
      >
        <EmojiPicker
          theme={pickerTheme}
          emojiStyle={EmojiStyle.NATIVE}
          width={320}
          height={380}
          categories={categories}
          emojiData={isFr ? loadEmojiDataFr : loadEmojiDataEn}
          labels={labels}
          suggestedEmojisMode={SuggestionMode.RECENT}
          skinTonePickerLocation={SkinTonePickerLocation.SEARCH}
          previewConfig={{ showPreview: false }}
          lazyLoadEmojis
          autoFocusSearch
          onEmojiClick={(data) => onPick(data.emoji)}
        />
      </Suspense>
    </div>
  );
}
