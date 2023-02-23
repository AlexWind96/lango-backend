import { Module } from '@nestjs/common'
import { CurrentLearnSessionService } from './current-learn-session.service'
import { CurrentLearnSessionController } from './current-learn-session.controller'

@Module({
  controllers: [CurrentLearnSessionController],
  providers: [CurrentLearnSessionService],
  exports: [CurrentLearnSessionService],
})
export class CurrentLearnSessionModule {}
