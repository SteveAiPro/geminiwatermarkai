export interface LocaleConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  path: string;
}

export const LOCALES: Record<string, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    path: '/',
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '简体中文',
    flag: '🇨🇳',
    path: '/zh',
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    path: '/ja',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    path: '/es',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    path: '/de',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    path: '/fr',
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    path: '/pt',
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    path: '/ko',
  },
};

export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALES = Object.keys(LOCALES);
export const NON_DEFAULT_LOCALES = SUPPORTED_LOCALES.filter((loc) => loc !== DEFAULT_LOCALE);
