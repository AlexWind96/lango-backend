import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UpdateModuleDto } from './dto/update-module.dto'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection'
import { Page } from '../page/page.dto'
import { ModuleEntity } from './entities/module.entity'
import { CreateModuleDto } from './dto/create-module.dto'
import { getCountsByProgress } from './helpers'
import { GetModulesDto } from './dto/get-modules.dto'

@Injectable()
export class ModulesService {
  entityName = 'Module'

  constructor(private prisma: PrismaService) {}

  create(
    createModuleDto: CreateModuleDto,
    userId: string,
  ): Promise<ModuleEntity> {
    return this.prisma.module.create({
      data: {
        ...createModuleDto,
        userId,
      },
      include: {
        _count: {
          select: {
            cards: true,
          },
        },
      },
    })
  }

  async findAll(userId: string, query: GetModulesDto) {
    const { folderId, ...connectionArgs } = query
    const where: Prisma.ModuleWhereInput = {
      userId,
      folderId: folderId === 'without_folder' ? null : folderId,
    }

    const page = await findManyCursorConnection(
      (args: Prisma.ModuleFindManyArgs) =>
        this.prisma.module.findMany({
          ...args,
          where,
          include: {
            _count: {
              select: {
                cards: true,
              },
            },
          },
        }),
      () => this.prisma.module.count({ where }),
      connectionArgs,
    )
    return new Page<ModuleEntity>(page)
  }

  async findOne(id: string, userId: string): Promise<ModuleEntity> {
    const module = await this.prisma.module.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        _count: {
          select: {
            cards: true,
          },
        },
        cards: {
          select: {
            progress: true,
          },
        },
      },
    })
    const countsByProgress = getCountsByProgress(module.cards)
    if (!module) {
      throw new NotFoundException(`${this.entityName} is not found`)
    }
    return { ...module, counts: countsByProgress, cards: undefined }
  }

  async update(
    id: string,
    userId: string,
    updateModuleDto: UpdateModuleDto,
  ): Promise<ModuleEntity> {
    const module = await this.findOne(id, userId)
    if (!module) {
      throw new NotFoundException(`${this.entityName} is not found`)
    }
    if (module.userId !== userId) {
      throw new ForbiddenException()
    }
    return this.prisma.module.update({
      where: {
        id,
      },
      data: {
        ...updateModuleDto,
      },
      include: {
        _count: {
          select: {
            cards: true,
          },
        },
      },
    })
  }

  async remove(
    id: string,
    userId: string,
  ): Promise<Omit<ModuleEntity, '_count'>> {
    const module = await this.findOne(id, userId)
    if (!module) {
      throw new NotFoundException(`${this.entityName} is not found`)
    }
    if (module.userId !== userId) {
      throw new ForbiddenException()
    }

    return await this.prisma.module.delete({
      where: {
        id,
      },
    })
  }
}
