import { PartialType } from '@nestjs/swagger'
import { CreateModuleDto } from './create-module.dto'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { IsNullable } from 'src/utils/is-nullable.decorator'

export class UpdateModuleDto extends PartialType(CreateModuleDto) {
  @IsString()
  @IsNullable()
  @IsOptional()
  folderId?: string | null

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  label?: string
}
