import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query, Request, UseGuards } from '@nestjs/common';
  //TODO: auth guard
  //import { AuthGuard } from './auth.guard';
  import { AuthService } from '../service/auth.service';
import { TokenResponse } from 'src/dto/response/token.response';
import { TokenModel } from 'src/dto/models/token.model';
import * as bcrypt from 'bcryptjs';

  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('generateVerifyToken')
    async generateToken(@Query('id') usersId: bigint): Promise<TokenResponse>{
      var response = new TokenResponse();

      if (usersId == null) {
        response.code = HttpStatus.BAD_REQUEST.toString(); 
        response.data = null;
        response.message = `users id null`;
        response.cause = null;

        throw new HttpException(response, HttpStatus.BAD_REQUEST);
      }
  
      try {
       let generateToken = await this.authService.generateToken(usersId);
       let tokenData = new TokenModel();
        tokenData.userId = usersId;
        tokenData.token = generateToken;
  
        response.code = HttpStatus.CREATED.toString(); 
        response.data = [tokenData];
        response.message = "Create token verify success";
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

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() username: string, password: string): Promise<any> {
      return this.authService.signIn(username, password);
    }
  }