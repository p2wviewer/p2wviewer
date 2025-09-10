import { writable } from 'svelte/store';
import { getLocale } from "tauri-plugin-locale-api";

export const t = writable({});
export const currentLang = writable('en'); // Default English

/**
 * @param {string} lang
 */
async function loadTranslations(lang) {
  try {
    const translations = await import(`../locales/${lang}.json`);
    t.set(translations.default);
    currentLang.set(lang);
  } catch (error) {
    console.error(`Could not load translations for language: ${lang}. Falling back to default.`);
    const fallback = await import('../locales/en.json');
    t.set(fallback.default);
    currentLang.set('en');
  }
}

export async function initializeLanguage() {
  const locale = await getLocale();
  const lang = locale.split('-')[0]; // GetSystemLocale
  loadTranslations(lang);
}