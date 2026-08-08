import request from 'supertest'

import { prisma } from '../src/config/prisma'
import { createApp } from '../src/app'

describe('auth routes', () => {
  const app = createApp()

  beforeEach(async () => {
    await prisma.refreshSession.deleteMany()
    await prisma.adminUser.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('bootstraps the first admin and blocks second bootstrap attempts', async () => {
    const first = await request(app).post('/api/v1/auth/bootstrap').send({
      email: 'admin@example.com',
      password: 'password123',
    })

    expect(first.status).toBe(201)
    expect(first.body.data.user.email).toBe('admin@example.com')
    expect(first.body.data.accessToken).toBeTruthy()
    expect(first.headers['set-cookie']).toBeDefined()

    const second = await request(app).post('/api/v1/auth/bootstrap').send({
      email: 'other@example.com',
      password: 'password123',
    })

    expect(second.status).toBe(409)
  })

  it('logs in, reads /me, refreshes, verifies, and logs out', async () => {
    await request(app).post('/api/v1/auth/bootstrap').send({
      email: 'admin@example.com',
      password: 'password123',
    })

    const login = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@example.com',
      password: 'password123',
    })

    const accessToken = login.body.data.accessToken as string
    const cookie = login.headers['set-cookie']?.[0]
    expect(cookie).toBeDefined()

    const me = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${accessToken}`)
    expect(me.status).toBe(200)
    expect(me.body.data.email).toBe('admin@example.com')

    const refreshed = await request(app).post('/api/v1/auth/refresh').set('Cookie', cookie as string)
    expect(refreshed.status).toBe(200)
    expect(refreshed.body.data.accessToken).toBeTruthy()

    const verified = await request(app)
      .post('/api/v1/auth/verify')
      .set('Authorization', `Bearer ${refreshed.body.data.accessToken as string}`)
    expect(verified.status).toBe(200)
    expect(verified.body.data.valid).toBe(true)

    const logout = await request(app).post('/api/v1/auth/logout').set('Cookie', cookie as string)
    expect(logout.status).toBe(200)
    expect(logout.body.data.success).toBe(true)
  })
})