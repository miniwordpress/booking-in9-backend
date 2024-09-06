import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersAccount } from 'src/entity/users.account';
import { UsersController } from 'src/controller/users.controller';
import { UsersService } from 'src/service/users.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'admin',
        password: 'passw0rdIn9',
        database: 'postgres',
        entities: [UsersAccount],
        synchronize: true,
      }), TypeOrmModule.forFeature([UsersAccount]),
      HttpModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }