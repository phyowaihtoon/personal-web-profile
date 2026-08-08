import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import type { AuthUser, BootstrapInput, LoginInput } from '../../features/auth/types'
import { authApi } from '../../lib/api/auth'
import { ApiError } from '../../lib/api/client'

type AuthContextValue = {
  accessToken: string | null
  user: AuthUser | null
  isReady: boolean
  isAuthenticated: boolean
  errorMessage: string | null
  login: (input: LoginInput) => Promise<void>
  bootstrap: (input: BootstrapInput) => Promise<void>
  logout: () => Promise<void>
  verifyCurrentToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextValue | null>(null)

type Props = {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const bootstrapSession = async () => {
      try {
        const tokens = await authApi.refresh()
        if (cancelled) {
          return
        }

        setAccessToken(tokens.accessToken)
        const me = await authApi.me(tokens.accessToken)

        if (!cancelled) {
          setUser(me)
        }
      } catch {
        if (!cancelled) {
          setAccessToken(null)
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setIsReady(true)
        }
      }
    }

    void bootstrapSession()

    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      user,
      isReady,
      isAuthenticated: Boolean(accessToken && user),
      errorMessage,
      login: async (input) => {
        setErrorMessage(null)
        try {
          const result = await authApi.login(input)
          setAccessToken(result.accessToken)
          setUser(result.user)
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Login failed.'
          setErrorMessage(message)
          throw error
        }
      },
      bootstrap: async (input) => {
        setErrorMessage(null)
        try {
          const result = await authApi.bootstrap(input)
          setAccessToken(result.accessToken)
          setUser(result.user)
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Bootstrap failed.'
          setErrorMessage(message)
          throw error
        }
      },
      logout: async () => {
        try {
          await authApi.logout(accessToken)
        } finally {
          setAccessToken(null)
          setUser(null)
        }
      },
      verifyCurrentToken: async () => {
        if (!accessToken) {
          return false
        }

        try {
          const result = await authApi.verify(accessToken)
          setUser(result.user)
          return result.valid
        } catch {
          setAccessToken(null)
          setUser(null)
          return false
        }
      },
    }),
    [accessToken, errorMessage, isReady, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.')
  }

  return context
}