import { IsNotEmpty, IsString } from 'class-validator'

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  label: string
}
