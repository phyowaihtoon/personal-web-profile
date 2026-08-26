import path from 'node:path'
import dotenv from 'dotenv'
import { z } from 'zod'

import { applyDatabaseEnv, DATABASE_TARGETS } from './database-target'
import { resolveUploadStorageEnv, UPLOAD_STORAGE_TARGETS } from './upload-storage'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_TARGET: z.enum(DATABASE_TARGETS).default('onprem'),
  DATABASE_URL: z.string().optional(),
  SUPABASE_DATABASE_URL: z.string().optional(),
  SUPABASE_DIRECT_URL: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  APP_LOCALE_DEFAULT: z.enum(['en', 'my']).default('en'),
  UPLOAD_DIR: z.string().default('uploads'),
  UPLOAD_STORAGE: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.enum(UPLOAD_STORAGE_TARGETS).default('disabled'),
  ),
  SPACES_REGION: z.string().default('sgp1'),
  SPACES_ENDPOINT: z.string().default('sgp1.digitaloceanspaces.com'),
  SPACES_BUCKET: z.string().default(''),
  SPACES_CDN_BASE_URL: z.string().default(''),
  SPACES_ACCESS_KEY_ID: z.string().default(''),
  SPACES_SECRET_ACCESS_KEY: z.string().default(''),
  BLOB_READ_WRITE_TOKEN: z.string().default(''),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().positive().default(5),
  COOKIE_SECURE: z.coerce.boolean().default(false),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`)
}

process.env.DATABASE_TARGET = parsed.data.DATABASE_TARGET
const database = applyDatabaseEnv()
const uploadStorage = resolveUploadStorageEnv({
  ...process.env,
  UPLOAD_STORAGE: parsed.data.UPLOAD_STORAGE,
})
process.env.UPLOAD_STORAGE = uploadStorage

export const env = {
  ...parsed.data,
  DATABASE_TARGET: database.databaseTarget,
  DATABASE_URL: database.databaseUrl,
  DIRECT_URL: database.directUrl,
  UPLOAD_STORAGE: uploadStorage,
  uploadDirAbsolute: path.resolve(process.cwd(), parsed.data.UPLOAD_DIR),
}
