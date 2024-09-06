import { NestFactory } from '@nestjs/core'
import { AppModule } from './module/app.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "*",
      methods: "GET,POST,PUT,PATCH,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204
    }
  })
  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT')
  await app.listen(3000)
}
bootstrap()