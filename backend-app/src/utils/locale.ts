import type { Locale, LocalizedRecord } from '../types'

export function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'my'
}

export function resolveLocalized<T>(
  value: LocalizedRecord<T> | null | undefined,
  locale: Locale,
  fallbackLocale: Locale = 'en',
): T | undefined {
  if (!value) {
    return undefined
  }

  return value[locale] ?? value[fallbackLocale]
}

export function resolveLocalizedObject(
  value: Record<string, unknown> | null | undefined,
  locale: Locale,
  fallbackLocale: Locale = 'en',
) {
  if (!value) {
    return null
  }

  const localized = value[locale]
  const fallback = value[fallbackLocale]

  return (localized as Record<string, unknown> | undefined) ?? (fallback as Record<string, unknown> | undefined) ?? null
}