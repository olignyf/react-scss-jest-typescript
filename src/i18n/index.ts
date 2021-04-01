import i18nLib, { InitOptions } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import pull from 'lodash/pull';
import { initReactI18next } from 'react-i18next';
import { Config } from 'src/config';
import { english } from 'src/i18n/english';

/**
 * Locale enum - not trimmed
 */
export enum Locale {
  English = 'en-US',
}

// /**
//  * Locale trimmed to language enum
//  */
export enum Language {
  English = 'en',
}

/**
 * Returns an array of supported locales
 */
export const supportedLocales = [Locale.English];

/**
 * Returns an array of supported languages
 */
export const supportedLanguages = [Language.English];

const buildResourcesConfig: (translations: {
  [locale: string]: any;
}) => { [key: string]: { [locale: string]: any } } = (translations) => {
  const resources: { [key: string]: { [locale: string]: any } } = {};
  Object.keys(translations).forEach((locale) => {
    resources[locale] = {
      translations: translations[locale],
    };
  });

  return resources;
};

export const createI18nInitConfig: (
  translations: { [locale: string]: any },
  debugOverride?: boolean,
) => InitOptions = (translations, debugOverride) => ({
  fallbackLng: Language.English,
  ns: ['translations'],
  defaultNS: 'translations',
  resources: buildResourcesConfig(translations),
  debug: debugOverride ?? Config.isDebug,
  interpolation: {
    escapeValue: false,
    format: (value: any) => value,
  },

  nonExplicitWhitelist: true,
  whitelist: supportedLanguages,

  react: {
    wait: false,
  },

  detection: {
    order: ['cookie', 'localStorage', 'navigator', 'htmlTag', 'path'],
    lookupLocalStorage: 'userLocale',
    excludeCacheFor: supportedLocales,
  },
});

export const initializeI18n = (debug?: boolean): void => {
  i18nLib
    .use(LanguageDetector)
    .use(intervalPlural)
    .use(initReactI18next)
    .init(
      createI18nInitConfig(
        {
          en: english,
        },
        debug,
      ),
    );
};
export const i18n = i18nLib;
export const t = i18nLib.t.bind(i18n);

/**
 * Removes the country code in a locale
 * In other words, it removes everything after "-" and keep only the 2 letter locale
 * i.e. 'en-US' will become 'en'
 * @param locale
 */
export const getLanguageFromLocale = (locale: string): string => {
  if (locale) {
    const index = locale.indexOf('-');
    if (index > 0) {
      return locale.substring(0, index);
    }
    return locale;
  }
  return locale;
};

/**
 * Returns all the supported locales minus the current locale
 */
export const otherLocales: () => string[] = () => {
  return pull(supportedLocales.slice(), getLanguageFromLocale(i18nLib.language));
};

/**
 * Returns the current user locale
 */
export const getUserLocale = (): string => i18n.language;

/**
 * Returns the current user language
 */
export const getUserLanguage = (): string => getLanguageFromLocale(getUserLocale());
