import type { Dictionary } from './types';
import { en } from './en';
import { uk } from './uk';
import { de } from './de';
import { fr } from './fr';
import { type Locale } from './locales';

const DICTIONARIES: Record<Locale, Dictionary> = { en, uk, de, fr };

export function dict(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? en;
}
