import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection'
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Page } from 'src/page/page.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateCardDto } from './dto/create-card.dto'
import { UpdateCardDto } from './dto/update-card.dto'
import { CardEntity } from './entities/card.entity'
import { CurrentLearnSessionService } from '../current-learn-session/current-learn-session.service'
import {
  changeCardProgressNegative,
  changeCardProgressPositive,
  getLearnCard,
  getNextLearnCard,
} from './helpers'
import { ConnectionArgs } from '../page/connection-args.dto'

@Injectable()
export class CardsService {
  entityName = 'Card'

  constructor(
    private prisma: PrismaService,
    private readonly currentLearnSessionService: CurrentLearnSessionService,
  ) {}

  async create(
    createCardDto: CreateCardDto,
    userId: string,
  ): Promise<CardEntity> {
    const module = await this.prisma.module.findFirst({
      where: {
        id: createCardDto.moduleId,
      },
    })
    if (!module) {
      throw new NotFoundException(`Module is not found`)
    }
    const card = await this.prisma.card.create({
      data: {
        phraseTranslation: createCardDto.phraseTranslation,
        sentenceTranslation: createCardDto.sentenceTranslation,
        notes: createCardDto.notes,
        sentenceText: createCardDto.sentenceText,
        userId,
        moduleId: createCardDto.moduleId,
        sentence: {
          create: createCardDto.sentence,
        },
      },
      include: {
        sentence: true,
      },
    })

    await this.prisma.cardLearnProgress.create({
      data: {
        cardId: card.id,
      },
    })

    return card
  }

  async findAll(
    queryOptions: Pick<Prisma.CardFindManyArgs, 'orderBy' | 'where'>,
    paginateOptions: ConnectionArgs,
  ) {
    const page = await findManyCursorConnection(
      (args: Prisma.CardFindManyArgs) =>
        this.prisma.card.findMany({
          ...args,
          where: queryOptions.where,
          include: { sentence: true, progress: true, module: true },
          orderBy: queryOptions.orderBy,
        }),
      () => this.prisma.card.count({ where: queryOptions.where }),
      paginateOptions,
    )
    return new Page<CardEntity>(page)
  }

  async findOne(id: string, userId: string) {
    const card = await this.prisma.card.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        sentence: true,
      },
    })
    if (!card) {
      throw new NotFoundException(`${this.entityName} is not found`)
    }
    return card
  }

  async update(
    id: string,
    userId: string,
    updateCardDto: UpdateCardDto,
  ): Promise<CardEntity> {
    const card = await this.findOne(id, userId)
    if (!card) {
      throw new NotFoundException(`${this.entityName} is not found`)
    }
    if (card.userId !== userId) {
      throw new ForbiddenException()
    }
    return this.prisma.card.update({
      where: {
        id,
      },
      data: {
        phraseTranslation: updateCardDto.phraseTranslation,
        sentenceTranslation: updateCardDto.sentenceTranslation,
        notes: updateCardDto.notes,
        sentenceText: updateCardDto.sentenceText,
        moduleId: updateCardDto.moduleId,
        sentence: updateCardDto.sentence && {
          deleteMany: {
            cardId: id,
          },
          createMany: { data: updateCardDto.sentence },
        },
      },
      include: {
        sentence: true,
      },
    })
  }

  async remove(id: string, userId: string): Promise<CardEntity> {
    const card = await this.findOne(id, userId)
    if (!card) {
      throw new NotFoundException(`${this.entityName} is not found`)
    }
    if (card.userId !== userId) {
      throw new ForbiddenException()
    }

    return this.prisma.card.delete({
      where: {
        id,
      },
      include: {
        sentence: true,
      },
    })
  }

  async registerRightAnswer(id: string, userId: string) {
    const progress = await this.prisma.cardLearnProgress.findUnique({
      where: {
        cardId: id,
      },
    })
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!progress) {
      throw new NotFoundException(`Card progress is not found`)
    }

    await this.currentLearnSessionService.incrementCount(userId, true)

    return this.prisma.cardLearnProgress.update({
      where: {
        cardId: id,
      },
      data: changeCardProgressPositive(progress, user),
    })
  }

  async registerView(id: string, userId: string) {
    const progress = await this.prisma.cardLearnProgress.findUnique({
      where: {
        cardId: id,
      },
    })
    if (!progress) {
      throw new NotFoundException(`Card progress is not found`)
    }

    return this.prisma.cardLearnProgress.update({
      where: {
        cardId: id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    })
  }

  async registerWrongAnswer(id: string, userId: string) {
    const progress = await this.prisma.cardLearnProgress.findUnique({
      where: {
        cardId: id,
      },
    })
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!progress) {
      throw new NotFoundException(`Card progress is not found`)
    }
    //Update current learn session
    await this.currentLearnSessionService.incrementCount(userId, false)
    //Update progress
    console.log(changeCardProgressNegative(progress, user))
    return await this.prisma.cardLearnProgress.update({
      where: {
        cardId: id,
      },
      data: changeCardProgressNegative(progress, user),
    })
  }

  async findLearnCard(userId: string): Promise<CardEntity | null> {
    const currentSession = await this.prisma.currentLearnSession.findUnique({
      where: {
        userId,
      },
    })
    if (!currentSession) {
      throw new NotFoundException(`${this.entityName} is not found`)
    }
    //If no modules
    const modules = currentSession.modules.map((id) => {
      return {
        moduleId: id,
      }
    })
    let cards
    if (modules.length === 0) {
      cards = await this.prisma.card.findMany({
        where: {
          userId,
        },
        include: {
          progress: true,
          sentence: true,
        },
      })
    } else {
      cards = await this.prisma.card.findMany({
        where: {
          OR: modules,
        },
        include: {
          progress: true,
          sentence: true,
        },
      })
    }

    return getLearnCard(cards)
  }

  async findNextLearnCard(userId: string): Promise<CardEntity | null> {
    const currentSession = await this.prisma.currentLearnSession.findUnique({
      where: {
        userId,
      },
    })
    if (!currentSession) {
      throw new NotFoundException(`${this.entityName} is not found`)
    }
    //If no modules
    const modules = currentSession.modules.map((id) => {
      return {
        moduleId: id,
      }
    })
    let cards
    if (modules.length === 0) {
      cards = await this.prisma.card.findMany({
        where: {
          userId,
        },
        include: {
          progress: true,
          sentence: true,
        },
      })
    } else {
      cards = await this.prisma.card.findMany({
        where: {
          OR: modules,
        },
        include: {
          progress: true,
          sentence: true,
        },
      })
    }

    return getNextLearnCard(cards)
  }
}
