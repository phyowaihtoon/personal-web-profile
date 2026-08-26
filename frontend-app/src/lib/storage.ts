import type { Locale } from '../app/providers/locale-provider'

const LOCALE_KEY = 'personal-website-locale'

export function getStoredLocale(): Locale {
  const value = window.localStorage.getItem(LOCALE_KEY)
  return value === 'my' ? 'my' : 'en'
}

export function setStoredLocale(locale: Locale) {
  window.localStorage.setItem(LOCALE_KEY, locale)
}
