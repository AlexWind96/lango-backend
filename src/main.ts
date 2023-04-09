import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { PrismaClientExceptionFilter } from './global/exceptions'
import helmet from 'helmet'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.setGlobalPrefix('api')
  app.use(cookieParser())
  //ts-ignore
  app.use(helmet())
  // binds ValidationPipe to the entire application
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  // apply transform to all responses
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  // apply PrismaClientExceptionFilter
  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

  //Swagger setup
  const config = new DocumentBuilder()
    .setTitle('API Tutorial')
    .setDescription('The Tutorial API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  //Prisma setup
  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  await app.listen(process.env.PORT || 3000)
}

bootstrap()
