import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AppController } from 'src/controller/app.controller'
import { AppService } from 'src/service/app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HealthModule } from './health.module'
import { MockUpModule } from './mockup.module'
import { HttpModule } from '@nestjs/axios'
import { UsersModule } from './users.module'
import { AuthModule } from './auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from 'src/entity/users'
import { Token } from 'src/entity/token'
import { MailerModule } from '@nestjs-modules/mailer'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from 'src/auth/constants'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from 'src/auth/auth.guard'
import { LoggerMiddleware } from 'src/logger/logger.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ({
          transport: {
            host: configService.get<string>('MAIL_HOST'),
            port: configService.get<number>('MAIL_PORT'),
            secure: false,
            // auth: {
            //   user: configService.get<string>('MAIL_USER'),
            //   pass: configService.get<string>('MAIL_PASSWORD'),
            // },
          },
          defaults: {
            from: '"No Reply" <noreply@example.com>',
          },
        })
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Users, Token],
        synchronize: true,
      }),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: jwtConstants.secret,
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    UsersModule,
    HttpModule,
    HealthModule,
    MockUpModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
  }
}
