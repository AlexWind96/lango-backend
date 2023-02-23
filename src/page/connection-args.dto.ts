import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class ConnectionArgs {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ required: false })
  first?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ required: false })
  last?: number

  @IsOptional()
  @IsString()
  @Type(() => String)
  @ApiProperty({ required: false })
  after?: string

  @IsOptional()
  @IsString()
  @Type(() => String)
  @ApiProperty({ required: false })
  before?: string
}
