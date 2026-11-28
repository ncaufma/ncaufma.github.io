export const supportedLanguages = ['en', 'pt', 'es'] as const;
export type Language = (typeof supportedLanguages)[number];
import en from './i18n/en.json';
import pt from './i18n/pt.json';
import es from './i18n/es.json';

export const ui = { en, pt, es } satisfies Record<Language, typeof en>;

export function isLanguage(value: string | undefined): value is Language {
  return supportedLanguages.includes(value as Language);
}

export function publicSlug(slug: string): string {
  return slug.replace(/^(?:en|pt|es)\//, '');
}

export function entryLang(value: string | undefined): Language {
  return isLanguage(value) ? value : 'en';
}

export function byLang<T extends { data: { lang?: string } }>(
  items: T[],
  lang: Language,
): T[] {
  return items.filter(item => entryLang(item.data.lang) === lang);
}
