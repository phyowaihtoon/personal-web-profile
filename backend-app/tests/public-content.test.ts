import request from 'supertest'

import { prisma } from '../src/config/prisma'
import { createApp } from '../src/app'

describe('public content routes', () => {
  const app = createApp()

  beforeEach(async () => {
    await prisma.blogPost.deleteMany()
    await prisma.project.deleteMany()
    await prisma.skill.deleteMany()
    await prisma.experienceItem.deleteMany()
    await prisma.aboutPage.deleteMany()
    await prisma.homePage.deleteMany()

    await prisma.homePage.create({
      data: {
        id: 'home-page',
        translations: {
          en: { heroTitle: 'English title', heroSubtitle: 'English subtitle' },
          my: { heroTitle: 'Myanmar title' },
        },
      },
    })

    await prisma.aboutPage.create({
      data: {
        id: 'about-page',
        translations: {
          en: {
            biography: 'English bio',
            technicalSkillsText: 'English skills',
            interestsText: 'English interests',
            learningJourneyText: 'English learning',
          },
        },
        careerTimeline: [],
      },
    })
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('returns localized content with English fallback', async () => {
    const response = await request(app).get('/api/v1/public/home?lang=my')

    expect(response.status).toBe(200)
    expect(response.body.data.hero.heroTitle).toBe('Myanmar title')
    expect(response.body.data.hero.heroSubtitle).toBe('English subtitle')
  })

  it('returns about content', async () => {
    const response = await request(app).get('/api/v1/public/about?lang=en')

    expect(response.status).toBe(200)
    expect(response.body.data.biography).toBe('English bio')
  })

  it('returns homepage section visibility from site settings', async () => {
    await prisma.siteSetting.upsert({
      where: { id: 'site-settings' },
      update: {
        homepageSectionVisibility: {
          featuredProjects: true,
          latestPosts: false,
          skillsOverview: false,
          experienceSummary: true,
        },
      },
      create: {
        id: 'site-settings',
        defaultLocale: 'en',
        homepageSectionVisibility: {
          featuredProjects: true,
          latestPosts: false,
          skillsOverview: false,
          experienceSummary: true,
        },
      },
    })

    const response = await request(app).get('/api/v1/public/home?lang=en')

    expect(response.status).toBe(200)
    expect(response.body.data.homepageSectionVisibility.featuredProjects).toBe(true)
    expect(response.body.data.homepageSectionVisibility.latestPosts).toBe(false)
    expect(response.body.data.homepageSectionVisibility.skillsOverview).toBe(false)
  })
})