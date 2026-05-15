export const ACTIVE_LOCALES = ['en', 'uk', 'de', 'fr'] as const;

export type ActiveLocale = (typeof ACTIVE_LOCALES)[number];
export type Locale = ActiveLocale;

export const DEFAULT_LOCALE: ActiveLocale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  uk: 'UK',
  de: 'DE',
  fr: 'FR',
};

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: 'en',
  uk: 'uk-UA',
  de: 'de',
  fr: 'fr',
};

export const LOCALE_OG_LANG: Record<Locale, string> = {
  en: 'en_US',
  uk: 'uk_UA',
  de: 'de_DE',
  fr: 'fr_FR',
};

export function isActiveLocale(value: string): value is ActiveLocale {
  return (ACTIVE_LOCALES as readonly string[]).includes(value);
}
