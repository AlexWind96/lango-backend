import { createParamDecorator, ExecutionContext } from '@nestjs/common'

type Keys = 'id' | 'email' | 'refreshToken' | 'fp'

export const GetUser = createParamDecorator(
  (data: Keys | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    if (data) {
      return request.user[data]
    }
    return request.user
  },
)
