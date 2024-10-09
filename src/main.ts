import { NestFactory } from '@nestjs/core'
import { AppModule } from './module/app.module'
import { ConfigService } from '@nestjs/config'
import { Logger } from './logger/logger'
import { HttpExceptionFilter } from './exception/http-exception-filter'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
    cors: {
      origin: "*",
      methods: "GET,POST,PUT,PATCH,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204
    }
  })
  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT')
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(port)
}
bootstrap()