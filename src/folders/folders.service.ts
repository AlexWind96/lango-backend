import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateFolderDto } from './dto/create-folder.dto'
import { PrismaService } from '../prisma/prisma.service'
import { FolderEntity } from './entities/folder.entity'
import { ConnectionArgs } from '../page/connection-args.dto'
import { Prisma } from '@prisma/client'
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection'
import { Page } from '../page/page.dto'
import { UpdateFolderDto } from './dto/update-folder.dto'

@Injectable()
export class FoldersService {
  entityName = 'Folder'

  constructor(private prisma: PrismaService) {}

  create(
    createFolderDto: CreateFolderDto,
    userId: string,
  ): Promise<FolderEntity> {
    return this.prisma.folder.create({
      data: {
        ...createFolderDto,
        userId,
      },
      include: {
        modules: {
          include: {
            _count: {
              select: {
                cards: true,
              },
            },
          },
        },
      },
    })
  }

  async findAll(userId: string, connectionArgs: ConnectionArgs) {
    const where: Prisma.FolderWhereInput = {
      userId,
    }
    const page = await findManyCursorConnection(
      (args: Prisma.FolderFindManyArgs) =>
        this.prisma.folder.findMany({
          ...args,
          where,
          include: {
            modules: {
              include: {
                _count: {
                  select: {
                    cards: true,
                  },
                },
              },
            },
          },
        }),
      () => this.prisma.folder.count({ where }),
      connectionArgs,
    )
    return new Page<FolderEntity>(page)
  }

  async findOne(id: string, userId: string): Promise<FolderEntity> {
    return await this.prisma.folder.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        modules: {
          include: {
            _count: {
              select: {
                cards: true,
              },
            },
          },
        },
      },
    })
  }

  async update(
    id: string,
    userId: string,
    updateFolderDto: UpdateFolderDto,
  ): Promise<FolderEntity> {
    const folder = await this.findOne(id, userId)
    if (!folder) {
      throw new NotFoundException(`${this.entityName} is not found`)
    }
    if (folder.userId !== userId) {
      throw new ForbiddenException()
    }
    return this.prisma.folder.update({
      where: {
        id,
      },
      data: {
        ...updateFolderDto,
      },
      include: {
        modules: {
          include: {
            _count: {
              select: {
                cards: true,
              },
            },
          },
        },
      },
    })
  }

  async remove(
    id: string,
    userId: string,
  ): Promise<Omit<FolderEntity, '_count'>> {
    const folder = await this.findOne(id, userId)
    if (!folder) {
      throw new NotFoundException(`${this.entityName} is not found`)
    }
    if (folder.userId !== userId) {
      throw new ForbiddenException()
    }

    return await this.prisma.folder.delete({
      where: {
        id,
      },
      include: {
        modules: {
          include: {
            _count: {
              select: {
                cards: true,
              },
            },
          },
        },
      },
    })
  }
}
