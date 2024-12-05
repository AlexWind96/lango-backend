import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator'

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

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  learnGoal?: number

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  growthRatio?: number

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  initialMemoryPersistence?: number
}
