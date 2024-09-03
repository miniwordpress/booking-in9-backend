// src/user/user.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, Patch } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UsersAccount } from 'src/entity/users.account';
import { CreateUserRequest } from 'src/model/dto/request/create.user.request';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserRequest): Promise<UsersAccount> {
  const newUser = this.userService.createUser(createUserDto);
  //TODO: logic random password, create at and update at
  //random password (lib passport, generate password) after encode string sha256
  return newUser;
}

//   @Get('getAllUsers')
//   async getAllUsers(): Promise<User[]> {
//     return await this.userService.getAllUsers();
//   }

//   @Get('getUser/:id')
//   async findOne(@Param('id') id: number): Promise<User | null> {
//     return await this.userService.getUser(id);
//   }

//   @Patch('updateUser/:id')
//   async updateUser(@Param('id') id: number, @Body() updateUserDto: UserRequest): Promise<User> { 
//     return await this.userService.updateUser(id, updateUserDto);
//   }

//   @Delete('delete/:id')
//   async deleteUser(@Param('id') id: number): Promise<void> {
//     return await this.userService.deleteUser(id);
//   }

//   @Get('check')
//   getCheckAPI(): string {
//     return this.userService.getCheckAPI();
//   }
}