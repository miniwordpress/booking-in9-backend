import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AppController } from 'src/controller/app.controller'
import { AppService } from 'src/service/app.service'
import { ConfigModule } from '@nestjs/config'
import { HealthModule } from './health.module'
import { OAuthMiddleware } from '../middleware/oauth.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OAuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}