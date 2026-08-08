import type { Response } from 'express'

export function sendData(response: Response, data: unknown, statusCode = 200, meta?: unknown) {
  return response.status(statusCode).json(meta ? { data, meta } : { data })
}

export function sendError(
  response: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
) {
  return response.status(statusCode).json({
    error: {
      code,
      message,
      details,
    },
  })
}