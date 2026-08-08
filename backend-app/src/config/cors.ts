import type { CorsOptions } from 'cors'

import { env } from './env'

export const corsOptions: CorsOptions = {
  origin: env.CORS_ORIGIN.split(',').map((value) => value.trim()),
  credentials: true,
}