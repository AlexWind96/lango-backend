import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  label: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  folderId: string
}
