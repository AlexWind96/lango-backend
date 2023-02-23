import { ApiProperty } from '@nestjs/swagger'
import { LearnSession } from '@prisma/client'

export class LearnSessionEntity implements LearnSession {
  @ApiProperty() id: string
  @ApiProperty() createdAt: Date
  @ApiProperty() isCompleted: boolean
  @ApiProperty() countOfCompleted: number
  @ApiProperty() rightAnswers: number

  @ApiProperty() userId: string
  @ApiProperty() user: {
    learnGoal: number
  }

  constructor(partial: Partial<LearnSessionEntity>) {
    Object.assign(this, partial)
  }
}
