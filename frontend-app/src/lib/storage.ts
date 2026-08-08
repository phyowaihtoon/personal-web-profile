import type { Locale } from '../app/providers/locale-provider'
import type { ThemeMode } from '../app/providers/theme-provider'

const THEME_KEY = 'personal-website-theme'
const LOCALE_KEY = 'personal-website-locale'

export function getStoredTheme(): ThemeMode {
  const value = window.localStorage.getItem(THEME_KEY)
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system'
}

export function setStoredTheme(theme: ThemeMode) {
  window.localStorage.setItem(THEME_KEY, theme)
}

export function getStoredLocale(): Locale {
  const value = window.localStorage.getItem(LOCALE_KEY)
  return value === 'my' ? 'my' : 'en'
}

export function setStoredLocale(locale: Locale) {
  window.localStorage.setItem(LOCALE_KEY, locale)
}