declare namespace Express {
  export interface Request {
    user: {
      id: number
      email: string
      fp: string
      refreshToken?: string
    }
    fingerprint: string
  }
}

declare namespace Express {
  export interface ConnectionArguments {
    first?: number | null
    after?: string | null
    last?: number | null
    before?: string | null
  }
}
