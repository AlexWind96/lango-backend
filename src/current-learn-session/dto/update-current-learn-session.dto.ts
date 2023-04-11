import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateCurrentLearnSessionDto {
  @IsNotEmpty()
  @IsArray()
  modules: string[]

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  folderId?: string
}
