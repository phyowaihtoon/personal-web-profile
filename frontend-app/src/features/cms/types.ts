export type LocaleCode = 'en' | 'my'

export type TranslationFieldKind = 'text' | 'textarea' | 'markdown'

export type TranslationField = {
  key: string
  label: string
  kind: TranslationFieldKind
  rows?: number
}

export type CmsField =
  | { kind: 'text'; path: string; label: string; placeholder?: string }
  | { kind: 'textarea'; path: string; label: string; rows?: number }
  | { kind: 'markdown'; path: string; label: string }
  | { kind: 'number'; path: string; label: string }
  | { kind: 'boolean'; path: string; label: string }
  | { kind: 'date'; path: string; label: string }
  | { kind: 'select'; path: string; label: string; options: Array<{ value: string; label: string }> }
  | { kind: 'stringList'; path: string; label: string; hint?: string }
  | {
      kind: 'booleanMap'
      path: string
      label: string
      keys: Array<{ key: string; label: string }>
    }
  | { kind: 'localizedString'; path: string; label: string }
  | { kind: 'localizedTextarea'; path: string; label: string; rows?: number }
  | { kind: 'translationGroup'; label: string; fields: TranslationField[] }
  | {
      kind: 'objectList'
      path: string
      label: string
      itemLabel: string
      fields: CmsField[]
      createItem: () => Record<string, unknown>
    }

export type CmsSchema = {
  fields: CmsField[]
  summary?: (record: Record<string, unknown>) => string
}
