import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto, RegisterDto } from './dto'
import * as argon from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Tokens } from './types'

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto, fingerprint: string): Promise<Tokens> {
    //generate hash password
    const hash = await AuthService.getHash(dto.password)
    //save user to db
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash: hash,
          name: dto.name,
        },
      })
      const tokens = await this.getTokens(user.id, user.email, fingerprint)

      await this.updateRtHash(user.id, tokens.refresh_token)

      return tokens
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException(
          'User with such credentials is already exists',
        )
      }
      throw error
    }
  }
  async login(dto: LoginDto, fingerprint: string): Promise<Tokens> {
    //find the user by email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    })
    //if not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect')
    //compare passwords
    const isCorrectPassword = await AuthService.verifyHash(
      user.hash,
      dto.password,
    )
    //if password incorrect throw an exception
    if (!isCorrectPassword)
      throw new ForbiddenException('Credentials incorrect')

    //Get tokens
    const tokens = await this.getTokens(user.id, user.email, fingerprint)
    //update hashedRt in DB
    await this.updateRtHash(user.id, tokens.refresh_token)

    return tokens
  }

  async logout(userId: string) {
    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    })
    return
  }
  async refreshTokens(
    userId: string,
    rt: string,
    fingerprint: string,
  ): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user || !user.hashedRt) throw new ForbiddenException('Access denied')

    const rtMatches = await AuthService.verifyHash(user.hashedRt, rt)

    if (!rtMatches) throw new ForbiddenException('Access denied')
    //Get tokens
    const tokens = await this.getTokens(user.id, user.email, fingerprint)
    //update hashedRt in DB
    await this.updateRtHash(user.id, tokens.refresh_token)

    return tokens
  }

  private async getTokens(
    userId: string,
    email: string,
    fingerprint: string,
  ): Promise<Tokens> {
    const data = {
      sub: userId,
      email,
      fp: fingerprint,
    }
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(data, {
        expiresIn: 30 * 60,
        secret: this.configService.get('JWT_AT_SECRET'),
      }),
      this.jwt.signAsync(data, {
        expiresIn: 60 * 60 * 24 * 7,
        secret: this.configService.get('JWT_RT_SECRET'),
      }),
    ])
    return {
      access_token: at,
      refresh_token: rt,
    }
  }

  private async updateRtHash(userId: string, rt: string) {
    const hash = await AuthService.getHash(rt)
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    })
  }

  private static async getHash(plain: string) {
    return await argon.hash(plain)
  }

  private static async verifyHash(hash: string, plain: string) {
    return await argon.verify(hash, plain)
  }
}
