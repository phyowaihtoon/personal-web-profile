export type JsonValue = any
export type InputJsonValue = any

export function asRecord(value: JsonValue | null | undefined): Record<string, unknown> {
  if (!value || Array.isArray(value) || typeof value !== 'object') {
    return {}
  }

  return value as Record<string, unknown>
}

export function asArray<T>(value: JsonValue | null | undefined): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}