import { Module } from '@nestjs/common'
import { AppController } from 'src/controller/app.controller'
import { AppService } from 'src/service/app.service'
import { ConfigModule } from '@nestjs/config'
import { HealthModule } from './health.module'
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
export class AppModule { }