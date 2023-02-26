import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateFolderDto {
  @IsString()
  @IsNotEmpty()
  label: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string
}
