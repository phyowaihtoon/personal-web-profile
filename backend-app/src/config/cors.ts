import type { CorsOptions } from 'cors'

import { env } from './env'

const configuredOrigins = env.CORS_ORIGIN.split(',').map((value) => value.trim())
const allowAllOrigins = configuredOrigins.includes('*')

export const corsOptions: CorsOptions = {
  // With credentials enabled, wildcard '*' is not valid; reflect request origin instead.
  origin: allowAllOrigins ? true : configuredOrigins,
  credentials: true,
}