import { Type } from 'class-transformer'
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

export class CreateCardDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @Type(() => SentenceUnit)
  sentence: SentenceUnit[]

  @IsString()
  @IsNotEmpty()
  phraseTranslation: string

  @IsString()
  @IsNotEmpty()
  sentenceText: string

  @IsString()
  @IsNotEmpty()
  moduleId: string

  @IsString()
  @IsOptional()
  sentenceTranslation?: string

  @IsString()
  @IsOptional()
  notes?: string
}
