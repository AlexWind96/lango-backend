import { ApiProperty } from '@nestjs/swagger'
import { LEARN_STATUS, CardLearnProgress } from '@prisma/client'

export class CardLearnProgressEntity implements CardLearnProgress {
  @ApiProperty() id: string
  @ApiProperty() cardId: string
  @ApiProperty() step: number
  @ApiProperty() views: number
  @ApiProperty() status: LEARN_STATUS
  @ApiProperty() threshold: number
  @ApiProperty() consecutiveCorrectAnswers: number
  @ApiProperty() lastRepetitionDate: Date | null
  @ApiProperty() nextRepetitionDate: Date | null

  constructor(partial: Partial<CardLearnProgressEntity>) {
    Object.assign(this, partial)
  }
}
