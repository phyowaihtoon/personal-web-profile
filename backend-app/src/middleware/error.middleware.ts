import type { NextFunction, Request, Response } from 'express'

import { AppError } from '../utils/app-error'
import { sendError } from '../utils/response'

export function errorMiddleware(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return sendError(response, error.statusCode, error.code, error.message, error.details)
  }

  console.error(error)
  return sendError(response, 500, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred.')
}