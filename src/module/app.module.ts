import { Module } from '@nestjs/common'
import { AppController } from 'src/controller/app.controller'
import { AppService } from 'src/service/app.service'
import { ConfigModule } from '@nestjs/config'
import { HealthModule } from './health.module'
import { MockUpModule } from './mockup.module'
import { UsersService } from 'src/service/users.service'
import { UsersController } from 'src/controller/users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HttpModule } from '@nestjs/axios'
import { UsersModule } from './users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    HealthModule,
    MockUpModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }