import type { Request, Response } from 'express'

import { sendData } from '../utils/response'

export const healthController = {
  getStatus(_request: Request, response: Response) {
    return sendData(response, {
      status: 'ok',
      service: 'backend-app',
      version: 'v1',
    })
  },
}