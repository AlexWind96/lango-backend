import { ConnectionArgs } from '../../page/connection-args.dto'
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { SortType } from '../../constants/biz.constants'
import { unknownToNumber } from '../../transformers/value.transformer'

export enum CardOrderByFields {
  Progress = 'progress',
  CreatedAt = 'createdAt',
  Views = 'views',
}

export class GetCardsDto extends ConnectionArgs {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @Type(() => String)
  moduleId?: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn([
    CardOrderByFields.Progress,
    CardOrderByFields.CreatedAt,
    CardOrderByFields.Views,
  ])
  orderBy?: CardOrderByFields

  @IsIn([SortType.Asc, SortType.Desc])
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  sort?: SortType

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  keywords?: string

  @Min(1)
  @Max(5)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  step?: number
}
