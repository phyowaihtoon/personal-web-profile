import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import {
  asBooleanMap,
  asLocalizedPair,
  asObjectList,
  asStringList,
  getAtPath,
  setAtPath,
  toDateInputValue,
} from '../path'
import type { CmsField, LocaleCode, TranslationField } from '../types'

type Props = {
  fields: CmsField[]
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
}

function FieldLabel({ children }: { children: string }) {
  return <span className="mb-2 block text-sm font-medium text-[var(--foreground)]">{children}</span>
}

function LocaleTabs({
  locale,
  onChange,
}: {
  locale: LocaleCode
  onChange: (locale: LocaleCode) => void
}) {
  return (
    <div className="mb-4 inline-flex rounded-md border border-[var(--border)] bg-[var(--surface)] p-1">
      {([
        { id: 'en', label: 'English' },
        { id: 'my', label: 'Myanmar' },
      ] as const).map((option) => (
        <button
          key={option.id}
          type="button"
          className={`rounded px-3 py-1.5 text-sm transition-colors ${
            locale === option.id
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function MarkdownField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (next: string) => void
}) {
  const [mode, setMode] = useState<'write' | 'preview'>('write')

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <FieldLabel>{label}</FieldLabel>
        <div className="inline-flex rounded-md border border-[var(--border)] p-0.5">
          <button
            type="button"
            className={`rounded px-2.5 py-1 text-xs ${mode === 'write' ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--muted)]'}`}
            onClick={() => setMode('write')}
          >
            Write
          </button>
          <button
            type="button"
            className={`rounded px-2.5 py-1 text-xs ${mode === 'preview' ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--muted)]'}`}
            onClick={() => setMode('preview')}
          >
            Preview
          </button>
        </div>
      </div>
      {mode === 'write' ? (
        <Textarea className="min-h-[18rem] font-mono text-sm" value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <div className="prose-markdown min-h-[18rem] rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-7">
          {value.trim() ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown> : <p className="text-[var(--muted)]">Nothing to preview yet.</p>}
        </div>
      )}
    </div>
  )
}

function TranslationGroupFields({
  fields,
  value,
  onChange,
}: {
  fields: TranslationField[]
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
}) {
  const [locale, setLocale] = useState<LocaleCode>('en')
  const translations =
    value.translations && typeof value.translations === 'object' && !Array.isArray(value.translations)
      ? (value.translations as Record<string, unknown>)
      : {}
  const localeValues =
    translations[locale] && typeof translations[locale] === 'object' && !Array.isArray(translations[locale])
      ? (translations[locale] as Record<string, unknown>)
      : {}

  const updateLocaleField = (key: string, nextValue: string) => {
    onChange({
      ...value,
      translations: {
        ...translations,
        [locale]: {
          ...localeValues,
          [key]: nextValue,
        },
      },
    })
  }

  return (
    <div className="space-y-4 rounded-md border border-[var(--border)] bg-[var(--accent-soft)]/35 p-4">
      <LocaleTabs locale={locale} onChange={setLocale} />
      {fields.map((field) => {
        const fieldValue = typeof localeValues[field.key] === 'string' ? String(localeValues[field.key]) : ''
        if (field.kind === 'markdown') {
          return (
            <MarkdownField
              key={`${locale}-${field.key}`}
              label={field.label}
              value={fieldValue}
              onChange={(next) => updateLocaleField(field.key, next)}
            />
          )
        }
        if (field.kind === 'textarea') {
          return (
            <label key={`${locale}-${field.key}`} className="block">
              <FieldLabel>{field.label}</FieldLabel>
              <Textarea
                rows={field.rows ?? 4}
                value={fieldValue}
                onChange={(event) => updateLocaleField(field.key, event.target.value)}
              />
            </label>
          )
        }
        return (
          <label key={`${locale}-${field.key}`} className="block">
            <FieldLabel>{field.label}</FieldLabel>
            <Input value={fieldValue} onChange={(event) => updateLocaleField(field.key, event.target.value)} />
          </label>
        )
      })}
    </div>
  )
}

function LocalizedPairField({
  label,
  value,
  onChange,
  multiline,
  rows = 3,
}: {
  label: string
  value: unknown
  onChange: (next: { en: string; my: string }) => void
  multiline?: boolean
  rows?: number
}) {
  const pair = asLocalizedPair(value)
  const [locale, setLocale] = useState<LocaleCode>('en')

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <LocaleTabs locale={locale} onChange={setLocale} />
      {multiline ? (
        <label className="block">
          <span className="sr-only">{label}</span>
          <Textarea
            rows={rows}
            value={pair[locale]}
            onChange={(event) => onChange({ ...pair, [locale]: event.target.value })}
          />
        </label>
      ) : (
        <label className="block">
          <span className="sr-only">{label}</span>
          <Input value={pair[locale]} onChange={(event) => onChange({ ...pair, [locale]: event.target.value })} />
        </label>
      )}
    </div>
  )
}

function renderField(
  field: CmsField,
  value: Record<string, unknown>,
  onChange: (next: Record<string, unknown>) => void,
  keyPrefix = '',
) {
  const fieldKey = `${keyPrefix}${field.kind}-${'path' in field ? field.path : field.label}`

  if (field.kind === 'translationGroup') {
    return (
      <div key={fieldKey} className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide text-[var(--accent)]">{field.label}</h3>
        <TranslationGroupFields fields={field.fields} value={value} onChange={onChange} />
      </div>
    )
  }

  if (field.kind === 'localizedString' || field.kind === 'localizedTextarea') {
    return (
      <LocalizedPairField
        key={fieldKey}
        label={field.label}
        value={getAtPath(value, field.path)}
        multiline={field.kind === 'localizedTextarea'}
        rows={field.kind === 'localizedTextarea' ? field.rows : undefined}
        onChange={(next) => onChange(setAtPath(value, field.path, next))}
      />
    )
  }

  if (field.kind === 'booleanMap') {
    const map = asBooleanMap(
      getAtPath(value, field.path),
      field.keys.map((item) => item.key),
    )
    return (
      <div key={fieldKey} className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide text-[var(--accent)]">{field.label}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {field.keys.map((item) => (
            <label key={item.key} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={Boolean(map[item.key])}
                onChange={(event) =>
                  onChange(
                    setAtPath(value, field.path, {
                      ...map,
                      [item.key]: event.target.checked,
                    }),
                  )
                }
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  if (field.kind === 'stringList') {
    const list = asStringList(getAtPath(value, field.path))
    return (
      <label key={fieldKey} className="block">
        <FieldLabel>{field.label}</FieldLabel>
        <Input
          value={list.join(', ')}
          placeholder={field.hint}
          onChange={(event) =>
            onChange(
              setAtPath(
                value,
                field.path,
                event.target.value
                  .split(',')
                  .map((item) => item.trim())
                  .filter(Boolean),
              ),
            )
          }
        />
        {field.hint ? <p className="mt-1 text-xs text-[var(--muted)]">{field.hint}</p> : null}
      </label>
    )
  }

  if (field.kind === 'objectList') {
    const items = asObjectList(getAtPath(value, field.path))
    return (
      <div key={fieldKey} className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold tracking-wide text-[var(--accent)]">{field.label}</h3>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onChange(setAtPath(value, field.path, [...items, field.createItem()]))}
          >
            Add {field.itemLabel.toLowerCase()}
          </Button>
        </div>
        {items.length === 0 ? <p className="text-sm text-[var(--muted)]">No items yet.</p> : null}
        {items.map((item, index) => (
          <div key={`${field.path}-${index}`} className="space-y-4 rounded-md border border-[var(--border)] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">
                {field.itemLabel} {index + 1}
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  onChange(
                    setAtPath(
                      value,
                      field.path,
                      items.filter((_, itemIndex) => itemIndex !== index),
                    ),
                  )
                }
              >
                Remove
              </Button>
            </div>
            <CmsFieldList
              fields={field.fields}
              value={item}
              onChange={(nextItem) => {
                const nextItems = items.map((current, itemIndex) => (itemIndex === index ? nextItem : current))
                onChange(setAtPath(value, field.path, nextItems))
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  if (field.kind === 'boolean') {
    return (
      <label key={fieldKey} className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={Boolean(getAtPath(value, field.path))}
          onChange={(event) => onChange(setAtPath(value, field.path, event.target.checked))}
        />
        <span>{field.label}</span>
      </label>
    )
  }

  if (field.kind === 'number') {
    const raw = getAtPath(value, field.path)
    return (
      <label key={fieldKey} className="block">
        <FieldLabel>{field.label}</FieldLabel>
        <Input
          type="number"
          value={typeof raw === 'number' ? raw : Number(raw ?? 0)}
          onChange={(event) => onChange(setAtPath(value, field.path, Number(event.target.value)))}
        />
      </label>
    )
  }

  if (field.kind === 'date') {
    const raw = getAtPath(value, field.path)
    return (
      <label key={fieldKey} className="block">
        <FieldLabel>{field.label}</FieldLabel>
        <Input
          type="date"
          value={toDateInputValue(raw)}
          onChange={(event) => onChange(setAtPath(value, field.path, event.target.value || null))}
        />
      </label>
    )
  }

  if (field.kind === 'select') {
    return (
      <label key={fieldKey} className="block">
        <FieldLabel>{field.label}</FieldLabel>
        <select
          className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
          value={String(getAtPath(value, field.path) ?? '')}
          onChange={(event) => onChange(setAtPath(value, field.path, event.target.value))}
        >
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    )
  }

  if (field.kind === 'markdown') {
    return (
      <MarkdownField
        key={fieldKey}
        label={field.label}
        value={String(getAtPath(value, field.path) ?? '')}
        onChange={(next) => onChange(setAtPath(value, field.path, next))}
      />
    )
  }

  if (field.kind === 'textarea') {
    return (
      <label key={fieldKey} className="block">
        <FieldLabel>{field.label}</FieldLabel>
        <Textarea
          rows={field.rows ?? 4}
          value={String(getAtPath(value, field.path) ?? '')}
          onChange={(event) => onChange(setAtPath(value, field.path, event.target.value))}
        />
      </label>
    )
  }

  return (
    <label key={fieldKey} className="block">
      <FieldLabel>{field.label}</FieldLabel>
      <Input
        placeholder={field.placeholder}
        value={String(getAtPath(value, field.path) ?? '')}
        onChange={(event) => onChange(setAtPath(value, field.path, event.target.value))}
      />
    </label>
  )
}

export function CmsFieldList({ fields, value, onChange }: Props) {
  return <div className="space-y-4">{fields.map((field) => renderField(field, value, onChange))}</div>
}
