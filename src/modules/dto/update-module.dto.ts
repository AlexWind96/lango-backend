import { PartialType } from '@nestjs/swagger'
import { CreateModuleDto } from './create-module.dto'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateModuleDto extends PartialType(CreateModuleDto) {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  folderId?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  label?: string
}
