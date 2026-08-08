import type { NextFunction, Request, RequestHandler, Response } from 'express'

import type { RequestWithContext } from '../types'
import { AppError } from '../utils/app-error'
import { tokenService } from '../services/token.service'

function extractBearerToken(request: Request) {
  const authorization = request.headers.authorization
  if (!authorization?.startsWith('Bearer ')) {
    throw new AppError(401, 'AUTH_REQUIRED', 'Authentication is required.')
  }

  return authorization.slice('Bearer '.length)
}

export const authMiddleware: RequestHandler = (request, _response: Response, next: NextFunction) => {
  const contextualRequest = request as RequestWithContext
  const token = extractBearerToken(request)
  const payload = tokenService.verifyAccessToken(token)

  contextualRequest.authUser = {
    id: payload.id,
    email: payload.email,
    role: payload.role,
  }

  next()
}

export const requireAdmin: RequestHandler = (request, _response: Response, next: NextFunction) => {
  const contextualRequest = request as RequestWithContext

  if (contextualRequest.authUser?.role !== 'admin') {
    throw new AppError(403, 'AUTH_FORBIDDEN', 'Admin access is required.')
  }

  next()
}