import { Module } from '@nestjs/common'
import { AppController } from 'src/controller/app.controller'
import { AppService } from 'src/service/app.service'
import { ConfigModule } from '@nestjs/config'
import { HealthModule } from './health.module'
import { UsersService } from 'src/service/users.service'
import { UsersController } from 'src/controller/users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HttpModule } from '@nestjs/axios'
import { UsersAccount } from 'src/entity/users.account'
import { Token } from 'src/entity/token'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'passw0rdIn9',
      database: 'postgres',
      entities: [UsersAccount, Token],
      synchronize: true,
    }), TypeOrmModule.forFeature([UsersAccount, Token]),
    HttpModule,
    HealthModule
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule { }