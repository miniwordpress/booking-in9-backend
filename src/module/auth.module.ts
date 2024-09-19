import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { AuthService } from 'src/service/auth.service';
import { AuthController } from 'src/controller/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/entity/token';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersAccount } from 'src/entity/users.account';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    TypeOrmModule.forFeature([Token, UsersAccount]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}