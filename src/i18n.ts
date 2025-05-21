import { init, register, getLocaleFromNavigator } from 'svelte-i18n';

// Register locales
register('en', () => import('./locales/en.json'));
register('pl', () => import('./locales/pl.json'));

// Initialize i18n with browser's preferred language or fallback to English
export function initI18n() {
  init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator() || 'en',
  });
}