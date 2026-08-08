import type { Request, Response } from 'express'

import type { RequestWithContext } from '../types'
import { contentService } from '../services/content.service'
import { AppError } from '../utils/app-error'
import { sendData } from '../utils/response'

function authUserId(request: Request) {
  return (request as RequestWithContext).authUser?.id
}

function getRequiredParam(request: Request, key: string) {
  const value = request.params[key]
  const resolved = Array.isArray(value) ? value[0] : value

  if (!resolved) {
    throw new AppError(400, 'VALIDATION_ERROR', `Missing route parameter: ${key}.`)
  }

  return resolved
}

export const adminController = {
  async dashboard(_request: Request, response: Response) {
    return sendData(response, await contentService.getDashboard())
  },
  async homeGet(_request: Request, response: Response) {
    return sendData(response, await contentService.getAdminHome())
  },
  async homePatch(request: Request, response: Response) {
    return sendData(response, await contentService.updateAdminHome(request.body))
  },
  async aboutGet(_request: Request, response: Response) {
    return sendData(response, await contentService.getAdminAbout())
  },
  async aboutPatch(request: Request, response: Response) {
    return sendData(response, await contentService.updateAdminAbout(request.body))
  },
  async experienceList(_request: Request, response: Response) {
    return sendData(response, await contentService.listExperienceAdmin())
  },
  async experienceCreate(request: Request, response: Response) {
    return sendData(response, await contentService.createExperienceAdmin(request.body), 201)
  },
  async experienceGet(request: Request, response: Response) {
    return sendData(response, await contentService.getExperienceAdmin(getRequiredParam(request, 'id')))
  },
  async experiencePatch(request: Request, response: Response) {
    return sendData(response, await contentService.updateExperienceAdmin(getRequiredParam(request, 'id'), request.body))
  },
  async experienceDelete(request: Request, response: Response) {
    await contentService.deleteExperienceAdmin(getRequiredParam(request, 'id'))
    return sendData(response, { success: true })
  },
  async skillsList(_request: Request, response: Response) {
    return sendData(response, await contentService.listSkillsAdmin())
  },
  async skillsCreate(request: Request, response: Response) {
    return sendData(response, await contentService.createSkillAdmin(request.body), 201)
  },
  async skillsGet(request: Request, response: Response) {
    return sendData(response, await contentService.getSkillAdmin(getRequiredParam(request, 'id')))
  },
  async skillsPatch(request: Request, response: Response) {
    return sendData(response, await contentService.updateSkillAdmin(getRequiredParam(request, 'id'), request.body))
  },
  async skillsDelete(request: Request, response: Response) {
    await contentService.deleteSkillAdmin(getRequiredParam(request, 'id'))
    return sendData(response, { success: true })
  },
  async projectsList(_request: Request, response: Response) {
    return sendData(response, await contentService.listProjectsAdmin())
  },
  async projectsCreate(request: Request, response: Response) {
    return sendData(response, await contentService.createProjectAdmin(request.body), 201)
  },
  async projectsGet(request: Request, response: Response) {
    return sendData(response, await contentService.getProjectAdmin(getRequiredParam(request, 'id')))
  },
  async projectsPatch(request: Request, response: Response) {
    return sendData(response, await contentService.updateProjectAdmin(getRequiredParam(request, 'id'), request.body))
  },
  async projectsDelete(request: Request, response: Response) {
    await contentService.deleteProjectAdmin(getRequiredParam(request, 'id'))
    return sendData(response, { success: true })
  },
  async postsList(_request: Request, response: Response) {
    return sendData(response, await contentService.listBlogPostsAdmin())
  },
  async postsCreate(request: Request, response: Response) {
    return sendData(response, await contentService.createBlogPostAdmin(request.body), 201)
  },
  async postsGet(request: Request, response: Response) {
    return sendData(response, await contentService.getBlogPostAdmin(getRequiredParam(request, 'id')))
  },
  async postsPatch(request: Request, response: Response) {
    return sendData(response, await contentService.updateBlogPostAdmin(getRequiredParam(request, 'id'), request.body))
  },
  async postsDelete(request: Request, response: Response) {
    await contentService.deleteBlogPostAdmin(getRequiredParam(request, 'id'))
    return sendData(response, { success: true })
  },
  async categoriesList(_request: Request, response: Response) {
    return sendData(response, await contentService.listBlogCategoriesAdmin())
  },
  async categoriesCreate(request: Request, response: Response) {
    return sendData(response, await contentService.createBlogCategoryAdmin(request.body), 201)
  },
  async categoriesPatch(request: Request, response: Response) {
    return sendData(response, await contentService.updateBlogCategoryAdmin(getRequiredParam(request, 'id'), request.body))
  },
  async categoriesDelete(request: Request, response: Response) {
    await contentService.deleteBlogCategoryAdmin(getRequiredParam(request, 'id'))
    return sendData(response, { success: true })
  },
  async tagsList(_request: Request, response: Response) {
    return sendData(response, await contentService.listBlogTagsAdmin())
  },
  async tagsCreate(request: Request, response: Response) {
    return sendData(response, await contentService.createBlogTagAdmin(request.body), 201)
  },
  async tagsPatch(request: Request, response: Response) {
    return sendData(response, await contentService.updateBlogTagAdmin(getRequiredParam(request, 'id'), request.body))
  },
  async tagsDelete(request: Request, response: Response) {
    await contentService.deleteBlogTagAdmin(getRequiredParam(request, 'id'))
    return sendData(response, { success: true })
  },
  async uploadsList(_request: Request, response: Response) {
    return sendData(response, await contentService.listUploadsAdmin())
  },
  async uploadsCreate(request: Request, response: Response) {
    return sendData(response, await contentService.createUploadAdmin(request.file!, authUserId(request)), 201)
  },
  async uploadsDelete(request: Request, response: Response) {
    await contentService.deleteUploadAdmin(getRequiredParam(request, 'id'))
    return sendData(response, { success: true })
  },
  async settingsGet(_request: Request, response: Response) {
    return sendData(response, await contentService.getSettingsAdmin())
  },
  async settingsPatch(request: Request, response: Response) {
    return sendData(response, await contentService.updateSettingsAdmin(request.body))
  },
}