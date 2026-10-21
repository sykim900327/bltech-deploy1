// Korean / English switch. Korean is authored in index.html; English comes from ./en.ts.
// The language is fixed for the lifetime of a page: switching stores the choice and reloads, so every
// module (split headings, counters, scroll triggers) initialises once with the final text.
import { en } from './en';

export type Lang = 'ko' | 'en';

const STORE_KEY = 'bltech-lang';
const SWITCH_KEY = 'bltech-lang-switch';

const read = (storage: () => Storage, key: string) => {
  try {
    return storage().getItem(key);
  } catch {
    return null;
  }
};
const write = (storage: () => Storage, key: string, value: string) => {
  try {
    storage().setItem(key, value);
  } catch {
    // storage unavailable (private mode etc.): the URL parameter still carries the choice
  }
};

// ?lang= wins (shared links), then the visitor's last choice; Korean by default.
export const lang: Lang = (new URLSearchParams(location.search).get('lang') ?? read(() => localStorage, STORE_KEY)) === 'en' ? 'en' : 'ko';

// Strings used from TypeScript only.
const messages = {
  ko: {
    'form.invalid': '이름과 이메일을 확인해 주세요.',
    'form.pending': '온라인 문의 접수는 준비 중입니다. 전화(033-264-2686)로 연락 주시면 빠르게 안내해 드리겠습니다.',
  },
  en: {
    'form.invalid': 'Please check your name and email.',
    'form.pending': 'Online inquiries are coming soon. Please call +82-33-264-2686 and we will be glad to help.',
  },
} as const;

export const t = (key: keyof (typeof messages)['ko']) => messages[lang][key];

/** Puts the English text in place (no-op for Korean) and syncs <html lang> and the KO/EN buttons. */
export function applyLanguage() {
  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLElement>('[data-lang]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
  if (lang === 'ko') return;

  const missing: string[] = [];
  const pick = (key: string) => {
    if (!(key in en)) missing.push(key);
    return en[key];
  };
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const text = pick(el.dataset.i18n!);
    if (text !== undefined) el.innerHTML = text;
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-attr]').forEach((el) => {
    for (const pair of el.dataset.i18nAttr!.split(';')) {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      const value = pick(key);
      if (value !== undefined) el.setAttribute(attr, value);
    }
  });
  const description = pick('meta.description');
  if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  if (missing.length) console.warn('[i18n] missing English text for:', missing);
}

/** Remembers the choice and reloads in the other language, returning the visitor to `sectionId`. */
export function switchLanguage(next: Lang, sectionId: string) {
  if (next === lang) return;
  write(() => localStorage, STORE_KEY, next);
  write(() => sessionStorage, SWITCH_KEY, sectionId);
  const url = new URL(location.href);
  if (next === 'en') url.searchParams.set('lang', 'en');
  else url.searchParams.delete('lang');
  url.hash = '';
  location.replace(url);
}

/** After a language switch: the section id to return to ('' = top). null on a normal visit. */
export function takeSwitchState(): string | null {
  const value = read(() => sessionStorage, SWITCH_KEY);
  try {
    sessionStorage.removeItem(SWITCH_KEY);
  } catch {
    // ignore
  }
  return value;
}
