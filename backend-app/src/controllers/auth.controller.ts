import type { Request, Response } from 'express'

import type { RequestWithContext } from '../types'
import { sendData } from '../utils/response'
import { authService } from '../services/auth.service'
import { env } from '../config/env'
import { REFRESH_COOKIE_NAME, tokenService } from '../services/token.service'

function setRefreshCookie(response: Response, refreshToken: string) {
  response.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.COOKIE_SECURE,
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

function clearRefreshCookie(response: Response) {
  response.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.COOKIE_SECURE,
    path: '/api/v1/auth',
  })
}

function getRequestMetadata(request: Request) {
  return {
    userAgent: request.headers['user-agent'],
    ipAddress: request.ip,
  }
}

export const authController = {
  async bootstrap(request: Request, response: Response) {
    const { email, password } = request.body as { email: string; password: string }
    const result = await authService.bootstrap(email, password, getRequestMetadata(request))
    setRefreshCookie(response, result.refreshToken)
    return sendData(response, result.response, 201)
  },

  async login(request: Request, response: Response) {
    const { email, password } = request.body as { email: string; password: string }
    const result = await authService.login(email, password, getRequestMetadata(request))
    setRefreshCookie(response, result.refreshToken)
    return sendData(response, result.response)
  },

  async refresh(request: Request, response: Response) {
    const refreshToken = request.cookies[REFRESH_COOKIE_NAME] as string | undefined
    const result = await authService.refresh(refreshToken ?? '', getRequestMetadata(request))
    setRefreshCookie(response, result.refreshToken)
    return sendData(response, { accessToken: result.response.accessToken })
  },

  async logout(request: Request, response: Response) {
    const refreshToken = request.cookies[REFRESH_COOKIE_NAME] as string | undefined
    await authService.logout(refreshToken)
    clearRefreshCookie(response)
    return sendData(response, { success: true })
  },

  async me(request: RequestWithContext, response: Response) {
    const user = await authService.getMe(request.authUser!.id)
    return sendData(response, user)
  },

  async verify(request: RequestWithContext, response: Response) {
    const token = request.headers.authorization?.replace(/^Bearer\s+/i, '') ?? ''
    const payload = tokenService.verifyAccessToken(token)
    const user = await authService.getMe(payload.id)
    return sendData(response, { valid: true, user })
  },
}