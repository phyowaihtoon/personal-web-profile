import crypto from 'node:crypto'

export function hashValue(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

export function createOpaqueToken() {
  return crypto.randomBytes(48).toString('hex')
}