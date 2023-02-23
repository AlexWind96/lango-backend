import { PartialType } from '@nestjs/swagger'
import { CreateCardDto } from './create-card.dto'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class SentenceUnit {
  @IsBoolean()
  @IsNotEmpty()
  isPunctuation: boolean

  @IsBoolean()
  @IsNotEmpty()
  isStudyPhrase: boolean

  @IsString()
  @IsNotEmpty()
  value: string

  @IsString()
  @IsOptional()
  translation?: string

  @IsString()
  @IsOptional()
  note?: string
}

export class UpdateCardDto extends PartialType(CreateCardDto) {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @Type(() => SentenceUnit)
  sentence: SentenceUnit[]

  @IsString()
  @IsOptional()
  phraseTranslation: string
}
