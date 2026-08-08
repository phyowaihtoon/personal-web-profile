import request from 'supertest'

import { createApp } from '../src/app'

describe('health route', () => {
  it('returns API status', async () => {
    const response = await request(createApp()).get('/api/v1/health')

    expect(response.status).toBe(200)
    expect(response.body.data.status).toBe('ok')
    expect(response.body.data.version).toBe('v1')
  })
})