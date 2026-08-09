import path from 'node:path'
import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  APP_LOCALE_DEFAULT: z.enum(['en', 'my']).default('en'),
  UPLOAD_DIR: z.string().default('uploads'),
  UPLOAD_STORAGE: z.enum(['local', 's3']).default('local'),
  SPACES_REGION: z.string().default('sgp1'),
  SPACES_ENDPOINT: z.string().default('sgp1.digitaloceanspaces.com'),
  SPACES_BUCKET: z.string().default(''),
  SPACES_CDN_BASE_URL: z.string().default(''),
  SPACES_ACCESS_KEY_ID: z.string().default(''),
  SPACES_SECRET_ACCESS_KEY: z.string().default(''),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().positive().default(5),
  COOKIE_SECURE: z.coerce.boolean().default(false),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`)
}

if (parsed.data.UPLOAD_STORAGE === 's3') {
  const requiredKeys: Array<keyof typeof parsed.data> = [
    'SPACES_REGION',
    'SPACES_ENDPOINT',
    'SPACES_BUCKET',
    'SPACES_ACCESS_KEY_ID',
    'SPACES_SECRET_ACCESS_KEY',
  ]

  const missing = requiredKeys.filter((key) => String(parsed.data[key]).trim().length === 0)
  if (missing.length > 0) {
    throw new Error(`Invalid environment configuration: missing ${missing.join(', ')} when UPLOAD_STORAGE=s3`)
  }
}

export const env = {
  ...parsed.data,
  uploadDirAbsolute: path.resolve(process.cwd(), parsed.data.UPLOAD_DIR),
}