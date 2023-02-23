import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ConnectionArgs } from '../page/connection-args.dto'
import { Prisma } from '@prisma/client'
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection'
import { Page } from '../page/page.dto'
import { LearnSessionEntity } from './entities/learn-session.entity'

@Injectable()
export class LearnSessionsService {
  entityName = 'LearnSession'

  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, connectionArgs: ConnectionArgs) {
    const where: Prisma.LearnSessionWhereInput = {
      userId,
    }
    const page = await findManyCursorConnection(
      (args: Prisma.LearnSessionFindManyArgs) =>
        this.prisma.learnSession.findMany({
          ...args,
          where,
          include: {
            user: {
              select: {
                learnGoal: true,
              },
            },
          },
        }),
      () => this.prisma.learnSession.count({ where }),
      connectionArgs,
    )
    return new Page<LearnSessionEntity>(page)
  }

  async findOne(id: string, userId: string): Promise<LearnSessionEntity> {
    const learnSession = await this.prisma.learnSession.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        user: {
          select: {
            learnGoal: true,
          },
        },
      },
    })
    if (!learnSession) {
      throw new NotFoundException(`${this.entityName} is not found`)
    }
    return learnSession
  }
}
