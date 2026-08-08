import { createContext, useContext, useMemo, useState } from 'react'

import en from '../../translations/en.json'
import my from '../../translations/my.json'
import { getStoredLocale, setStoredLocale } from '../../lib/storage'

export type Locale = 'en' | 'my'

type Dictionary = typeof en

type LocaleContextValue = {
  locale: Locale
  messages: Dictionary
  setLocale: (locale: Locale) => void
}

const dictionaries = { en, my } satisfies Record<Locale, Dictionary>
const LocaleContext = createContext<LocaleContextValue | null>(null)

type Props = {
  children: React.ReactNode
}

export function LocaleProvider({ children }: Props) {
  const [locale, setLocaleState] = useState<Locale>(() => getStoredLocale())

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      messages: dictionaries[locale],
      setLocale: (value) => {
        setStoredLocale(value)
        setLocaleState(value)
      },
    }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider.')
  }

  return context
}