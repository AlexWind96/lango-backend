import { Controller, Get, Param, Query } from '@nestjs/common'
import { GetUser } from '../auth/decorator'
import { ConnectionArgs } from '../page/connection-args.dto'
import { LearnSessionsService } from './learn-sessions.service'

@Controller('learn-sessions')
export class LearnSessionsController {
  constructor(private readonly learnSessionsService: LearnSessionsService) {}

  @Get()
  findAll(
    @GetUser('id') userId: string,
    @Query() connectionArgs: ConnectionArgs,
  ) {
    return this.learnSessionsService.findAll(userId, connectionArgs)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.learnSessionsService.findOne(id, userId)
  }
}
