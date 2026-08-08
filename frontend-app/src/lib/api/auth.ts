import type { AuthTokens, AuthUser, BootstrapInput, LoginInput } from '../../features/auth/types'

import { apiRequest } from './client'

export const authApi = {
  bootstrap: (input: BootstrapInput) =>
    apiRequest<{ user: AuthUser; accessToken: string }>('/auth/bootstrap', {
      method: 'POST',
      body: input,
    }),
  login: (input: LoginInput) =>
    apiRequest<{ user: AuthUser; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: input,
    }),
  refresh: () => apiRequest<AuthTokens>('/auth/refresh', { method: 'POST' }),
  me: (token: string) => apiRequest<AuthUser>('/auth/me', { token }),
  verify: (token: string) => apiRequest<{ valid: boolean; user: AuthUser }>('/auth/verify', { method: 'POST', token }),
  logout: (token: string | null) => apiRequest<{ success: boolean }>('/auth/logout', { method: 'POST', token }),
}