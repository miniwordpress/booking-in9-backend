import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersAccount } from '../entity/users.account';
import { CreateUserRequest } from '../dto/request/create.user.request';
import encryptedPassword from '../utils/encrypted.password';
import { UpdateUserRequest } from 'src/dto/request/update.user.request';
import { Token } from 'src/entity/token';
import { AuthService } from './auth.service';
import { ForgotPasswordRequest } from 'src/dto/request/forgot.password.user.request';
import { send } from 'process';
import { TokenType } from 'src/enum/token.type';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(UsersAccount)
    private usersAccountRepository: Repository<UsersAccount>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async createUser(createUsersRequest: CreateUserRequest): Promise<UsersAccount> {
    let userData = new UsersAccount();
    let passwordGenerated = this.generatePassword();

    const existingUser = await this.usersAccountRepository.findOne({
      where: [
        { email: createUsersRequest.email },
        { id_number: createUsersRequest.idNumber }
      ]
    });

    if (existingUser) {
      throw new Error('Email or ID number duplicate');
    }

    userData.first_name = createUsersRequest.firstName;
    userData.last_name = createUsersRequest.lastName;
    userData.email = createUsersRequest.email;
    userData.tel = createUsersRequest.tel;
    userData.id_number = createUsersRequest.idNumber;
    userData.img = createUsersRequest.img;
    userData.status = createUsersRequest.status;
    userData.role = createUsersRequest.role;
    userData.description = createUsersRequest.description;
    userData.password = encryptedPassword(passwordGenerated);
    userData.created_at = new Date();
    userData.updated_at = new Date();

    try {
      let saveUserData = await this.usersAccountRepository.save(userData);

      if (saveUserData !== null) {
        await this.authService.generateToken(userData.id);
        await this.sendVerifyRegister(userData.id, createUsersRequest.language);
        userData.password = passwordGenerated;

        return userData;
      }
    } catch (error) {
      throw error;
    }
  }

  async sendVerifyRegister(userId: bigint, language: string): Promise<void> {
    try {
      const userAccount = await this.usersAccountRepository.findOne({ where: { id: userId } });
      return this.sendEmail(userAccount, language, TokenType.VERIFY_REGISTER);
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(): Promise<UsersAccount[]> {
    try {
      return await this.usersAccountRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async getUser(id: bigint): Promise<UsersAccount | null>{
    try {
      return await this.usersAccountRepository.findOneBy({id});
    } catch (error) {
      throw error;
    }
  }

  async updateUser(
    id: bigint,
    updateUserRequest: UpdateUserRequest,
  ): Promise<UsersAccount | null> {
    try {
      const existingUser = await this.usersAccountRepository.findOneBy({ id });

      if (!existingUser) {
        throw new Error('User account not found');
      }

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
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: bigint): Promise<void> {
    try {
      const userAccount = await this.usersAccountRepository.findOne({ where: { id } });

      if (!userAccount) {
        throw new Error('User account not found');
      }

      await this.tokenRepository.delete({ users_id: userAccount });
      await this.usersAccountRepository.delete(id.toString());
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(forgotPasswordRequest: ForgotPasswordRequest): Promise<UsersAccount> {
    try {
      const userAccount = await this.usersAccountRepository.findOne({ where: { id: forgotPasswordRequest.userId } });

      if (!userAccount) {
        throw new Error('User account not found');
      }

      if (userAccount.password !== forgotPasswordRequest.oldPassword) {
        throw new Error('Password is incorrect');
      }

      if (forgotPasswordRequest.newPassword !== forgotPasswordRequest.verifyPassword) {
        throw new Error('New password and verify password not match');
      }

      userAccount.password = forgotPasswordRequest.newPassword;
      userAccount.updated_at = new Date();

      let updatedUser = await this.usersAccountRepository.save(userAccount);

      if (updatedUser !== null) {
        await this.authService.generateToken(forgotPasswordRequest.userId);
        return  await this.usersAccountRepository.save(userAccount);
      }
    } catch (error) {
      throw error;
    }
  }

  generatePassword(): string {
    const length = 10;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let passwordValue = '';
    for (let i = 0; i < length; i++) {
      const at = Math.floor(Math.random() * charset.length);
      passwordValue += charset.charAt(at);
    }
    return passwordValue;
  }

  async sendEmail(userAccount: UsersAccount, language: string, tokenType: TokenType): Promise<any> {
    let linkVerify = "";

    try {
      //TODO: send 
      let tokenValue = await this.tokenRepository.findOne({ where: { users_id: userAccount, type: tokenType} });

      if (tokenValue !== null) {
        throw new Error('Token already exists');
      }

      await this.authService.verifyToken(tokenValue.token);

      switch (tokenType) {
        case TokenType.ACCESS_TOKEN:
          linkVerify = `http://localhost:3000/verifyRegister?${userAccount.tokenData.token}`;
          break;
        case TokenType.VERIFY_REGISTER:
          linkVerify = `http://localhost:3000/forgotPassword?${userAccount.tokenData.token}`;
          break;
        default:
          break;
      }
      return;
    } catch (error) {
      throw error;
    }
  }
}