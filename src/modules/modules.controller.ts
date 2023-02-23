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
import { ModulesService } from './modules.service'
import { CreateModuleDto } from './dto/create-module.dto'
import { UpdateModuleDto } from './dto/update-module.dto'
import { GetUser } from '../auth/decorator'
import { ConnectionArgs } from '../page/connection-args.dto'

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  create(
    @Body() createModuleDto: CreateModuleDto,
    @GetUser('id') userId: string,
  ) {
    return this.modulesService.create(createModuleDto, userId)
  }

  @Get()
  findAll(
    @GetUser('id') userId: string,
    @Query() connectionArgs: ConnectionArgs,
  ) {
    return this.modulesService.findAll(userId, connectionArgs)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.modulesService.findOne(id, userId)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
    @GetUser('id') userId: string,
  ) {
    return this.modulesService.update(id, userId, updateModuleDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.modulesService.remove(id, userId)
  }
}
