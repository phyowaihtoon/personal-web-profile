import type { Request, Response } from 'express'

import { sendError } from '../utils/response'

export function notFoundMiddleware(_request: Request, response: Response) {
  return sendError(response, 404, 'NOT_FOUND', 'The requested resource was not found.')
}