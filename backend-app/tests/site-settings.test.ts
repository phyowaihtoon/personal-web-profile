import request from 'supertest'

import { createApp } from '../src/app'
import { prisma } from '../src/config/prisma'
import { contentService } from '../src/services/content.service'

describe('site settings public flow', () => {
  const app = createApp()

  beforeEach(async () => {
    await prisma.siteSetting.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('returns the settings saved through the admin content service to the public API', async () => {
    await contentService.updateSettingsAdmin({
      siteTitle: { en: 'Studio Name', my: 'အမည်' },
      defaultLocale: 'en',
      contactInfo: { email: 'hello@example.com', location: 'Yangon' },
      socialLinks: [{ label: 'GitHub', url: 'https://github.com/example' }],
    })

    const response = await request(app).get('/api/v1/public/site-settings')

    expect(response.status).toBe(200)
    expect(response.body.data.siteTitle.en).toBe('Studio Name')
    expect(response.body.data.contactInfo.email).toBe('hello@example.com')
    expect(response.body.data.socialLinks[0].label).toBe('GitHub')
  })
})
