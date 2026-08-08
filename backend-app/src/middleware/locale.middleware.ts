import type { NextFunction, RequestHandler, Response } from 'express'

import { env } from '../config/env'
import type { RequestWithContext } from '../types'
import { isLocale } from '../utils/locale'

export const localeMiddleware: RequestHandler = (request, _response: Response, next: NextFunction) => {
  const contextualRequest = request as RequestWithContext
  const queryLocale = typeof request.query.lang === 'string' ? request.query.lang : undefined
  const headerLocale = request.headers['accept-language']?.split(',')[0]?.split('-')[0]

  contextualRequest.locale = isLocale(queryLocale)
    ? queryLocale
    : isLocale(headerLocale)
      ? headerLocale
      : env.APP_LOCALE_DEFAULT

  next()
}