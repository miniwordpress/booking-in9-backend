import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersAccount } from '../entity/users.account';
import { CreateUserRequest } from '../dto/request/create.user.request';
import generatePassword from 'src/utils/generate.password';
import { UpdateUserRequest } from 'src/dto/request/update.user.request';
// import { UserAccountResponse } from '../model/dto/response/user.account.response';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersAccount)
    private usersAccountRepository: Repository<UsersAccount>,
  ) {}

  async createUser(createUsersRequest: CreateUserRequest): Promise<UsersAccount> {
    var userData = new UsersAccount();
    userData.first_name = createUsersRequest.firstName;
    userData.last_name = createUsersRequest.lastName;
    userData.email = createUsersRequest.email;
    userData.tel = createUsersRequest.tel;
    userData.id_number = createUsersRequest.idNumber;
    userData.img = createUsersRequest.img;
    userData.status = createUsersRequest.status;
    userData.role = createUsersRequest.role;
    userData.description = createUsersRequest.description;
    userData.password = generatePassword();
    userData.created_at = new Date();
    userData.updated_at = new Date();

    const newUser = this.usersAccountRepository.create(userData);
    return newUser;
  }

  async getAllUsers(): Promise<UsersAccount[]> {
    return await this.usersAccountRepository.find();
  }

  async getUser(id: bigint): Promise<UsersAccount | null>{
    return await this.usersAccountRepository.findOneBy({id});
  }

  async updateUser(
    id: bigint,
    updateUserRequest: UpdateUserRequest,
  ): Promise<UsersAccount | null> {
    const existingUser = await this.usersAccountRepository.findOneBy({ id });
    updateUserRequest.firstName ? existingUser.first_name = updateUserRequest.firstName : existingUser.first_name;
    updateUserRequest.lastName ? existingUser.last_name = updateUserRequest.lastName : existingUser.last_name;
    updateUserRequest.email ? existingUser.email = updateUserRequest.email : existingUser.email;
    updateUserRequest.password ? existingUser.password = updateUserRequest.password : existingUser.password;
    updateUserRequest.tel ? existingUser.tel = updateUserRequest.tel : existingUser.tel;
    updateUserRequest.img ? existingUser.img = updateUserRequest.img : existingUser.img;
    updateUserRequest.status ? existingUser.status = updateUserRequest.status : existingUser.status;
    updateUserRequest.role ? existingUser.role = updateUserRequest.role : existingUser.role;
    existingUser.updated_at = new Date();

    const updatedUser = await this.usersAccountRepository.save(existingUser);
    return updatedUser;
  }

  async deleteUser(id: bigint): Promise<void> {
    await this.usersAccountRepository.delete(id.toString());
  }
}