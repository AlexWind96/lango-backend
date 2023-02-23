import { IsArray, IsNotEmpty } from 'class-validator'

export class UpdateCurrentLearnSessionDto {
  @IsNotEmpty()
  @IsArray()
  modules: string[]
}
