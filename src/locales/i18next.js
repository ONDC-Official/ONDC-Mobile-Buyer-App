import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './languages/en.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    en: {
      translation: en,
    },
  },
  lng: 'en',
  //language to use if translations in user language are not available
  fallbackLng: 'en',
  debug: true,
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

export default i18n;
