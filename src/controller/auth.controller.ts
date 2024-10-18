import { Body, Controller, Headers, HttpException, HttpStatus, Post, Query, Req, Res, } from '@nestjs/common'
import { AuthService } from '../service/auth.service'
import { TokenResponse } from 'src/dto/response/token-response'
import { TokenModel } from 'src/dto/models/token.model'
import { SignInRequest } from 'src/dto/models/request/sign-in-request'
import { Request, Response } from 'express'
import { BaseResponse } from 'src/dto/response/base-response'
import { Public } from 'src/auth/auth.guard'
import { User } from 'src/utils/user.decorator'
import { UserContext } from 'src/dto/models/user-context'

@Controller('authentication')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Public()
  @Post('sign-in')
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

  @Post("sign-out")
  async signOut(
    @User() user: UserContext,
    @Res() res: Response) {
    await this.authService.signOut(user)
    return res.status(HttpStatus.NO_CONTENT).json()
  }


  // @Post('refresh-access-token')
  // async refreshAccessToken(@Query('userId') userId: number): Promise<TokenResponse> {
  //   var response = new TokenResponse()
  //   try {
  //     if (userId == null || userId == null) {
  //       response.code = HttpStatus.BAD_REQUEST.toString()
  //       response.data = null
  //       response.message = `user id null`
  //       response.cause = null

  //       throw new HttpException(response, HttpStatus.BAD_REQUEST)
  //     }

  //     let refreshToken = await this.authService.refreshAccessToken(userId)
  //     let tokenData = new TokenModel()
  //     tokenData.userId = userId
  //     tokenData.token = refreshToken.token
  //     tokenData.type = refreshToken.type
  //     tokenData.expireAt = refreshToken.expire_at
  //     tokenData.createdAt = refreshToken.created_at
  //     tokenData.usedAt = refreshToken.used_at

  //     response.code = HttpStatus.OK.toString()
  //     response.data = [tokenData]
  //     response.message = "Refresh token success"
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

}