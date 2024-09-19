import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { TokenResponse } from 'src/dto/response/token.response';
import { TokenModel } from 'src/dto/models/token.model';
import { UsersAccountResponse } from 'src/dto/response/user.account.response';
import { UserAccountModel } from 'src/dto/models/user.account.model';
  
@Controller('authentication')
  export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signIn')
    async signIn(@Query('email') email: string, @Query('password') password: string): Promise<UsersAccountResponse> {
      var response = new UsersAccountResponse();

      try {
        if (email == null || password == null) {
          response.code = HttpStatus.BAD_REQUEST.toString(); 
          response.data = null;
          response.message = `email or password null`;
          response.cause = null;
  
          throw new HttpException(response, HttpStatus.BAD_REQUEST);
        }

        let signInData = await this.authService.signIn(email, password);
        let userAccountModel = new UserAccountModel();
        userAccountModel.id = signInData.id;
        userAccountModel.firstName = signInData.first_name;
        userAccountModel.lastName = signInData.last_name;
        userAccountModel.email = signInData.email;
        userAccountModel.password = signInData.password;
        userAccountModel.tel = signInData.tel;
        userAccountModel.idNumber = signInData.id_number;
        userAccountModel.img = signInData.img;
        userAccountModel.status = signInData.status;
        userAccountModel.role = signInData.role;
        userAccountModel.description = signInData.description;
        userAccountModel.createdAt = signInData.created_at;
        userAccountModel.updatedAt = signInData.updated_at;

        response.code = HttpStatus.OK.toString();
        response.data = [userAccountModel];
        response.message = "Sign in success";
        response.cause = null;
        return response;
      } catch (error) {
        response.code = error.code;
        response.data = null;
        response.message = error.message;
        response.cause = error.cause ?? null;
        return response;
      }
    }

    @Delete('signOut')
    async logout(@Query('userId') userId: bigint): Promise<UsersAccountResponse> {
      var response = new UsersAccountResponse();

      try {
        if (userId == null || userId == null) {
          response.code = HttpStatus.BAD_REQUEST.toString(); 
          response.data = null;
          response.message = `username or password null`;
          response.cause = null;
  
          throw new HttpException(response, HttpStatus.BAD_REQUEST);
        }

        await this.authService.signOut(userId);

        response.code = HttpStatus.OK.toString();
        response.data = null;
        response.message = "Sign out success";
        response.cause = null;
        return response;
      } catch (error) {
        response.code = error.code;
        response.data = null;
        response.message = error.message;
        response.cause = error.cause ?? null;
        return response;
      }
    }

    @Patch('refreshAccessToken')
    async refreshAccessToken(@Query('userId') userId: bigint): Promise<TokenResponse> {
      var response = new TokenResponse();
      try {
        if (userId == null || userId == null) {
          response.code = HttpStatus.BAD_REQUEST.toString(); 
          response.data = null;
          response.message = `user id null`;
          response.cause = null;
  
          throw new HttpException(response, HttpStatus.BAD_REQUEST);
        }

        let refreshToken = await this.authService.refreshAccessToken(userId);
        let tokenData = new TokenModel();
        tokenData.userId = userId;
        tokenData.token = refreshToken.token;
        tokenData.type = refreshToken.type;
        tokenData.expireAt = refreshToken.expire_at;
        tokenData.createdAt = refreshToken.created_at;
        tokenData.usedAt = refreshToken.used_at;

        response.code = HttpStatus.OK.toString();
        response.data = [tokenData];
        response.message = "Refresh token success";
        response.cause = null;
        return response;
      } catch (error) {
        response.code = error.code;
        response.data = null;
        response.message = error.message;
        response.cause = error.cause ?? null;
        return response;
      }
    }
  }