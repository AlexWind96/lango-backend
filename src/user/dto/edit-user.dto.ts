import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class EditUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email: string
}
