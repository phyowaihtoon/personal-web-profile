export const DATABASE_TARGETS = ['onprem', 'supabase'] as const

export type DatabaseTarget = (typeof DATABASE_TARGETS)[number]

export type ResolvedDatabaseEnv = {
  databaseTarget: DatabaseTarget
  databaseUrl: string
  directUrl: string
}

function readRequired(name: string, value: string | undefined): string {
  const trimmed = value?.trim() ?? ''
  if (trimmed.length === 0) {
    throw new Error(`Invalid environment configuration: ${name} is required`)
  }
  return trimmed
}

export function parseDatabaseTarget(value: string | undefined): DatabaseTarget {
  const normalized = (value ?? 'onprem').trim().toLowerCase()
  if (normalized === 'onprem' || normalized === 'supabase') {
    return normalized
  }

  throw new Error(
    `Invalid environment configuration: DATABASE_TARGET must be one of ${DATABASE_TARGETS.join(', ')}`,
  )
}

/**
 * Resolve Prisma connection URLs from DATABASE_TARGET.
 * - onprem: DATABASE_URL (directUrl mirrors DATABASE_URL)
 * - supabase: SUPABASE_DATABASE_URL + SUPABASE_DIRECT_URL
 */
export function resolveDatabaseEnv(
  envSource: NodeJS.ProcessEnv = process.env,
): ResolvedDatabaseEnv {
  const databaseTarget = parseDatabaseTarget(envSource.DATABASE_TARGET)

  if (databaseTarget === 'onprem') {
    const databaseUrl = readRequired('DATABASE_URL', envSource.DATABASE_URL)
    return {
      databaseTarget,
      databaseUrl,
      directUrl: databaseUrl,
    }
  }

  const databaseUrl = readRequired('SUPABASE_DATABASE_URL', envSource.SUPABASE_DATABASE_URL)
  const directUrl = readRequired('SUPABASE_DIRECT_URL', envSource.SUPABASE_DIRECT_URL)

  return {
    databaseTarget,
    databaseUrl,
    directUrl,
  }
}

/** Apply resolved URLs onto process.env so Prisma Client and CLI see them. */
export function applyDatabaseEnv(envSource: NodeJS.ProcessEnv = process.env): ResolvedDatabaseEnv {
  const resolved = resolveDatabaseEnv(envSource)
  process.env.DATABASE_TARGET = resolved.databaseTarget
  process.env.DATABASE_URL = resolved.databaseUrl
  process.env.DIRECT_URL = resolved.directUrl
  return resolved
}
