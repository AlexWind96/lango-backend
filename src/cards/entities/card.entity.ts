import { ApiProperty } from '@nestjs/swagger'
import { Card, SentenceUnit, CardLearnProgress } from '@prisma/client'

export class CardEntity implements Card {
  @ApiProperty() id: string
  @ApiProperty() createdAt: Date
  @ApiProperty() updatedAt: Date
  @ApiProperty() sentence: SentenceUnit[]
  @ApiProperty() sentenceText: string
  @ApiProperty() phraseTranslation: string
  @ApiProperty({ required: false, nullable: true }) sentenceTranslation:
    | string
    | null

  @ApiProperty({ required: false, nullable: true }) notes: string | null
  @ApiProperty() userId: string
  @ApiProperty() moduleId: string
  @ApiProperty() progress?: CardLearnProgress

  constructor(partial: Partial<CardEntity>) {
    Object.assign(this, partial)
  }
}
