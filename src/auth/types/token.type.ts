export interface Tokens {
  access_token: string
  refresh_token: string
}

export interface JwtPayload {
  sub: string
  email: string
}
