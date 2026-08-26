import fs from 'node:fs'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import { corsOptions } from './config/cors'
import { env } from './config/env'
import { usesLocalUploadStorage } from './config/upload-storage'
import { errorMiddleware } from './middleware/error.middleware'
import { localeMiddleware } from './middleware/locale.middleware'
import { notFoundMiddleware } from './middleware/not-found.middleware'
import { v1Routes } from './routes/v1'

function ensureLocalUploadDir() {
  if (!usesLocalUploadStorage(env.UPLOAD_STORAGE)) {
    return
  }

  try {
    fs.mkdirSync(env.uploadDirAbsolute, { recursive: true })
  } catch {
    // Read-only hosts (such as Vercel) should still boot; uploads stay disabled for this process.
  }
}

export function createApp() {
  const app = express()

  ensureLocalUploadDir()

  app.use(cors(corsOptions))
  app.use(cookieParser())
  app.use(express.json({ limit: '2mb' }))
  app.use(localeMiddleware)
  if (usesLocalUploadStorage(env.UPLOAD_STORAGE)) {
    app.use('/uploads', express.static(env.uploadDirAbsolute))
  }
  app.use('/api/v1', v1Routes)
  app.use(notFoundMiddleware)
  app.use(errorMiddleware)

  return app
}
