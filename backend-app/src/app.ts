import fs from 'node:fs'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import { corsOptions } from './config/cors'
import { env } from './config/env'
import { errorMiddleware } from './middleware/error.middleware'
import { localeMiddleware } from './middleware/locale.middleware'
import { notFoundMiddleware } from './middleware/not-found.middleware'
import { v1Routes } from './routes/v1'

fs.mkdirSync(env.uploadDirAbsolute, { recursive: true })

export function createApp() {
  const app = express()

  app.use(cors(corsOptions))
  app.use(cookieParser())
  app.use(express.json({ limit: '2mb' }))
  app.use(localeMiddleware)
  app.use('/uploads', express.static(env.uploadDirAbsolute))
  app.use('/api/v1', v1Routes)
  app.use(notFoundMiddleware)
  app.use(errorMiddleware)

  return app
}