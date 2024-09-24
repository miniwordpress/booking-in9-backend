import { Body, Controller, Get, Post, Res, HttpStatus, HttpException } from '@nestjs/common'
import { loginRequest } from 'src/dto/mock/request/loginRequest'
import { loginResponse } from 'src/dto/mock/response/loginResponse'
import { Response } from 'express'
import { mailDto } from '../dto/email/mailDto'
import { MockUpService } from 'src/service/mockup.service'

@Controller('mock')
export class MockUpController {
  constructor(private readonly mockUpService: MockUpService) { }

  @Post('login')
  check(@Body() loginDto: loginRequest, @Res() res: Response): Response<loginResponse> {
    const { email, password } = loginDto
    if (email == null && password == null) throw new HttpException('Please fill input', HttpStatus.BAD_REQUEST)
    if (email == "test@test.com" && password == "1234567") {
      return res.status(HttpStatus.OK).json({ token: "XXXX_TOKEN_PASS" })
    } else {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
    }
  }

  @Post("mail")
  postMail(@Body() mailDto: mailDto, @Res() res: Response) {
    return this.mockUpService.postMail(mailDto, res)
  }
}