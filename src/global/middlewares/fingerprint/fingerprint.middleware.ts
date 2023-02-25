import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class FingerprintMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    //Enhance request with fingerprint
    // req.fingerprint = getHashedFingerPrint(req.headers, req.ip)
    next()
  }
}
