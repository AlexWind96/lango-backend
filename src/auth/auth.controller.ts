import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from './dto'
import { Tokens, UserAuthData } from './types'
import { RtGuard } from './guard'
import { GetFingerprint, GetUser, Public } from './decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(
    @Body() dto: RegisterDto,
    @GetFingerprint() fingerprint: string,
  ): Promise<Tokens> {
    return this.authService.register(dto, fingerprint)
  }
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(
    @Body() dto: LoginDto,
    @GetFingerprint() fingerprint: string,
  ): Promise<Tokens> {
    return this.authService.login(dto, fingerprint)
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@GetUser('id') userId: string) {
    return this.authService.logout(userId)
  }

  @Public()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshTokens(@GetUser() user: UserAuthData) {
    return this.authService.refreshTokens(user.id, user.refreshToken, user.fp)
  }
}
