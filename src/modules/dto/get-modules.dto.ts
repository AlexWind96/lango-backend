import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ConnectionArgs } from '../../page/connection-args.dto'

export class GetModulesDto extends ConnectionArgs {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  folderId?: string | 'without_folder'
}
