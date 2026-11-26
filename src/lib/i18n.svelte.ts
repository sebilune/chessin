import { m } from '$lib/paraglide/messages';
import {
  getLocale,
  locales,
  localizeHref,
  setLocale as paraglideSetLocale,
  type Locale,
} from '$lib/paraglide/runtime';

export const LOCALE_LABELS: Record<Locale, { code: string; name: string }> = {
  en: { code: 'EN', name: 'English' },
  es: { code: 'ES', name: 'Español' },
  ja: { code: 'JA', name: '日本語' },
  ru: { code: 'RU', name: 'Русский' },
  de: { code: 'DE', name: 'Deutsch' },
  fr: { code: 'FR', name: 'Français' },
};

class I18nStore {
  locale = $state<Locale>(getLocale());

  constructor() {
    this.syncDocument(this.locale);
  }

  private syncDocument(locale: Locale) {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = locale;
    document.title = m.seo_title({}, { locale });
  }

  setLocale(next: Locale) {
    if (next === this.locale) return;
    paraglideSetLocale(next, { reload: false });
    this.locale = next;
    this.syncDocument(next);
    if (typeof window !== 'undefined') {
      const targetUrl = localizeHref(window.location.pathname, { locale: next });
      window.history.replaceState({}, '', targetUrl);
    }
  }
}

export const i18n = new I18nStore();

export function getLevelName(id: number, fallback: string): string {
  const fn = (m as unknown as Record<string, ((inputs?: Record<string, never>, opts?: { locale?: Locale }) => string) | undefined>)[`level_${id}`];
  return fn ? fn({}, { locale: i18n.locale }) : fallback;
}

export const orderedLocales: Locale[] = [
  'en',
  ...locales.filter((l) => l !== 'en').sort((a, b) => a.localeCompare(b)),
];

export { locales, m, type Locale };
