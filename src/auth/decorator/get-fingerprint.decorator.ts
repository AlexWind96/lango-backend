import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetFingerprint = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.fingerprint
  },
)
