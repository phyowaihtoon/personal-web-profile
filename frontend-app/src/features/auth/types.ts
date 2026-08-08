export type AuthUser = {
  id: string
  email: string
  role: string
}

export type LoginInput = {
  email: string
  password: string
}

export type BootstrapInput = LoginInput

export type AuthTokens = {
  accessToken: string
}