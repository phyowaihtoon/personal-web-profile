import type { LocalizedFields } from './api/types'

export function resolveLocalizedField(value: LocalizedFields<string> | undefined, locale: 'en' | 'my') {
  return value?.[locale] ?? value?.en ?? ''
}