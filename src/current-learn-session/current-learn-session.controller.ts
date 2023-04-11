import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common'
import { CurrentLearnSessionService } from './current-learn-session.service'
import { UpdateCurrentLearnSessionDto } from './dto/update-current-learn-session.dto'
import { GetUser } from '../auth/decorator'

@Controller('current-learn-session')
export class CurrentLearnSessionController {
  constructor(
    private readonly currentLearnSessionService: CurrentLearnSessionService,
  ) {}

  @Get()
  getCurrentLearnSession(@GetUser('id') userId: string) {
    return this.currentLearnSessionService.getCurrentLearnSession(userId)
  }

  @HttpCode(HttpStatus.OK)
  @Post('complete')
  completeCurrentLearnSession(@GetUser('id') userId: string) {
    return this.currentLearnSessionService.completeCurrentLearnSession(userId)
  }

  @Patch()
  updateCurrentLearnSession(
    @GetUser('id') userId: string,
    @Body() dto: UpdateCurrentLearnSessionDto,
  ) {
    return this.currentLearnSessionService.updateModules(userId, dto)
  }
}
