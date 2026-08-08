import type { Request, Response } from 'express'

import type { RequestWithContext } from '../types'
import { contentService } from '../services/content.service'
import { AppError } from '../utils/app-error'
import { sendData } from '../utils/response'

function getLocale(request: Request) {
  return (request as RequestWithContext).locale ?? 'en'
}

function getRequiredParam(request: Request, key: string) {
  const value = request.params[key]
  const resolved = Array.isArray(value) ? value[0] : value

  if (!resolved) {
    throw new AppError(400, 'VALIDATION_ERROR', `Missing route parameter: ${key}.`)
  }

  return resolved
}

export const publicController = {
  async siteSettings(_request: Request, response: Response) {
    return sendData(response, await contentService.getSiteSettings())
  },
  async navigation(_request: Request, response: Response) {
    return sendData(response, await contentService.getNavigation())
  },
  async home(request: Request, response: Response) {
    return sendData(response, await contentService.getHome(getLocale(request)))
  },
  async about(request: Request, response: Response) {
    return sendData(response, await contentService.getAbout(getLocale(request)))
  },
  async experience(request: Request, response: Response) {
    return sendData(response, await contentService.getExperience(getLocale(request)))
  },
  async skills(request: Request, response: Response) {
    return sendData(response, await contentService.getSkills(getLocale(request)))
  },
  async blogPosts(request: Request, response: Response) {
    const searchQuery = typeof request.query.q === 'string' ? request.query.q : undefined
    return sendData(response, await contentService.getBlogPosts(getLocale(request), searchQuery))
  },
  async blogPost(request: Request, response: Response) {
    return sendData(response, await contentService.getBlogPostBySlug(getRequiredParam(request, 'slug'), getLocale(request)))
  },
  async blogCategories(request: Request, response: Response) {
    return sendData(response, await contentService.getBlogCategories(getLocale(request)))
  },
  async blogTags(request: Request, response: Response) {
    return sendData(response, await contentService.getBlogTags(getLocale(request)))
  },
  async blogSearch(request: Request, response: Response) {
    const searchQuery = typeof request.query.q === 'string' ? request.query.q : undefined
    return sendData(response, await contentService.getBlogPosts(getLocale(request), searchQuery))
  },
}