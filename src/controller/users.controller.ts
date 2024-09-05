import { Controller, Get, Post, Query, Delete, Param, Body, Patch } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserRequest } from '../dto/request/create.user.request';
import { UsersAccountResponse } from '../dto/response/user.account.response';
import { UserAccountModel } from 'src/dto/models/user.account.model';
import { UpdateUserRequest } from 'src/dto/request/update.user.request';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserRequest): Promise<UsersAccountResponse> {
    var response = new UsersAccountResponse();

    if (createUserDto == null) {
      response.code = "200"; 
      response.data = null;
      response.message = `createUserDto null`;
      response.cause = null;
      return response;
    }

    try {
      const userData = await this.userService.createUser(createUserDto);
      let userAccountModel = new UserAccountModel();
      userAccountModel.id = userData.id;
      userAccountModel.firstName = userData.first_name;
      userAccountModel.lastName = userData.last_name;
      userAccountModel.email = userData.email;
      userAccountModel.password = userData.password;
      userAccountModel.tel = userData.tel;
      userAccountModel.idNumber = userData.id_number;
      userAccountModel.img = userData.img;
      userAccountModel.status = userData.status;
      userAccountModel.role = userData.role;
      userAccountModel.description = userData.description;
      userAccountModel.createdAt = userData.created_at;
      userAccountModel.updatedAt = userData.updated_at;

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
  async getAllUsers(): Promise<UsersAccountResponse> {
    var response = new UsersAccountResponse();

    try{
      const userData = await this.userService.getAllUsers();
      let usersAccount = [];

      userData.map((data) => {
        let userAccountModel = new UserAccountModel();
        userAccountModel.id = data.id;
        userAccountModel.firstName = data.first_name;
        userAccountModel.lastName = data.last_name;
        userAccountModel.email = data.email;
        userAccountModel.password = data.password;
        userAccountModel.tel = data.tel;
        userAccountModel.idNumber = data.id_number;
        userAccountModel.img = data.img;
        userAccountModel.status = data.status;
        userAccountModel.role = data.role;
        userAccountModel.description = data.description;
        userAccountModel.createdAt = data.created_at;
        userAccountModel.updatedAt = data.updated_at;
        usersAccount.push(userAccountModel);
      });

      response.code = "200"; 
      response.data = usersAccount;
      response.message = "Get all users success";
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

  @Get('getUserAccount')
  async findOneUser(@Query('id') id: number): Promise<UsersAccountResponse> {
    var response = new UsersAccountResponse();

    if (id == null || id == undefined) {
      response.code = "200"; 
      response.data = null;
      response.message = `id null or undefined`;
      response.cause = null;
      return response;
    }

    try{
      const userData = await this.userService.getUser(BigInt(id));
      
      if (userData == null || userData == undefined) {
        response.code = "200"; 
        response.data = null;
        response.message = `User id:${id} not found`;
        response.cause = null;
        return response;
      } else {
        let userAccountModel = new UserAccountModel();
        userAccountModel.id = userData.id;
        userAccountModel.firstName = userData.first_name;
        userAccountModel.lastName = userData.last_name;
        userAccountModel.email = userData.email;
        userAccountModel.password = userData.password;
        userAccountModel.tel = userData.tel;
        userAccountModel.idNumber = userData.id_number;
        userAccountModel.img = userData.img;
        userAccountModel.status = userData.status;
        userAccountModel.role = userData.role;
        userAccountModel.description = userData.description;
        userAccountModel.createdAt = userData.created_at;
        userAccountModel.updatedAt = userData.updated_at;
      
        response.code = "200"; 
        response.data = [userAccountModel];
        response.message = `Get user id:${id} success`;
        response.cause = null;
        return response;
      }
    } catch (error) {
      response.code = error.code;
      response.data = null;
      response.message = error.message;
      response.cause = error.cause;
      return response;
    }
  }

  @Patch('updateUserAccount')
  async updateUser(@Body() updateUserDto: UpdateUserRequest): Promise<UsersAccountResponse> {
    var response = new UsersAccountResponse();

    if (updateUserDto == null) {
      response.code = "200"; 
      response.data = null;
      response.message = `updateUserDto null`;
      response.cause = null;
      return response;
    }

    try{
      const userData = await this.userService.updateUser(updateUserDto.id, updateUserDto);

      if (userData == null || userData == undefined) {
        response.code = "200"; 
        response.data = null;
        response.message = `User id:${updateUserDto.id} not found`;
        response.cause = null;
        return response;
      } else {
        let userAccountModel = new UserAccountModel();
        userAccountModel.id = userData.id;
        userAccountModel.firstName = userData.first_name;
        userAccountModel.lastName = userData.last_name;
        userAccountModel.email = userData.email;
        userAccountModel.password = userData.password;
        userAccountModel.tel = userData.tel;
        userAccountModel.idNumber = userData.id_number;
        userAccountModel.img = userData.img;
        userAccountModel.status = userData.status;
        userAccountModel.role = userData.role;
        userAccountModel.description = userData.description;
        userAccountModel.createdAt = userData.created_at;
        userAccountModel.updatedAt = userData.updated_at;

        response.code = "200"; 
        response.data = [userAccountModel];
        response.message = "Success update user account";
        response.cause = null;
        return response;
      }
    } catch (error) {
      response.code = error.code;
      response.data = null;
      response.message = error.message;
      response.cause = error.cause;
      return response;
    }
  }

  @Delete('deleteUserAccount')
  async deleteUser(@Query('id') id: number): Promise<UsersAccountResponse> {
    var response = new UsersAccountResponse();

    if (id == null || id == undefined) {
      response.code = "200"; 
      response.data = null;
      response.message = `id null or undefined`;
      response.cause = null;
      return response;
    }
    
    try{
      const userData = await this.userService.deleteUser(BigInt(id));

      if (userData == null || userData == undefined) {
        response.code = "200"; 
        response.data = null;
        response.message = `User id:${id} not found`;
        response.cause = null;
        return response;
      } else {
        response.code = "200"; 
        response.data = null;
        response.message = "Success delete user account";
        response.cause = null;
        return response;
      }
    } catch (error) {
      response.code = error.code;
      response.data = null;
      response.message = error.message;
      response.cause = error.cause;
      return response;
    }
  }
}