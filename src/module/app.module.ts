import { Module } from '@nestjs/common'
import { AppController } from 'src/controller/app.controller'
import { AppService } from 'src/service/app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HealthModule } from './health.module'
import { MockUpModule } from './mockup.module'
import { HttpModule } from '@nestjs/axios'
import { UsersModule } from './users.module'
import { AuthModule } from './auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersAccount } from 'src/entity/users.account'
import { Token } from 'src/entity/token'
import { MailerModule } from '@nestjs-modules/mailer'

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 1025,
        secure: false,
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
    }),
    UsersModule,
    HttpModule,
    HealthModule,
    MockUpModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
