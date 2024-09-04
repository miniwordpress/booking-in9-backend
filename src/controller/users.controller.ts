import { Controller, Get, Post, Put, Delete, Param, Body, Patch } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UsersAccount } from 'src/entity/users.account';
import { CreateUserRequest } from '../dto/request/create.user.request';
import { UsersAccountResponse } from '../dto/response/user.account.response';
import { UserAccountModel } from 'src/dto/models/user.account.model';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserRequest): Promise<UsersAccountResponse> {
    var response = new UsersAccountResponse();

    try {
      const userData = await this.userService.createUser(createUserDto);
      let userAccountModel = new UserAccountModel();
      userAccountModel.id = userData.id;
      userAccountModel.first_name = userData.first_name;
      userAccountModel.last_name = userData.last_name;
      userAccountModel.email = userData.email;
      userAccountModel.password = userData.password;
      userAccountModel.tel = userData.tel;
      userAccountModel.id_number = userData.id_number;
      userAccountModel.img = userData.img;
      userAccountModel.status = userData.status;
      userAccountModel.role = userData.role;
      userAccountModel.description = userData.description;
      userAccountModel.created_at = userData.created_at;
      userAccountModel.updated_at = userData.updated_at;

      response.code = "201"; 
      response.data = [userAccountModel];
      response.message = "Create user success";
      response.cause = null;
      return response;
    } catch (error) {
      response.code = error.code;
      response.data = null;
      response.message = error.message;
      response.cause = error.cause;
      return response;
    }
  }

  @Get('getUsersAccount')
  async getAllUsers(): Promise<UsersAccount[]> {
    return await this.userService.getAllUsers();
  }

  @Get('getUserAccount')
  async findOneUser(@Param('id') id: bigint): Promise<UsersAccountResponse> {
    var response = new UsersAccountResponse();

    try{
      const userData = await this.userService.getUser(id);
      let userAccountModel = new UserAccountModel();
      userAccountModel.id = userData.id;
      userAccountModel.first_name = userData.first_name;
      userAccountModel.last_name = userData.last_name;
      userAccountModel.email = userData.email;
      userAccountModel.password = userData.password;
      userAccountModel.tel = userData.tel;
      userAccountModel.id_number = userData.id_number;
      userAccountModel.img = userData.img;
      userAccountModel.status = userData.status;
      userAccountModel.role = userData.role;
      userAccountModel.description = userData.description;
      userAccountModel.created_at = userData.created_at;
      userAccountModel.updated_at = userData.updated_at;

      response.code = "200"; 
      response.data = [userAccountModel];
      response.message = "success";
      response.cause = null;
      return response;
    } catch (error) {
      response.code = error.code;
      response.data = null;
      response.message = error.message;
      response.cause = error.cause;
      return response;
    
    }
  }

//   @Patch('updateUser/:id')
//   async updateUser(@Param('id') id: number, @Body() updateUserDto: UserRequest): Promise<User> { 
//     return await this.userService.updateUser(id, updateUserDto);
//   }

//   @Delete('delete/:id')
//   async deleteUser(@Param('id') id: number): Promise<void> {
//     return await this.userService.deleteUser(id);
//   }
}