import fs from 'node:fs'

import { env } from '../config/env'
import { prisma } from '../config/prisma'
import type { Locale } from '../types'
import { AppError } from '../utils/app-error'
import { asArray, asRecord, type InputJsonValue, type JsonValue } from '../utils/json'
import { resolveLocalizedObject } from '../utils/locale'
import { calculateReadingTimeMinutes } from '../utils/reading-time'
import { deleteUploadedFile, saveUploadedFile } from './upload-storage.service'

function translationRecord(value: JsonValue | null | undefined) {
  return asRecord(value) as Record<'en' | 'my', Record<string, unknown>>
}

function resolveTextRecord(value: JsonValue | null | undefined, locale: Locale) {
  const translations = translationRecord(value)
  const fallback = asRecord(translations.en as JsonValue | null | undefined)
  const localized = asRecord(translations[locale] as JsonValue | null | undefined)
  return {
    ...fallback,
    ...localized,
  }
}

function resolveNestedLocalizedText(value: unknown, locale: Locale, key: string) {
  const localizedSource = asRecord(value as JsonValue | null | undefined)
  const localized = asRecord(localizedSource[locale] as JsonValue | null | undefined)
  const fallback = asRecord(localizedSource.en as JsonValue | null | undefined)
  const resolved = localized[key] ?? fallback[key]
  return typeof resolved === 'string' ? resolved : ''
}

function serializeExperienceItem(item: {
  id: string
  company: string
  startDate: Date
  endDate: Date | null
  isCurrent: boolean
  sortOrder: number
  isVisible: boolean
  translations: JsonValue | null
  technologies: JsonValue | null
}) {
  return (locale: Locale) => {
    const localized = resolveTextRecord(item.translations, locale)
    return {
      id: item.id,
      company: item.company,
      startDate: item.startDate.toISOString().slice(0, 10),
      endDate: item.endDate?.toISOString().slice(0, 10) ?? null,
      isCurrent: item.isCurrent,
      sortOrder: item.sortOrder,
      isVisible: item.isVisible,
      roleTitle: typeof localized.roleTitle === 'string' ? localized.roleTitle : undefined,
      summary: typeof localized.summary === 'string' ? localized.summary : undefined,
      description: typeof localized.description === 'string' ? localized.description : undefined,
      technologies: asArray<string>(item.technologies),
    }
  }
}

function serializeSkill(item: {
  id: string
  slug: string
  categoryKey: string
  sortOrder: number
  isVisible: boolean
  translations: JsonValue | null
}) {
  return (locale: Locale) => {
    const localized = resolveTextRecord(item.translations, locale)
    return {
      id: item.id,
      slug: item.slug,
      categoryKey: item.categoryKey,
      sortOrder: item.sortOrder,
      isVisible: item.isVisible,
      name: typeof localized.name === 'string' ? localized.name : undefined,
      description: typeof localized.description === 'string' ? localized.description : undefined,
    }
  }
}

function serializeProject(item: {
  id: string
  slug: string
  githubUrl: string | null
  demoUrl: string | null
  isFeatured: boolean
  isPublished: boolean
  publishedAt: Date | null
  sortOrder: number
  translations: JsonValue | null
  categories: JsonValue | null
  technologies: JsonValue | null
}) {
  return (locale: Locale) => {
    const localized = resolveTextRecord(item.translations, locale)
    return {
      id: item.id,
      slug: item.slug,
      githubUrl: item.githubUrl,
      demoUrl: item.demoUrl,
      isFeatured: item.isFeatured,
      isPublished: item.isPublished,
      publishedAt: item.publishedAt?.toISOString() ?? null,
      sortOrder: item.sortOrder,
      title: typeof localized.title === 'string' ? localized.title : undefined,
      summary: typeof localized.summary === 'string' ? localized.summary : undefined,
      description: typeof localized.description === 'string' ? localized.description : undefined,
      categories: asArray<string>(item.categories),
      technologies: asArray<string>(item.technologies),
    }
  }
}

function serializeBlogPost(item: {
  id: string
  slug: string
  status: string
  featuredImageMediaId: string | null
  readingTimeMinutes: number
  publishedAt: Date | null
  translations: JsonValue | null
  categoryIds: JsonValue | null
  tagIds: JsonValue | null
}) {
  return (locale: Locale) => {
    const localized = resolveTextRecord(item.translations, locale)
    return {
      id: item.id,
      slug: item.slug,
      status: item.status,
      featuredImageMediaId: item.featuredImageMediaId,
      readingTimeMinutes: item.readingTimeMinutes,
      publishedAt: item.publishedAt?.toISOString() ?? null,
      title: typeof localized.title === 'string' ? localized.title : undefined,
      excerpt: typeof localized.excerpt === 'string' ? localized.excerpt : undefined,
      contentMarkdown: typeof localized.contentMarkdown === 'string' ? localized.contentMarkdown : undefined,
      seoTitle: typeof localized.seoTitle === 'string' ? localized.seoTitle : undefined,
      seoDescription: typeof localized.seoDescription === 'string' ? localized.seoDescription : undefined,
      categories: asArray<string>(item.categoryIds),
      tags: asArray<string>(item.tagIds),
    }
  }
}

function resolveTimeline(careerTimeline: JsonValue | null, locale: Locale) {
  return asArray<Record<string, unknown>>(careerTimeline).map((item) => ({
    startDate: String(item.startDate ?? ''),
    endDate: item.endDate ? String(item.endDate) : null,
    title: resolveNestedLocalizedText(item.title, locale, 'title') || resolveNestedLocalizedText(item.title, locale, 'value'),
    subtitle:
      resolveNestedLocalizedText(item.subtitle, locale, 'subtitle') || resolveNestedLocalizedText(item.subtitle, locale, 'value'),
    description:
      resolveNestedLocalizedText(item.description, locale, 'description') ||
      resolveNestedLocalizedText(item.description, locale, 'value'),
  }))
}

function assertRecord(value: unknown, message: string) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new AppError(400, 'VALIDATION_ERROR', message)
  }

  return value as Record<string, unknown>
}

function maybePublishedAt(status: unknown, publishedAt: unknown) {
  if (status === 'published') {
    return publishedAt ? new Date(String(publishedAt)) : new Date()
  }

  return null
}

export const contentService = {
  async getSiteSettings() {
    return prisma.siteSetting.upsert({
      where: { id: 'site-settings' },
      update: {},
      create: { id: 'site-settings', defaultLocale: env.APP_LOCALE_DEFAULT },
    })
  },

  async getNavigation() {
    const settings = await this.getSiteSettings()
    return {
      socialLinks: asArray<Record<string, unknown>>(settings.socialLinks),
      contactInfo: asRecord(settings.contactInfo),
      homepageSectionVisibility: asRecord(settings.homepageSectionVisibility),
    }
  },

  async getHome(locale: Locale) {
    const [homePage, settings, projects, posts] = await Promise.all([
      prisma.homePage.upsert({
        where: { id: 'home-page' },
        update: {},
        create: { id: 'home-page' },
      }),
      this.getSiteSettings(),
      prisma.project.findMany({
        where: { isPublished: true, isFeatured: true },
        orderBy: { sortOrder: 'asc' },
        take: 5,
      }),
      prisma.blogPost.findMany({
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
        take: 5,
      }),
    ])

    return {
      hero: resolveTextRecord(homePage.translations, locale),
      featuredProjects: projects.map((project: Awaited<typeof projects>[number]) => serializeProject(project)(locale)),
      latestPosts: posts.map((post: Awaited<typeof posts>[number]) => serializeBlogPost(post)(locale)),
      homepageSectionVisibility: asRecord(settings.homepageSectionVisibility),
    }
  },

  async getAbout(locale: Locale) {
    const aboutPage = await prisma.aboutPage.upsert({
      where: { id: 'about-page' },
      update: {},
      create: { id: 'about-page' },
    })

    const localized = resolveTextRecord(aboutPage.translations, locale)

    return {
      biography: typeof localized.biography === 'string' ? localized.biography : undefined,
      technicalSkillsText: typeof localized.technicalSkillsText === 'string' ? localized.technicalSkillsText : undefined,
      interestsText: typeof localized.interestsText === 'string' ? localized.interestsText : undefined,
      learningJourneyText: typeof localized.learningJourneyText === 'string' ? localized.learningJourneyText : undefined,
      careerTimeline: resolveTimeline(aboutPage.careerTimeline, locale),
    }
  },

  async getExperience(locale: Locale) {
    const items = await prisma.experienceItem.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
    })
    return items.map((item: Awaited<typeof items>[number]) => serializeExperienceItem(item)(locale))
  },

  async getSkills(locale: Locale) {
    const items = await prisma.skill.findMany({
      where: { isVisible: true },
      orderBy: [{ categoryKey: 'asc' }, { sortOrder: 'asc' }],
    })
    return items.map((item: Awaited<typeof items>[number]) => serializeSkill(item)(locale))
  },

  async getBlogPosts(locale: Locale, searchQuery?: string) {
    const posts = await prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
    })

    const serialized = posts.map((post: Awaited<typeof posts>[number]) => serializeBlogPost(post)(locale))

    if (!searchQuery) {
      return serialized
    }

    const lowered = searchQuery.toLowerCase()
    return serialized.filter((post: (typeof serialized)[number]) =>
      [post.title, post.excerpt, post.contentMarkdown].some((value) => value?.toLowerCase().includes(lowered)),
    )
  },

  async getBlogPostBySlug(slug: string, locale: Locale) {
    const post = await prisma.blogPost.findFirst({
      where: { slug, status: 'published' },
    })

    if (!post) {
      throw new AppError(404, 'NOT_FOUND', 'The requested blog post was not found.')
    }

    const serialized = serializeBlogPost(post)(locale)
    const relatedCandidates = await prisma.blogPost.findMany({
      where: {
        status: 'published',
        id: { not: post.id },
      },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    })

    return {
      ...serialized,
      relatedPosts: relatedCandidates.map((item: Awaited<typeof relatedCandidates>[number]) => serializeBlogPost(item)(locale)),
    }
  },

  async getBlogCategories(locale: Locale) {
    const items = await prisma.blogCategory.findMany({ orderBy: { slug: 'asc' } })
    return items.map((item: Awaited<typeof items>[number]) => ({
      id: item.id,
      slug: item.slug,
      ...resolveTextRecord(item.translations, locale),
    }))
  },

  async getBlogTags(locale: Locale) {
    const items = await prisma.blogTag.findMany({ orderBy: { slug: 'asc' } })
    return items.map((item: Awaited<typeof items>[number]) => ({
      id: item.id,
      slug: item.slug,
      ...resolveTextRecord(item.translations, locale),
    }))
  },

  async getDashboard() {
    const [experience, projects, skills, posts, categories, tags, uploads, recentPosts, recentUploads, draftCount, publishedCount] =
      await Promise.all([
        prisma.experienceItem.count(),
        prisma.project.count(),
        prisma.skill.count(),
        prisma.blogPost.count(),
        prisma.blogCategory.count(),
        prisma.blogTag.count(),
        prisma.mediaFile.count(),
        prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
        prisma.mediaFile.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
        prisma.blogPost.count({ where: { status: 'draft' } }),
        prisma.blogPost.count({ where: { status: 'published' } }),
      ])

    return {
      counts: { experience, projects, skills, posts, categories, tags, uploads },
      blogStatus: { draft: draftCount, published: publishedCount },
      recentPosts: recentPosts.map((post: Awaited<typeof recentPosts>[number]) => serializeBlogPost(post)('en')),
      recentUploads: recentUploads.map((upload: Awaited<typeof recentUploads>[number]) => ({
        id: upload.id,
        originalName: upload.originalName,
        kind: upload.kind,
        createdAt: upload.createdAt.toISOString(),
      })),
    }
  },

  getAdminHome() {
    return prisma.homePage.upsert({ where: { id: 'home-page' }, update: {}, create: { id: 'home-page' } })
  },

  updateAdminHome(body: unknown) {
    const data = assertRecord(body, 'Home payload must be an object.')
    return prisma.homePage.upsert({
      where: { id: 'home-page' },
      update: {
        featuredProjectLimit: Number(data.featuredProjectLimit ?? 3),
        latestBlogLimit: Number(data.latestBlogLimit ?? 3),
        translations: data.translations as InputJsonValue | undefined,
        sectionVisibility: data.sectionVisibility as InputJsonValue | undefined,
      },
      create: {
        id: 'home-page',
        featuredProjectLimit: Number(data.featuredProjectLimit ?? 3),
        latestBlogLimit: Number(data.latestBlogLimit ?? 3),
        translations: data.translations as InputJsonValue | undefined,
        sectionVisibility: data.sectionVisibility as InputJsonValue | undefined,
      },
    })
  },

  getAdminAbout() {
    return prisma.aboutPage.upsert({ where: { id: 'about-page' }, update: {}, create: { id: 'about-page' } })
  },

  updateAdminAbout(body: unknown) {
    const data = assertRecord(body, 'About payload must be an object.')
    return prisma.aboutPage.upsert({
      where: { id: 'about-page' },
      update: {
        profileMediaId: typeof data.profileMediaId === 'string' ? data.profileMediaId : null,
        translations: data.translations as InputJsonValue | undefined,
        careerTimeline: data.careerTimeline as InputJsonValue | undefined,
      },
      create: {
        id: 'about-page',
        profileMediaId: typeof data.profileMediaId === 'string' ? data.profileMediaId : null,
        translations: data.translations as InputJsonValue | undefined,
        careerTimeline: data.careerTimeline as InputJsonValue | undefined,
      },
    })
  },

  listExperienceAdmin() {
    return prisma.experienceItem.findMany({ orderBy: { sortOrder: 'asc' } })
  },

  createExperienceAdmin(body: unknown) {
    const data = assertRecord(body, 'Experience payload must be an object.')
    return prisma.experienceItem.create({
      data: {
        company: String(data.company ?? ''),
        startDate: new Date(String(data.startDate ?? new Date().toISOString())),
        endDate: data.endDate ? new Date(String(data.endDate)) : null,
        isCurrent: Boolean(data.isCurrent),
        sortOrder: Number(data.sortOrder ?? 0),
        isVisible: data.isVisible !== false,
        translations: data.translations as InputJsonValue | undefined,
        technologies: (data.technologies ?? []) as InputJsonValue,
        featuredProjectIds: (data.featuredProjectIds ?? []) as InputJsonValue,
      },
    })
  },

  getExperienceAdmin(id: string) {
    return prisma.experienceItem.findUnique({ where: { id } })
  },

  updateExperienceAdmin(id: string, body: unknown) {
    const data = assertRecord(body, 'Experience payload must be an object.')
    return prisma.experienceItem.update({
      where: { id },
      data: {
        company: typeof data.company === 'string' ? data.company : undefined,
        startDate: data.startDate ? new Date(String(data.startDate)) : undefined,
        endDate: data.endDate ? new Date(String(data.endDate)) : null,
        isCurrent: typeof data.isCurrent === 'boolean' ? data.isCurrent : undefined,
        sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : undefined,
        isVisible: typeof data.isVisible === 'boolean' ? data.isVisible : undefined,
        translations: data.translations as InputJsonValue | undefined,
        technologies: data.technologies as InputJsonValue | undefined,
        featuredProjectIds: data.featuredProjectIds as InputJsonValue | undefined,
      },
    })
  },

  deleteExperienceAdmin(id: string) {
    return prisma.experienceItem.delete({ where: { id } })
  },

  listSkillsAdmin() {
    return prisma.skill.findMany({ orderBy: [{ categoryKey: 'asc' }, { sortOrder: 'asc' }] })
  },

  createSkillAdmin(body: unknown) {
    const data = assertRecord(body, 'Skill payload must be an object.')
    return prisma.skill.create({
      data: {
        slug: String(data.slug ?? ''),
        categoryKey: String(data.categoryKey ?? 'general'),
        sortOrder: Number(data.sortOrder ?? 0),
        isVisible: data.isVisible !== false,
        translations: data.translations as InputJsonValue | undefined,
      },
    })
  },

  getSkillAdmin(id: string) {
    return prisma.skill.findUnique({ where: { id } })
  },

  updateSkillAdmin(id: string, body: unknown) {
    const data = assertRecord(body, 'Skill payload must be an object.')
    return prisma.skill.update({
      where: { id },
      data: {
        slug: typeof data.slug === 'string' ? data.slug : undefined,
        categoryKey: typeof data.categoryKey === 'string' ? data.categoryKey : undefined,
        sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : undefined,
        isVisible: typeof data.isVisible === 'boolean' ? data.isVisible : undefined,
        translations: data.translations as InputJsonValue | undefined,
      },
    })
  },

  deleteSkillAdmin(id: string) {
    return prisma.skill.delete({ where: { id } })
  },

  listProjectsAdmin() {
    return prisma.project.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] })
  },

  createProjectAdmin(body: unknown) {
    const data = assertRecord(body, 'Project payload must be an object.')
    return prisma.project.create({
      data: {
        slug: String(data.slug ?? ''),
        githubUrl: typeof data.githubUrl === 'string' ? data.githubUrl : null,
        demoUrl: typeof data.demoUrl === 'string' ? data.demoUrl : null,
        isFeatured: Boolean(data.isFeatured),
        isPublished: Boolean(data.isPublished),
        publishedAt: maybePublishedAt(data.isPublished ? 'published' : 'draft', data.publishedAt),
        sortOrder: Number(data.sortOrder ?? 0),
        translations: data.translations as InputJsonValue | undefined,
        categories: (data.categories ?? []) as InputJsonValue,
        technologies: (data.technologies ?? []) as InputJsonValue,
        galleryMediaIds: (data.galleryMediaIds ?? []) as InputJsonValue,
      },
    })
  },

  getProjectAdmin(id: string) {
    return prisma.project.findUnique({ where: { id } })
  },

  updateProjectAdmin(id: string, body: unknown) {
    const data = assertRecord(body, 'Project payload must be an object.')
    return prisma.project.update({
      where: { id },
      data: {
        slug: typeof data.slug === 'string' ? data.slug : undefined,
        githubUrl: typeof data.githubUrl === 'string' ? data.githubUrl : null,
        demoUrl: typeof data.demoUrl === 'string' ? data.demoUrl : null,
        isFeatured: typeof data.isFeatured === 'boolean' ? data.isFeatured : undefined,
        isPublished: typeof data.isPublished === 'boolean' ? data.isPublished : undefined,
        publishedAt: data.isPublished !== undefined || data.publishedAt ? maybePublishedAt(data.isPublished ? 'published' : 'draft', data.publishedAt) : undefined,
        sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : undefined,
        translations: data.translations as InputJsonValue | undefined,
        categories: data.categories as InputJsonValue | undefined,
        technologies: data.technologies as InputJsonValue | undefined,
        galleryMediaIds: data.galleryMediaIds as InputJsonValue | undefined,
      },
    })
  },

  deleteProjectAdmin(id: string) {
    return prisma.project.delete({ where: { id } })
  },

  listBlogPostsAdmin() {
    return prisma.blogPost.findMany({ orderBy: { updatedAt: 'desc' } })
  },

  createBlogPostAdmin(body: unknown) {
    const data = assertRecord(body, 'Blog post payload must be an object.')
    const translations = (data.translations ?? {}) as Record<string, Record<string, unknown>>
    const englishContent = asRecord(translations.en as JsonValue | null | undefined).contentMarkdown
    const readingTimeMinutes = calculateReadingTimeMinutes(typeof englishContent === 'string' ? englishContent : undefined)

    return prisma.blogPost.create({
      data: {
        slug: String(data.slug ?? ''),
        status: String(data.status ?? 'draft'),
        featuredImageMediaId: typeof data.featuredImageMediaId === 'string' ? data.featuredImageMediaId : null,
        readingTimeMinutes,
        publishedAt: maybePublishedAt(data.status, data.publishedAt),
        translations: data.translations as InputJsonValue | undefined,
        categoryIds: (data.categoryIds ?? []) as InputJsonValue,
        tagIds: (data.tagIds ?? []) as InputJsonValue,
      },
    })
  },

  getBlogPostAdmin(id: string) {
    return prisma.blogPost.findUnique({ where: { id } })
  },

  updateBlogPostAdmin(id: string, body: unknown) {
    const data = assertRecord(body, 'Blog post payload must be an object.')
    const translations = data.translations ? (data.translations as Record<string, Record<string, unknown>>) : undefined
    const englishContent = translations
      ? asRecord(translations.en as JsonValue | null | undefined).contentMarkdown
      : undefined
    const readingTimeMinutes =
      typeof englishContent === 'string' ? calculateReadingTimeMinutes(englishContent) : undefined

    return prisma.blogPost.update({
      where: { id },
      data: {
        slug: typeof data.slug === 'string' ? data.slug : undefined,
        status: typeof data.status === 'string' ? data.status : undefined,
        featuredImageMediaId: typeof data.featuredImageMediaId === 'string' ? data.featuredImageMediaId : null,
        readingTimeMinutes,
        publishedAt: data.status || data.publishedAt ? maybePublishedAt(data.status, data.publishedAt) : undefined,
        translations: data.translations as InputJsonValue | undefined,
        categoryIds: data.categoryIds as InputJsonValue | undefined,
        tagIds: data.tagIds as InputJsonValue | undefined,
      },
    })
  },

  deleteBlogPostAdmin(id: string) {
    return prisma.blogPost.delete({ where: { id } })
  },

  listBlogCategoriesAdmin() {
    return prisma.blogCategory.findMany({ orderBy: { slug: 'asc' } })
  },

  createBlogCategoryAdmin(body: unknown) {
    const data = assertRecord(body, 'Category payload must be an object.')
    return prisma.blogCategory.create({
      data: {
        slug: String(data.slug ?? ''),
        translations: data.translations as InputJsonValue | undefined,
      },
    })
  },

  updateBlogCategoryAdmin(id: string, body: unknown) {
    const data = assertRecord(body, 'Category payload must be an object.')
    return prisma.blogCategory.update({
      where: { id },
      data: {
        slug: typeof data.slug === 'string' ? data.slug : undefined,
        translations: data.translations as InputJsonValue | undefined,
      },
    })
  },

  deleteBlogCategoryAdmin(id: string) {
    return prisma.blogCategory.delete({ where: { id } })
  },

  listBlogTagsAdmin() {
    return prisma.blogTag.findMany({ orderBy: { slug: 'asc' } })
  },

  createBlogTagAdmin(body: unknown) {
    const data = assertRecord(body, 'Tag payload must be an object.')
    return prisma.blogTag.create({
      data: {
        slug: String(data.slug ?? ''),
        translations: data.translations as InputJsonValue | undefined,
      },
    })
  },

  updateBlogTagAdmin(id: string, body: unknown) {
    const data = assertRecord(body, 'Tag payload must be an object.')
    return prisma.blogTag.update({
      where: { id },
      data: {
        slug: typeof data.slug === 'string' ? data.slug : undefined,
        translations: data.translations as InputJsonValue | undefined,
      },
    })
  },

  deleteBlogTagAdmin(id: string) {
    return prisma.blogTag.delete({ where: { id } })
  },

  async getSettingsAdmin() {
    const settings = await this.getSiteSettings()
    return settings
  },

  async updateSettingsAdmin(body: unknown) {
    const data = assertRecord(body, 'Settings payload must be an object.')
    return prisma.siteSetting.upsert({
      where: { id: 'site-settings' },
      update: {
        siteTitle: data.siteTitle as InputJsonValue | undefined,
        defaultLocale: typeof data.defaultLocale === 'string' ? data.defaultLocale : undefined,
        seoDefaultTitle: data.seoDefaultTitle as InputJsonValue | undefined,
        seoDefaultDescription: data.seoDefaultDescription as InputJsonValue | undefined,
        logoMediaId: typeof data.logoMediaId === 'string' ? data.logoMediaId : null,
        faviconMediaId: typeof data.faviconMediaId === 'string' ? data.faviconMediaId : null,
        socialLinks: data.socialLinks as InputJsonValue | undefined,
        contactInfo: data.contactInfo as InputJsonValue | undefined,
        analyticsScriptIds: data.analyticsScriptIds as InputJsonValue | undefined,
        homepageSectionVisibility: data.homepageSectionVisibility as InputJsonValue | undefined,
      },
      create: {
        id: 'site-settings',
        defaultLocale: typeof data.defaultLocale === 'string' ? data.defaultLocale : env.APP_LOCALE_DEFAULT,
        siteTitle: data.siteTitle as InputJsonValue | undefined,
        seoDefaultTitle: data.seoDefaultTitle as InputJsonValue | undefined,
        seoDefaultDescription: data.seoDefaultDescription as InputJsonValue | undefined,
        logoMediaId: typeof data.logoMediaId === 'string' ? data.logoMediaId : null,
        faviconMediaId: typeof data.faviconMediaId === 'string' ? data.faviconMediaId : null,
        socialLinks: data.socialLinks as InputJsonValue | undefined,
        contactInfo: data.contactInfo as InputJsonValue | undefined,
        analyticsScriptIds: data.analyticsScriptIds as InputJsonValue | undefined,
        homepageSectionVisibility: data.homepageSectionVisibility as InputJsonValue | undefined,
      },
    })
  },

  listUploadsAdmin() {
    return prisma.mediaFile.findMany({ orderBy: { createdAt: 'desc' } })
  },

  async createUploadAdmin(file: Express.Multer.File, uploadedById?: string) {
    if (!file) {
      throw new AppError(400, 'VALIDATION_ERROR', 'A file upload is required.')
    }

    const maxBytes = env.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if (file.size > maxBytes) {
      if (typeof file.path === 'string' && file.path.length > 0) {
        fs.rmSync(file.path, { force: true })
      }
      throw new AppError(400, 'UPLOAD_TOO_LARGE', 'The uploaded file exceeds the configured size limit.')
    }

    if (env.UPLOAD_STORAGE === 'disabled') {
      throw new AppError(
        503,
        'STORAGE_NOT_CONFIGURED',
        'File uploads are disabled until UPLOAD_STORAGE is fully configured (local, s3, or vercel-blob).',
      )
    }

    const saved = await saveUploadedFile(file)

    return prisma.mediaFile.create({
      data: {
        originalName: file.originalname,
        storedName: saved.storedName,
        mimeType: file.mimetype,
        size: file.size,
        path: saved.publicPath,
        kind: file.mimetype.startsWith('image/') ? 'image' : 'document',
        uploadedById: uploadedById ?? null,
      },
    })
  },

  async deleteUploadAdmin(id: string) {
    const upload = await prisma.mediaFile.findUnique({ where: { id } })

    if (!upload) {
      throw new AppError(404, 'NOT_FOUND', 'The requested upload does not exist.')
    }

    await deleteUploadedFile(upload)
    await prisma.mediaFile.delete({ where: { id } })
  },
}
