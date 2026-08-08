import bcrypt from 'bcryptjs'

import { prisma } from '../config/prisma'
import type { AuthResponsePayload, AuthenticatedUser } from '../types'
import { AppError } from '../utils/app-error'
import { createOpaqueToken, hashValue } from '../utils/crypto'
import { tokenService } from './token.service'

function toAuthUser(user: { id: string; email: string; role: string }): AuthenticatedUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  }
}

function createAuthResponse(user: AuthenticatedUser, sessionId: string): AuthResponsePayload {
  return {
    user,
    accessToken: tokenService.createAccessToken(user),
  }
}

export const authService = {
  async bootstrap(email: string, password: string, metadata: { userAgent?: string; ipAddress?: string }) {
    const adminCount = await prisma.adminUser.count()
    if (adminCount > 0) {
      throw new AppError(409, 'AUTH_BOOTSTRAP_DISABLED', 'Bootstrap is disabled because an admin already exists.')
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const admin = await prisma.adminUser.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
      },
    })

    return this.createSession(admin, metadata)
  },

  async login(email: string, password: string, metadata: { userAgent?: string; ipAddress?: string }) {
    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!admin || !admin.isActive) {
      throw new AppError(401, 'AUTH_INVALID_CREDENTIALS', 'Invalid email or password.')
    }

    const passwordMatches = await bcrypt.compare(password, admin.passwordHash)

    if (!passwordMatches) {
      throw new AppError(401, 'AUTH_INVALID_CREDENTIALS', 'Invalid email or password.')
    }

    return this.createSession(admin, metadata)
  },

  async createSession(
    admin: { id: string; email: string; role: string },
    metadata: { userAgent?: string; ipAddress?: string },
  ) {
    const sessionToken = createOpaqueToken()
    const session = await prisma.refreshSession.create({
      data: {
        adminUserId: admin.id,
        sessionTokenHash: hashValue(sessionToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: metadata.userAgent,
        ipAddress: metadata.ipAddress,
      },
    })

    return {
      response: createAuthResponse(toAuthUser(admin), session.id),
      refreshToken: tokenService.createRefreshToken(toAuthUser(admin), sessionToken),
    }
  },

  async refresh(refreshToken: string, metadata: { userAgent?: string; ipAddress?: string }) {
    const payload = tokenService.verifyRefreshToken(refreshToken)

    if (!payload.sessionId) {
      throw new AppError(401, 'AUTH_INVALID_REFRESH', 'The refresh session is invalid.')
    }

    const session = await prisma.refreshSession.findUnique({
      where: { sessionTokenHash: hashValue(payload.sessionId) },
      include: { adminUser: true },
    })

    if (!session || session.revokedAt || session.expiresAt.getTime() <= Date.now() || !session.adminUser.isActive) {
      throw new AppError(401, 'AUTH_REFRESH_EXPIRED', 'The refresh session is expired or revoked.')
    }

    await prisma.refreshSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    })

    return this.createSession(session.adminUser, metadata)
  },

  async logout(refreshToken: string | undefined) {
    if (!refreshToken) {
      return
    }

    try {
      const payload = tokenService.verifyRefreshToken(refreshToken)
      if (!payload.sessionId) {
        return
      }

      const session = await prisma.refreshSession.findUnique({
        where: { sessionTokenHash: hashValue(payload.sessionId) },
      })

      if (session) {
        await prisma.refreshSession.update({
          where: { id: session.id },
          data: { revokedAt: new Date() },
        })
      }
    } catch {
      return
    }
  },

  async getMe(userId: string) {
    const admin = await prisma.adminUser.findUnique({ where: { id: userId } })

    if (!admin || !admin.isActive) {
      throw new AppError(401, 'AUTH_INVALID_TOKEN', 'The access token is invalid or expired.')
    }

    return toAuthUser(admin)
  },
}