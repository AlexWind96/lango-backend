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
import { CardsService } from './cards.service'
import { CreateCardDto } from './dto/create-card.dto'
import { UpdateCardDto } from './dto/update-card.dto'
import { GetCardsDto } from './dto/get-cards.dto'
import { ConnectionArgs } from '../page/connection-args.dto'
import { Prisma } from '@prisma/client'

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto, @GetUser('id') userId: string) {
    return this.cardsService.create(createCardDto, userId)
  }

  @Get()
  findAll(@GetUser('id') userId: string, @Query() query: GetCardsDto) {
    const {
      last,
      first,
      before,
      after,
      orderBy = 'createdAt',
      sort = 'asc',
      keywords,
      ...filters
    } = query
    const queryOptions: Pick<Prisma.CardFindManyArgs, 'orderBy' | 'where'> = {
      where: {
        userId,
      },
    }
    const paginateOptions: ConnectionArgs = {
      last,
      first,
      before,
      after,
    }

    if (orderBy) {
      if (orderBy === 'progress') {
        queryOptions.orderBy = {
          progress: {
            step: sort,
          },
        }
      }
      if (orderBy === 'createdAt') {
        queryOptions.orderBy = {
          createdAt: sort,
        }
      }
    }
    if (filters.step) {
      queryOptions.where = {
        ...queryOptions.where,
        progress: {
          step: filters.step,
        },
      }
    }

    if (filters.moduleId) {
      queryOptions.where = {
        ...queryOptions.where,
        moduleId: filters.moduleId,
      }
    }

    if (keywords) {
      const trimmed = keywords.trim().split(' ').join('&')
      queryOptions.where = {
        ...queryOptions.where,
        OR: [
          {
            sentenceText: {
              search: trimmed,
            },
          },
          {
            phraseTranslation: {
              search: trimmed,
            },
          },
          {
            sentenceTranslation: {
              search: trimmed,
            },
          },
        ],
      }
    }

    return this.cardsService.findAll(queryOptions, paginateOptions)
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
