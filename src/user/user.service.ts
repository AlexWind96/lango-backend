import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { PrismaService } from '../prisma/prisma.service'
import { EditUserDto } from './dto/edit-user.dto'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async editUser(userId: string, dto: EditUserDto) {
    try {
      const user = await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      })
      delete user.hash
      return user
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials are taken')
        }
      }
      throw error
    }
  }

  async getUser(userId: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      })
      delete user.hash
      delete user.hashedRt
      return user
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials are taken')
        }
      }
      throw error
    }
  }
}
