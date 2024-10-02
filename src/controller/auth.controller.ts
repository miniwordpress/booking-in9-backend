import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Patch, Post, Query, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { AuthService } from '../service/auth.service'
import { TokenResponse } from 'src/dto/response/token.response'
import { TokenModel } from 'src/dto/models/token.model'
import { UsersAccountResponse } from 'src/dto/response/user.response'
import { UserAccountModel } from 'src/dto/models/user.model'
import { ForgotPasswordRequest } from 'src/dto/models/request/forgot.password.user.request'
import { ForgotPasswordResponse } from 'src/dto/response/forgot.password.response'
import { ForgotPasswordModel } from 'src/dto/models/forgot.password.model'
import { SignInRequest } from 'src/dto/models/request/signin-request'
import { Response } from 'express'
import { BaseResponse } from 'src/dto/response/base-response'

@Controller('authentication')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signIn')
  async signIn(@Body() signInRequest: SignInRequest, @Res() res: Response<BaseResponse>) {
    const { email, password } = signInRequest
    try {
      if (email == null || password == null) {
        res.status(HttpStatus.BAD_REQUEST).json(new BaseResponse(
          HttpStatus.BAD_REQUEST.toString(),
          `email or password null`,
          null,
          null
        ))
        throw new HttpException(res, HttpStatus.BAD_REQUEST)
      }
      let signInData = await this.authService.signIn(email, password)
      return res.status(HttpStatus.ACCEPTED).json(new BaseResponse(
        "0000",
        "Signin success",
        signInData,
        null
      ))
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json(new BaseResponse(
        "AUT001",
        error.message,
        null,
        null
      ))
    }
  }

  // @Delete('signOut')
  // async logout(@Query('userId') userId: number): Promise<UsersAccountResponse> {
  //   var response = new UsersAccountResponse()

  //   try {
  //     if (userId == null || userId == null) {
  //       response.code = HttpStatus.BAD_REQUEST.toString()
  //       response.data = null
  //       response.message = `username or password null`
  //       response.cause = null

  //       throw new HttpException(response, HttpStatus.BAD_REQUEST)
  //     }

  //     await this.authService.signOut(userId)

  //     response.code = HttpStatus.OK.toString()
  //     response.data = null
  //     response.message = "Sign out success"
  //     response.cause = null
  //     return response
  //   } catch (error) {
  //     response.code = error.code
  //     response.data = null
  //     response.message = error.message
  //     response.cause = error.cause ?? null
  //     return response
  //   }
  // }

  @Patch('refreshAccessToken')
  async refreshAccessToken(@Query('userId') userId: number): Promise<TokenResponse> {
    var response = new TokenResponse()
    try {
      if (userId == null || userId == null) {
        response.code = HttpStatus.BAD_REQUEST.toString()
        response.data = null
        response.message = `user id null`
        response.cause = null

        throw new HttpException(response, HttpStatus.BAD_REQUEST)
      }

      let refreshToken = await this.authService.refreshAccessToken(userId)
      let tokenData = new TokenModel()
      tokenData.userId = userId
      tokenData.token = refreshToken.token
      tokenData.type = refreshToken.type
      tokenData.expireAt = refreshToken.expire_at
      tokenData.createdAt = refreshToken.created_at
      tokenData.usedAt = refreshToken.used_at

      response.code = HttpStatus.OK.toString()
      response.data = [tokenData]
      response.message = "Refresh token success"
      response.cause = null
      return response
    } catch (error) {
      response.code = error.code
      response.data = null
      response.message = error.message
      response.cause = error.cause ?? null
      return response
    }
  }

  @Patch("forgotPassword")
  async forgotPassword(@Body() forgotPasswordRequest: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    var response = new ForgotPasswordResponse()

    try {
      if (forgotPasswordRequest) {
        response.code = HttpStatus.BAD_REQUEST.toString()
        response.data = null
        response.message = `forgotPasswordRequest is null`
        response.cause = null

        throw new HttpException(response, HttpStatus.BAD_REQUEST)
      }

      let responseForgotPasswordData = new ForgotPasswordModel()

      response.code = HttpStatus.OK.toString()
      response.data = [responseForgotPasswordData]
      response.message = "Re-new password success"
      response.cause = null
      return response
    } catch (error) {
      response.code = error.code
      response.data = null
      response.message = error.message
      response.cause = error.cause ?? null
      return response
    }
  }
}