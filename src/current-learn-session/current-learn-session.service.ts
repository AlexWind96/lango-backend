import { Injectable } from '@nestjs/common'
import { CurrentLearnSession } from '@prisma/client'
import * as moment from 'moment'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateCurrentLearnSessionDto } from './dto/update-current-learn-session.dto'

@Injectable()
export class CurrentLearnSessionService {
  constructor(private prismaService: PrismaService) {}

  async recreateCurrentLearnSession(
    userId: string,
  ): Promise<CurrentLearnSession> {
    const deletedSession = await this.prismaService.currentLearnSession.delete({
      where: {
        userId,
      },
    })
    return await this.prismaService.currentLearnSession.create({
      data: {
        modules: deletedSession.modules,
        userId,
      },
    })
  }

  async getCurrentLearnSession(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        currentSession: true,
        learnGoal: true,
      },
    })

    if (user.currentSession) {
      const isTodaySession = moment(user.currentSession.createdAt).isSame(
        moment().utc(),
        'day',
      )
      if (isTodaySession) {
        return user.currentSession
      } else {
        await this.prismaService.learnSession.create({
          data: {
            id: user.currentSession.id,
            userId: userId,
            isCompleted:
              user.currentSession.countOfCompleted === user.learnGoal,
            countOfCompleted: user.currentSession.countOfCompleted,
            rightAnswers: user.currentSession.rightAnswers,
          },
        })
        return await this.recreateCurrentLearnSession(userId)
      }
    } else {
      return await this.prismaService.currentLearnSession.create({
        data: {
          modules: [],
          userId,
        },
      })
    }
  }

  async completeCurrentLearnSession(userId: string): Promise<null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        currentSession: true,
        learnGoal: true,
      },
    })

    await this.prismaService.learnSession.create({
      data: {
        id: user.currentSession.id,
        userId: userId,
        isCompleted: true,
        countOfCompleted: user.currentSession.countOfCompleted,
        rightAnswers: user.currentSession.rightAnswers,
      },
    })

    await this.recreateCurrentLearnSession(userId)

    return null
  }

  async updateModules(userId: string, dto: UpdateCurrentLearnSessionDto) {
    if (dto.folderId) {
      const modules = await this.prismaService.module.findMany({
        where: {
          folderId: dto.folderId,
        },
      })
      return await this.prismaService.currentLearnSession.update({
        where: {
          userId,
        },
        data: {
          modules: modules.map((module) => module.id),
        },
      })
    }
    return await this.prismaService.currentLearnSession.update({
      where: {
        userId,
      },
      data: {
        modules: dto.modules,
      },
    })
  }

  async incrementCount(userId: string, isRight?: boolean) {
    const session = await this.prismaService.currentLearnSession.update({
      where: {
        userId,
      },
      data: {
        countOfCompleted: {
          increment: 1,
        },
        rightAnswers: {
          increment: isRight ? 1 : 0,
        },
      },
      include: {
        user: true,
      },
    })
    if (session.user.learnGoal < session.countOfCompleted) {
      await this.completeCurrentLearnSession(userId)
    }
  }
}
