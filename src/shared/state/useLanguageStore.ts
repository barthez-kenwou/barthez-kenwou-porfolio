import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { trackLocaleSwitch } from '@/app/lib/analytics';

export type Language = 'fr' | 'en';

type LanguageState = {
  language: Language;
  toggleLanguage: () => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      toggleLanguage: () => {
        const from = get().language;
        const to: Language = from === 'en' ? 'fr' : 'en';
        trackLocaleSwitch(from, to);
        set({ language: to });
      },
    }),
    {
      name: 'language-storage',
    },
  ),
);
