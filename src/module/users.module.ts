import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from 'src/entity/users'
import { UsersController } from 'src/controller/users.controller'
import { UsersService } from 'src/service/users.service'
import { Token } from 'src/entity/token'
import { AuthService } from 'src/service/auth.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    TypeOrmModule.forFeature([Users, Token]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule { }