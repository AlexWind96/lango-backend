import { ApiProperty } from '@nestjs/swagger'
import { LEARN_STATUS, CardLearnProgress, COMPLEXITY } from '@prisma/client'

export class CardLearnProgressEntity implements CardLearnProgress {
  @ApiProperty() id: string
  @ApiProperty() cardId: string
  @ApiProperty() interval: number
  @ApiProperty() accuracy: number
  @ApiProperty() countOfAnswers: number
  @ApiProperty() step: number
  @ApiProperty() views: number
  @ApiProperty() complexity: COMPLEXITY
  @ApiProperty() countOfRightAnswers: number
  @ApiProperty() status: LEARN_STATUS
  @ApiProperty() lastRepetitionDate: Date | null
  @ApiProperty() nextRepetitionDate: Date | null

  constructor(partial: Partial<CardLearnProgressEntity>) {
    Object.assign(this, partial)
  }
}
