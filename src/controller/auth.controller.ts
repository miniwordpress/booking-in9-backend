import { Body, Controller, Headers, HttpException, HttpStatus, Post, Query, Req, Res, } from '@nestjs/common'
import { AuthService } from '../service/auth.service'
import { SignInRequest } from 'src/dto/request/sign-in.request'
import { Response } from 'express'
import { BaseResponse } from 'src/dto/response/base.response'
import { Public } from 'src/auth/auth.guard'
import { User } from 'src/utils/user.decorator'
import { UserContext } from 'src/dto/models/user-context'
import { SignInResponse } from 'src/dto/response/sign-in.response'

@Controller('authentication')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Public()
  @Post('sign-in')
  async signIn(@Body() signInRequest: SignInRequest, @Res() res: Response<BaseResponse<SignInResponse>>) {
    const { email, password } = signInRequest
    const response: BaseResponse = {
      data: await this.authService.signIn(email, password),
      message: null
    }
    return res.status(HttpStatus.ACCEPTED).json(response)
  }

  @Post("sign-out")
  async signOut(
    @User() user: UserContext,
    @Res() res: Response) {
    await this.authService.signOut(user)
    return res.status(HttpStatus.NO_CONTENT).json()
  }

}