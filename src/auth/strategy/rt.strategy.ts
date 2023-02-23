import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { JwtPayload, UserAuthData } from '../types'

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_RT_SECRET'),
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: JwtPayload): UserAuthData {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim()
    return {
      id: payload.sub,
      email: payload.email,
      fp: payload.fp,
      refreshToken,
    }
  }
}
