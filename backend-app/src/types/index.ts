import type { Request } from 'express'

export type Locale = 'en' | 'my'

export type LocalizedRecord<T> = {
  en?: T
  my?: T
}

export type AuthenticatedUser = {
  id: string
  email: string
  role: string
}

export type JwtPayload = AuthenticatedUser & {
  sessionId?: string
}

export type RequestWithContext = Request & {
  locale?: Locale
  authUser?: AuthenticatedUser
}

export type AuthResponsePayload = {
  user: AuthenticatedUser
  accessToken: string
}