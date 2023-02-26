import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class ConnectionArgs {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  first?: number

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  last?: number

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  after?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  before?: string
}
