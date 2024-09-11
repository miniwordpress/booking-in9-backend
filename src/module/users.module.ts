import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersAccount } from 'src/entity/users.account';
import { UsersController } from 'src/controller/users.controller';
import { UsersService } from 'src/service/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersAccount]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }