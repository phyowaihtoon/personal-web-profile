function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function getAtPath(source: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (!isRecord(current)) {
      return undefined
    }
    return current[key]
  }, source)
}

export function setAtPath(source: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split('.')
  const root: Record<string, unknown> = { ...source }
  let cursor: Record<string, unknown> = root

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value
      return
    }

    const existing = cursor[key]
    const next = isRecord(existing) ? { ...existing } : {}
    cursor[key] = next
    cursor = next
  })

  return root
}

export function toDateInputValue(value: unknown): string {
  if (typeof value !== 'string' || !value) {
    return ''
  }
  return value.slice(0, 10)
}

export function cloneRecord(value: Record<string, unknown>): Record<string, unknown> {
  return structuredClone(value)
}

const READ_ONLY_KEYS = new Set(['id', 'createdAt', 'updatedAt', 'readingTimeMinutes'])

export function toSavePayload(record: Record<string, unknown>): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  Object.entries(record).forEach(([key, value]) => {
    if (!READ_ONLY_KEYS.has(key)) {
      payload[key] = value
    }
  })
  return payload
}

export function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value.map((item) => String(item))
}

export function asObjectList(value: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) {
    return []
  }
  return value.filter(isRecord).map((item) => ({ ...item }))
}

export function asBooleanMap(value: unknown, keys: string[]): Record<string, boolean> {
  const source = isRecord(value) ? value : {}
  return Object.fromEntries(keys.map((key) => [key, Boolean(source[key])]))
}

export function asLocalizedPair(value: unknown): { en: string; my: string } {
  if (typeof value === 'string') {
    return { en: value, my: '' }
  }
  if (!isRecord(value)) {
    return { en: '', my: '' }
  }
  return {
    en: typeof value.en === 'string' ? value.en : '',
    my: typeof value.my === 'string' ? value.my : '',
  }
}
