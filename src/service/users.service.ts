import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersAccount } from '../entity/users.account';
import { CreateUserRequest } from '../dto/request/create.user.request';
import generatePassword from 'src/utils/generate.password';
// import { UserAccountResponse } from '../model/dto/response/user.account.response';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersAccount)
    private usersAccountRepository: Repository<UsersAccount>,
  ) {}

  async createUser(createUsersRequest: CreateUserRequest): Promise<UsersAccount> {
    const newUser = this.usersAccountRepository.create(createUsersRequest);
    const password = generatePassword();
    
    newUser.password = password;
    newUser.created_at = new Date();
    newUser.updated_at = new Date();

    await this.usersAccountRepository.save(newUser)
    
    return newUser;
  }

  getAllUsers(): Promise<UsersAccount[]> {
    return this.usersAccountRepository.find();
  }

  getUser(id: bigint): Promise<UsersAccount | null>{
    return this.usersAccountRepository.findOneBy({id});
  }


}