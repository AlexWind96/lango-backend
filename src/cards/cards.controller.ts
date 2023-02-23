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
import { GetUser } from 'src/auth/decorator'
import { ConnectionArgs } from 'src/page/connection-args.dto'
import { CardsService } from './cards.service'
import { CreateCardDto } from './dto/create-card.dto'
import { UpdateCardDto } from './dto/update-card.dto'

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto, @GetUser('id') userId: string) {
    return this.cardsService.create(createCardDto, userId)
  }

  @Get()
  findAll(
    @GetUser('id') userId: string,
    @Query() connectionArgs: ConnectionArgs,
    @Query('moduleId') moduleId: string,
  ) {
    return this.cardsService.findAll(userId, moduleId, connectionArgs)
  }

  @Get('learn-card')
  findLearnCard(@GetUser('id') userId: string) {
    return this.cardsService.findLearnCard(userId)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.cardsService.findOne(id, userId)
  }

  @Patch(':id/right')
  registerRightAnswer(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.cardsService.registerRightAnswer(id, userId)
  }
  @Patch(':id/wrong')
  registerWrongAnswer(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.cardsService.registerWrongAnswer(id, userId)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
    @GetUser('id') userId: string,
  ) {
    return this.cardsService.update(id, userId, updateCardDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.cardsService.remove(id, userId)
  }
}
