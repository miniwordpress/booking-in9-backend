import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { ConfigService } from '@nestjs/config';
import { OAuthMiddleware } from './service/oauth.middleware.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  
  app.use(new OAuthMiddleware().use);
  await app.listen(3000);
}
bootstrap();