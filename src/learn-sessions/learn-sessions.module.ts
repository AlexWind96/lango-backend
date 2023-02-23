import { Module } from '@nestjs/common'
import { LearnSessionsService } from './learn-sessions.service'
import { LearnSessionsController } from './learn-sessions.controller'

@Module({
  controllers: [LearnSessionsController],
  providers: [LearnSessionsService],
})
export class LearnSessionsModule {}
