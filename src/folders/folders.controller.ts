import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { FoldersService } from './folders.service'
import { GetUser } from '../auth/decorator'
import { ConnectionArgs } from '../page/connection-args.dto'
import { CreateFolderDto } from './dto/create-folder.dto'
import { UpdateFolderDto } from './dto/update-folder.dto'

@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  create(
    @Body() createFolderDto: CreateFolderDto,
    @GetUser('id') userId: string,
  ) {
    return this.foldersService.create(createFolderDto, userId)
  }

  @Get()
  findAll(
    @GetUser('id') userId: string,
    @Query() connectionArgs: ConnectionArgs,
  ) {
    return this.foldersService.findAll(userId, connectionArgs)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.foldersService.findOne(id, userId)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
    @GetUser('id') userId: string,
  ) {
    return this.foldersService.update(id, userId, updateFolderDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.foldersService.remove(id, userId)
  }
}
