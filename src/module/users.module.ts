import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersAccount } from 'src/entity/users.account';
import { UsersController } from 'src/controller/users.controller';
import { UsersService } from 'src/service/users.service';
import { Token } from 'src/entity/token';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersAccount, Token]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }