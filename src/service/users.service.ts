import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersAccount } from '../entity/users.account';
import { CreateUserRequest } from '../model/dto/request/create.user.request';
// import { UserAccountResponse } from '../model/dto/response/user.account.response';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersAccount)
    private usersAccountRepository: Repository<UsersAccount>,
  ) {}

  async createUser(createUsersRequest: CreateUserRequest): Promise<UsersAccount> {
    const newUser = this.usersAccountRepository.create(createUsersRequest);
    return await this.usersAccountRepository.save(newUser);
  }


}