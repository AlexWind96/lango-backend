import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
      log: ['info', 'error'],
    })
  }
  async onModuleInit() {
    await this.$connect()
  }

  async enableShutdownHooks(app: INestApplication) {
    // @ts-ignore
    process.on('beforeExit', async () => {
      await app.close()
    })
  }

  cleanDb() {
    return this.$transaction([this.user.deleteMany()])
  }
}
