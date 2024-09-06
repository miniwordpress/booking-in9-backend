import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
  //TODO: auth guard
  //import { AuthGuard } from './auth.guard';
  import { AuthService } from '../service/auth.service';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('generate')
    async generateToken(@Body('users_id') users_id: bigint, @Body('type') type: string) {
        return { token: await this.authService.generateToken(users_id, type) };
    }
  }