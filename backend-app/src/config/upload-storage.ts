export const UPLOAD_STORAGE_TARGETS = ['disabled', 'local', 's3', 'vercel-blob'] as const

export type UploadStorageTarget = (typeof UPLOAD_STORAGE_TARGETS)[number]

const S3_REQUIRED_KEYS = [
  'SPACES_REGION',
  'SPACES_ENDPOINT',
  'SPACES_BUCKET',
  'SPACES_ACCESS_KEY_ID',
  'SPACES_SECRET_ACCESS_KEY',
] as const

function isPresent(value: string | undefined): boolean {
  return (value?.trim() ?? '').length > 0
}

export function parseUploadStorage(value: string | undefined): UploadStorageTarget {
  const normalized = (value ?? 'disabled').trim().toLowerCase()
  if (normalized.length === 0) {
    return 'disabled'
  }

  if (
    normalized === 'disabled' ||
    normalized === 'local' ||
    normalized === 's3' ||
    normalized === 'vercel-blob'
  ) {
    return normalized
  }

  throw new Error(
    `Invalid environment configuration: UPLOAD_STORAGE must be one of ${UPLOAD_STORAGE_TARGETS.join(', ')}`,
  )
}

export function usesLocalUploadStorage(target: UploadStorageTarget): boolean {
  return target === 'local'
}

export function isUploadStorageEnabled(target: UploadStorageTarget): boolean {
  return target !== 'disabled'
}

function hasS3Credentials(envSource: NodeJS.ProcessEnv): boolean {
  return S3_REQUIRED_KEYS.every((name) => isPresent(envSource[name]))
}

/**
 * Resolve the effective upload target without failing boot.
 * Incomplete or serverless-incompatible settings fall back to `disabled`.
 */
export function resolveUploadStorageEnv(
  envSource: NodeJS.ProcessEnv = process.env,
): UploadStorageTarget {
  const requested = parseUploadStorage(envSource.UPLOAD_STORAGE)

  if (requested === 's3') {
    return hasS3Credentials(envSource) ? 's3' : 'disabled'
  }

  if (requested === 'vercel-blob') {
    return isPresent(envSource.BLOB_READ_WRITE_TOKEN) ? 'vercel-blob' : 'disabled'
  }

  if (requested === 'local') {
    // Vercel functions cannot write to the deployment bundle filesystem.
    if (envSource.VERCEL === '1') {
      return 'disabled'
    }
    return 'local'
  }

  return 'disabled'
}
