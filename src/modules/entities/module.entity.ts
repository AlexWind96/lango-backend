import { ApiProperty } from '@nestjs/swagger'
import { Module } from '@prisma/client'
import { CardEntity } from '../../cards/entities/card.entity'

export class ModuleEntity implements Module {
  @ApiProperty() id: string
  @ApiProperty() createdAt: Date
  @ApiProperty() updatedAt: Date
  @ApiProperty() label: string
  @ApiProperty() userId: string
  @ApiProperty() cards?: CardEntity[]
  @ApiProperty({ required: false, nullable: true }) folderId: string | null
  @ApiProperty() _count: {
    cards: number
  }
  @ApiProperty() counts?: {
    all: number
    new: number
    shown: number
    in_progress: number
    in_familiar: number
    known: number
  }
  constructor(partial: Partial<ModuleEntity>) {
    Object.assign(this, partial)
  }
}
