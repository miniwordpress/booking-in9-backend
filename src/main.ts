import { NestFactory } from '@nestjs/core'
import { AppModule } from './module/app.module'
import { ConfigService } from '@nestjs/config'
import { EmojiLogger } from './logging/emoji-logger'
import { HttpExceptionFilter } from './exception/http-exception-filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new EmojiLogger(),
    cors: {
      origin: "*",
      methods: "GET,POST,PUT,PATCH,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204
    }
  })
  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT')
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port)
}
bootstrap()