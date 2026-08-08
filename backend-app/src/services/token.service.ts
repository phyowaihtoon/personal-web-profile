import jwt from 'jsonwebtoken'

import { env } from '../config/env'
import type { AuthenticatedUser, JwtPayload } from '../types'
import { AppError } from '../utils/app-error'

export const REFRESH_COOKIE_NAME = 'personal_website_refresh'

export const tokenService = {
  createAccessToken(user: AuthenticatedUser) {
    return jwt.sign(user, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    })
  },
  createRefreshToken(user: AuthenticatedUser, sessionId: string) {
    return jwt.sign({ ...user, sessionId }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    })
  },
  verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload
    } catch {
      throw new AppError(401, 'AUTH_INVALID_TOKEN', 'The access token is invalid or expired.')
    }
  },
  verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload
    } catch {
      throw new AppError(401, 'AUTH_INVALID_REFRESH', 'The refresh session is invalid or expired.')
    }
  },
}