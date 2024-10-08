import { forwardRef, Module } from '@nestjs/common'
import { UsersModule } from './users.module'
import { AuthService } from 'src/service/auth.service'
import { AuthController } from 'src/controller/auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Token } from 'src/entity/token'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Users } from 'src/entity/users'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from 'src/auth/constants'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from 'src/auth/auth.guard'

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: jwtConstants.secret,
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    TypeOrmModule.forFeature([Token, Users]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }