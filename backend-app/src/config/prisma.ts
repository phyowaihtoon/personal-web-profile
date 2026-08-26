import { PrismaClient } from '@prisma/client'

import { env } from './env'

declare global {
  var __prisma__: PrismaClient | undefined
}

export const prisma =
  global.__prisma__ ??
  new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') {
  global.__prisma__ = prisma
}