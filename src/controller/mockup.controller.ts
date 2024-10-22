import { Body, Controller, Get, Post, Res, HttpStatus, HttpException } from '@nestjs/common'
import { loginRequest } from 'src/dto/mock/request/login.request'
import { loginResponse } from 'src/dto/mock/response/login.response'
import { Response } from 'express'
import { mailDto } from '../dto/email/mailDto'
import { MockUpService } from 'src/service/mockup.service'
import { Public } from 'src/auth/auth.guard'
import { Language } from 'src/utils/language.decorator'
import { BaseResponse } from 'src/dto/response/base.response'
import { LandingResponse } from 'src/dto/mock/response/landing.response'

@Controller('mock')
export class MockUpController {
  constructor(private readonly mockUpService: MockUpService) { }

  @Public()
  @Post('/login')
  check(@Body() loginDto: loginRequest, @Res() res: Response<loginResponse>) {
    const { email, password } = loginDto
    if (email == null && password == null) throw new HttpException('Please fill input', HttpStatus.BAD_REQUEST)
    if (email == "test@test.com" && password == "1234567") {
      return res.status(HttpStatus.OK).json({ token: "XXXX_TOKEN_PASS" })
    } else {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
    }
  }

  @Public()
  @Post("/mail")
  postMail(@Body() mailDto: mailDto, @Res() res: Response) {
    return this.mockUpService.postMail(mailDto, res)
  }

  @Public()
  @Get("/landing")
  landingPage(
    @Language() lang: string,
    @Res() res: Response<BaseResponse<LandingResponse>>
  ) {
    const response: BaseResponse = {
      data: this.mockUpService.ladingPage(),
      message: null
    }
    return res.status(HttpStatus.OK).json(response)
  }

}