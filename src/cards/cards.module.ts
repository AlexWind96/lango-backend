import { Module } from '@nestjs/common'
import { CardsService } from './cards.service'
import { CardsController } from './cards.controller'
import { CurrentLearnSessionModule } from '../current-learn-session/current-learn-session.module'

@Module({
  controllers: [CardsController],
  providers: [CardsService],
  imports: [CurrentLearnSessionModule],
})
export class CardsModule {}
