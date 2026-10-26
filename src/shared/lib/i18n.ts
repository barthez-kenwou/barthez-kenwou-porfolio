import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fr from '@/shared/assets/locales/fr/translation.json';
import en from '@/shared/assets/locales/en/translation.json';

/**
 * Default language is English. Persistence + toggle live in `useLanguageStore`;
 * `I18nProvider` syncs i18n via `changeLanguage` - no browser auto-detection.
 */
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    fr: {
      translation: fr,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  debug: import.meta.env.DEV,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
