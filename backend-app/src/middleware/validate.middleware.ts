import type { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

import { sendError } from '../utils/response'

export function validate(request: Request, response: Response, next: NextFunction) {
  const result = validationResult(request)

  if (!result.isEmpty()) {
    return sendError(response, 400, 'VALIDATION_ERROR', 'Validation failed.', result.array())
  }

  next()
}